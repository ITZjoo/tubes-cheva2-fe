# API Integration Mismatch Report

Generated 2026-08-12, comparing `tubes-cheva2-fe` (`src/services/api.js` + every `src/modules/**/services/*.js`) against `tubes-cheva2-be` (`src/routes/*.routes.js`, controllers, `prisma/schema.prisma`) as they exist on `main` in both repos at this date.

Base URL: FE's `VITE_API_BASE_URL=http://localhost:8000/api` — all backend paths below already include the `/api` prefix, so they're directly comparable to what FE requests.

This is a **report only** — no fixes have been applied. Each item lists what FE expects, what BE actually has, and a recommended direction, so the team can decide who picks it up.

---

## Critical — breaks a whole page/flow

### 1. Public registration hits an admin-only endpoint
- **FE**: `RegisterView.jsx` → `authService.register({name,email,password,phone})` → `POST /api/register`, called from the public (unauthenticated) `/register` page.
- **BE**: `POST /api/register` requires `authenticate, adminOnly` middleware — it's "admin adds a new staff account," not public sign-up.
- **Impact**: any visitor filling out the Daftar form gets a 401. The page cannot work for anyone who isn't already a logged-in admin with a valid token.
- **Recommendation**: decide the actual product intent. If staff accounts should only ever be admin-created (this looks intentional on the backend — sane for an internal ops tool), remove/hide the public `/register` page in FE and instead build an "Add Staff" flow inside an authenticated admin screen that calls this same endpoint. If public self-registration was actually intended, that's a backend change (drop the `adminOnly` gate, or add a separate public route).

### 2. `GET /history` doesn't exist
- **FE**: `HistoryService.js` → `getHistory({search,startDate,endDate,statuses,services})` → `GET /api/history`, called from `HistoryView.jsx`.
- **BE**: no `history.routes.js`, no `/api/history` route at all. The only "history" route in the whole backend is `GET /api/canned-questions/history` (admin-only audit log of canned-question Q&A usage) — unrelated to order/activity history.
- **Impact**: the entire History page has nothing to call; it will 404 the moment it's wired to real data (the FE service file's own comment already flags the shape as speculative, written before backend confirmation).
- **Recommendation**: backend needs a real `GET /api/history` (or FE needs to be pointed at whatever endpoint actually represents "order activity history" — possibly `GET /api/orders` with status filters, since Order has `statusHistories`). Needs a product conversation on what "History" is supposed to show before building the endpoint.

