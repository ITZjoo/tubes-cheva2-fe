# Features Waiting on Backend Support

Generated 2026-08-12. These are the frontend features/pages that currently have **no backend support at all** — not a mismatch to fix, but new backend work that needs to happen before the frontend side can be built or wired up. Scope here is intentionally FE-only: each entry describes what the frontend needs, not how the backend should implement it.

(For context: `Order detail` and `Pendapatan` were the other two gaps identified in the same audit, but both already have backend support — `GET /api/orders/:id`, `GET /api/dashboard/revenue-chart`, `GET /api/transactions/report/daily|monthly`, `GET /api/expenses` all exist today. Those are being picked up separately and aren't listed below.)

---

## 1. Notifikasi (`/notifikasi`)

**Current FE state**: `NotifikasiView.jsx` exists in the sidebar but runs entirely on local/mock state. `notifikasiService.js` exists but is never called from any view.

**What FE needs from backend**: a way for a logged-in **staff/admin** user to list their own notifications, mark them read, and (ideally) delete them.

**Why it's blocked**: the backend's notification system today is customer-facing only — `GET /api/notifications/my`, `GET /api/notifications/:customerId`, `PATCH /api/notifications/read-all`, `PATCH /api/notifications/:id/read` all require a customer JWT (`authenticateCustomer`) or take a `customerId`. There is no staff-facing equivalent, and no notification is ever created *for* a `User` (only for `Customer`, tied to order status changes).

**Open question for product/backend**: is this meant to be "notifications about things staff should know" (new orders, payments confirmed, customer chat messages — see the separate Pengaturan Notifikasi toggles below, which suggest exactly these three categories), or something else? That needs to be settled before a data model makes sense.

---

## 2. Chat (`Chatview.jsx`)

**Current FE state**: fully built UI (`ChatList.jsx`, `ChatDetailPanel.jsx`, `QuickChatModal.jsx`, `QuickReplyChips.jsx`, `PesanCepatCard.jsx`) but 100% mocked — hardcoded `INITIAL_CONVERSATIONS` array, replies just do a local state update. **Not even routed** in `AppRoutes.jsx` — there's no URL that reaches this page today.

**What FE needs from backend**: a real messaging model between staff and customers — list conversations, get messages in a conversation, send a message, and (per the existing `CannedQuestion`/quick-reply UI already built) associate a canned-question quick-reply with a sent message.

**Why it's blocked**: no `Message`/`Conversation` model exists in the Prisma schema at all. The closest existing concept is `CannedQuestion` + `CannedQuestionHistory` (a Q&A audit log), which is adjacent but not a general chat/messaging system.

---

## 3. Edit Profil Laundry (`/pengaturan/laundry`)

**Current FE state**: still the generic `SettingsPlaceholderView` stub — no form, no fields, nothing built yet.

**What FE needs from backend**: a way to read and update the laundry business's own profile info — business name, address, phone, email, and a short description, at minimum (matches the "Edit Profil Akun" pattern next to it, just for the business instead of the individual user). Since this app only ever manages one laundry business, this is naturally a single shared record, not a per-user or per-row resource.

**Why it's blocked**: no such model/table exists in the schema at all today.

---

## 4. Pengaturan Notifikasi (`/pengaturan/notifikasi`)

**Current FE state**: still `SettingsPlaceholderView`. The design reference for this page (screenshot provided earlier) shows a master "Semua Notifikasi" toggle plus three category toggles: **Pesanan Baru**, **Pembayaran Terkonfirmasi**, **Chat Pelanggan**.

**What FE needs from backend**: a way for the logged-in staff/admin user to read and update their own notification preferences — one boolean per toggle shown above, scoped to that user (each staff member should be able to opt in/out independently, not a shared setting).

**Why it's blocked**: no preference model exists. Also worth noting this is closely related to gap #1 (Notifikasi) above — the three toggle categories here (new order, payment confirmed, customer chat) look like exactly the events a staff notification inbox would need to raise, so these two features probably want to be designed together rather than separately.

---

## 5. Pengaturan Pembayaran (`/pengaturan/pembayaran`)

**Current FE state**: still `SettingsPlaceholderView`. No design reference has been provided for this page yet, so requirements below are inferred from what the app already models around payments (the `Transaction` model has `paymentMethod: CASH|QRIS|TRANSFER|EWALLET`).

**What FE needs from backend**: most likely, a way for an admin to configure which payment methods the business currently accepts, plus whatever account details are needed to receive transfers/QRIS payments (bank name, account number, account holder name, a QRIS image). This should be confirmed with an actual design/requirements pass before backend work starts, since nothing concrete has been specified yet — listed here mainly so the gap isn't forgotten, not as a firm spec.

**Why it's blocked**: no such model exists, and the requirements themselves aren't fully nailed down yet.

---

## Summary

| # | Feature | Blocked on |
|---|---|---|
| 1 | Notifikasi (staff notification inbox) | New backend concept: staff-facing notifications |
| 2 | Chat | New backend concept: Message/Conversation model |
| 3 | Edit Profil Laundry | New backend concept: business profile record |
| 4 | Pengaturan Notifikasi (toggles) | New backend concept: per-user notification preferences (related to #1) |
| 5 | Pengaturan Pembayaran | New backend concept: payment settings — needs design/requirements first, then backend |