### 3. Settings — profile update, password change: neither endpoint exists
- **FE**: `settingsService.js` → `updateProfile()` → `PATCH /api/me`; `changePassword()` → `PUT /api/me/password`. Called from `EditAccountView.jsx`.
- **BE**: `GET /api/me` is read-only. No self-service update-my-own-profile route for a User (staff/admin) exists anywhere. No change-password route with old-password verification exists anywhere (the only place a User's password can change is admin-only `PUT /api/users/:id`, which is "admin edits someone else," not self-service, and requires no old-password check).
- **Impact**: known already — this was flagged when `EditAccountView.jsx` was built; both calls currently 404/503.
- **Recommendation**: backend needs to add `PATCH /api/me` (name/phone, self, `authenticate`-only) and `PUT /api/me/password` (oldPassword+newPassword, self, verify oldPassword against hash before updating). Note: backend already has an analogous *customer*-facing pattern at `PUT /api/customers/me` (self-service, though it also lacks old-password verification — worth fixing there too while touching this).

### 4. Notifications — every FE call targets a nonexistent shape
- **FE**: `notifikasiService.js` expects `GET /api/notifications` (bare list), `PATCH /api/notifications/mark-read` (bulk by ids), `DELETE /api/notifications` (bulk delete by ids).
- **BE**: actual routes are `GET /api/notifications/my` (customer JWT only), `GET /api/notifications/:customerId`, `PATCH /api/notifications/read-all`, `PATCH /api/notifications/:id/read`. **There is no bulk-delete route for notifications at all.**
- **Deeper issue**: every notification route requires `authenticateCustomer` or ownership-checked `authenticateCustomerOrUser` — the notification system as built is **customer-facing**, but `NotifikasiView.jsx` lives in the staff dashboard sidebar (next to Pesanan/Layanan/Pengaturan). It's not clear the backend has any concept of "notifications for a staff member" at all.
- **Impact**: currently low — `notifikasiService.js`'s functions aren't called anywhere yet (`NotifikasiView.jsx` still uses local/mock state), so nothing is broken in production today. But this needs resolving before that page is wired to real data.
- **Recommendation**: needs a product/architecture conversation — is "Pengaturan Notifikasi" (already built) meant to configure *what customers get notified about*, or does staff need their own notification inbox? The two existing FE surfaces (`NotifikasiView.jsx` list page and the `Pengaturan Notifikasi` settings toggle page) may need different backend models entirely.

---

## High — feature will fail once wired to real data, but not yet in production use

### 5. Avatar/photo upload has no route
- **FE**: `EditAccountView.jsx`'s "Ubah Foto Profil" currently only does a local `URL.createObjectURL` preview — correctly not calling any backend endpoint yet (this was a deliberate scoping decision, not a bug).
- **BE**: `src/middleware/upload.js` (multer, disk storage, image+PDF filter) exists but is **never attached to any route** — confirmed zero `.single(`/`.array(`/`.fields(` usages anywhere in `src/routes` or `src/controllers`. No `avatarUrl`/`photo` column exists on `User` or `Customer` in the Prisma schema either.
- **Recommendation**: backend needs a new route (e.g. `POST /api/me/avatar`) wired to the existing multer middleware, plus a schema migration adding the avatar column, before FE can persist an uploaded photo.

### 6. `HistoryService.js` filename casing will break case-sensitive deployments
- Not a backend mismatch, but an integration-reliability landmine: the file on disk is `src/modules/history/services/HistoryService.js` (capital H), imported everywhere as `'../services/historyService'` (lowercase). Resolves fine on Windows/macOS; will fail module resolution on Linux CI/Docker/most production hosts.
- **Recommendation**: rename the file to `historyService.js` (or fix the import) — trivial fix, but will silently break the first Linux-based deploy/CI run otherwise.

---

## Medium — works today, but has a latent risk worth a look

### 7. Customer phone validation not enforced client-side
- **BE** `POST /api/customers` requires `phone` to be at least 10 characters (Zod schema). **FE** `OrderListView.jsx`'s inline "add new customer" flow (`customerService.createCustomer({name,phone})`) has no client-side length check, so a short phone number will round-trip to a 400 the user won't see coming from validation alone.
- **Recommendation**: add the same min-length check client-side for a better error experience; not a functional break since the backend correctly rejects invalid input.

### 8. `DELETE` with a JSON body (notifications bulk-delete)
- Even once/if a bulk-delete notifications route exists, FE's `deleteNotifications(ids)` sends the id list as a DELETE request body (`data: {ids}` in axios) rather than a query param or a POST-style route. Some middleware stacks don't parse bodies on DELETE by default — worth confirming Express's `express.json()` (global, likely fine here) actually applies before assuming this works once the route exists.

---

## Confirmed matches — no action needed

These were checked and line up correctly between FE and BE as of this audit:

- `POST /api/login` — `{email,password}`, matches.
- `POST /api/logout`, `GET /api/me` (read) — match (note: `authService.logout()` is defined but never actually called anywhere in FE code — `AuthContext.logout()` only clears local state; low-priority cleanup, not a mismatch since the backend route itself is stateless anyway).
- `GET/POST/PUT/DELETE /api/services` (aliased `/api/products`) — full CRUD matches, including the soft-delete semantics on `DELETE`.
- `GET/POST/PUT /api/customers`, `GET /api/customers/:id` — query params (`search,page,limit`) and body shapes match exactly.
- `GET/POST/PUT /api/orders`, `PATCH /api/orders/:id/status` — matches, **including** the backend's single-step status-transition constraint, which `orderService.advanceStatus()` already correctly works around by walking intermediate hops client-side.
- `GET /api/orders/tracking/:trackingToken` — path, param name, and public-no-auth access all match exactly.
- `GET /api/dashboard/stats`, `/recent-orders?limit`, `/revenue-chart?year&month` — all three match exactly, including optional query param defaults.

## Not yet called from any view (defined in FE services, currently dead code)

Not bugs, just noted so nobody assumes these paths are exercised by any existing screen: `authService.logout()`, `authService.getProfile()` (may be used inside `AuthContext` — not confirmed), `customerService.listCustomers/getCustomer/updateCustomer`, `orderService.getOrder` (`OrderDetailView.jsx` has a literal `// TODO: replace with orderService.getOrder(id)`), `orderService.updateOrder`, `orderService.trackOrder`, all of `notifikasiService.js`.
