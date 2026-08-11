# Pengaturan Settings Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/pengaturan` settings menu page (4 clickable rows matching the supplied screenshot/SVG design) and wire it into the sidebar, with placeholder destinations for each row.

**Architecture:** New `src/modules/settings/` feature module following the existing per-feature-module convention (`views/`, `components/`). The menu page (`SettingsView`) renders a static array of rows through a small presentational `SettingsRow` component; each row navigates to a placeholder route rendered by a shared `SettingsPlaceholderView`. Both views reuse the existing `PageShell` layout shell, `Icon` (Material Symbols), `ErrorState`, and `Button` components — no new dependencies.

**Tech Stack:** React 19, react-router-dom 7, Tailwind CSS v4 (tokens in `src/index.css`), Storybook 10 + `@storybook/addon-vitest` (the project's only configured automated test runner — it renders every `*.stories.jsx` file as a browser test via Vitest; there is no other unit-test framework installed, e.g. no React Testing Library).

## Global Constraints

- No new npm dependencies — use only `Icon`, `PageShell`, `ErrorState`, `Button` from `src/components/ui/*`.
- Follow the feature-module convention: files live under `src/modules/settings/{views,components}/`.
- Row labels (copy is exact, do not alter): "Edit Profil Akun", "Edit Profil Laundry", "Pengaturan Notifikasi", "Pengaturan Pembayaran".
- Page header copy (exact): title "Pengaturan", subtitle "Atur profil bisnis, akun, dan preferensi sistem Anda."
- Icons (Material Symbols Outlined names, via existing `Icon` component): `person`, `storefront`, `notifications`, `receipt_long` for the 4 rows; `chevron_right` for the row arrow.
- Styling must use existing Tailwind v4 tokens already used elsewhere in the codebase (`text-primary`, `bg-surface-container-lowest`, `border-outline-variant`, `text-h1`, `text-subtitle`, `text-body-md`) — no hardcoded hex colors, no new CSS.
- Every new route must be wrapped in `<ProtectedRoute>`, matching every other authenticated route in `src/routes/AppRoutes.jsx`.

---

### Task 1: `SettingsRow` component (icon + label + chevron card)

**Files:**
- Create: `src/modules/settings/components/SettingsRow.jsx`
- Create: `src/modules/settings/components/SettingsRow.stories.jsx`

**Interfaces:**
- Consumes: `Icon` component from `src/components/ui/Icon` (props: `name`, `size`, `className`) — already exists, no changes needed.
- Produces: `SettingsRow` default export, props `{ icon: string, label: string, to: string }`. Clicking the row calls `useNavigate()(to)`. Later tasks (`SettingsView`) import this as `import SettingsRow from '../components/SettingsRow'`.

- [ ] **Step 1: Write the Storybook story first (this is the project's only test harness — `@storybook/addon-vitest` runs every `*.stories.jsx` as a Vitest browser test)**

Create `src/modules/settings/components/SettingsRow.stories.jsx`:

```jsx
import { MemoryRouter } from 'react-router-dom'
import SettingsRow from './SettingsRow'

export default {
  title: 'Modules/Settings/SettingsRow',
  component: SettingsRow,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-2xl">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
}

export const Account = {
  args: { icon: 'person', label: 'Edit Profil Akun', to: '/pengaturan/akun' },
}

export const Laundry = {
  args: { icon: 'storefront', label: 'Edit Profil Laundry', to: '/pengaturan/laundry' },
}

export const Notifications = {
  args: { icon: 'notifications', label: 'Pengaturan Notifikasi', to: '/pengaturan/notifikasi' },
}

export const Payment = {
  args: { icon: 'receipt_long', label: 'Pengaturan Pembayaran', to: '/pengaturan/pembayaran' },
}
```

- [ ] **Step 2: Run the story test to verify it fails (component doesn't exist yet)**

Run: `npx vitest run --project storybook -t SettingsRow`
Expected: FAIL — `Failed to resolve import "./SettingsRow"` (or similar module-not-found error), since `SettingsRow.jsx` doesn't exist yet.

- [ ] **Step 3: Implement `SettingsRow`**

Create `src/modules/settings/components/SettingsRow.jsx`:

```jsx
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'

// One row = one card (not a divided list) — matches the Figma export:
// each row is independently shadowed/rounded with a gap between rows,
// not a single card with internal dividers.
export default function SettingsRow({ icon, label, to }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="w-full flex items-center justify-between gap-4 bg-white border border-outline-variant/30 rounded-2xl shadow-sm px-6 py-7 text-left hover:shadow-md hover:bg-surface-container transition-all cursor-pointer"
    >
      <span className="flex items-center gap-4">
        <Icon name={icon} size={24} className="text-primary" />
        <span className="text-subtitle text-on-surface">{label}</span>
      </span>
      <Icon name="chevron_right" size={20} className="text-on-surface-variant" />
    </button>
  )
}
```

- [ ] **Step 4: Run the story test to verify it passes**

Run: `npx vitest run --project storybook -t SettingsRow`
Expected: PASS — all 4 story exports (`Account`, `Laundry`, `Notifications`, `Payment`) render without error.

- [ ] **Step 5: Commit**

```bash
git add src/modules/settings/components/SettingsRow.jsx src/modules/settings/components/SettingsRow.stories.jsx
git commit -m "feat(settings): add SettingsRow card component"
```

---

### Task 2: `SettingsView` menu page

**Files:**
- Create: `src/modules/settings/views/SettingsView.jsx`

**Interfaces:**
- Consumes: `SettingsRow` from Task 1 (`import SettingsRow from '../components/SettingsRow'`, props `{ icon, label, to }`); `PageShell` from `src/components/ui/PageShell` (props `activeItemId`, `onItemClick`, `mainClassName`, `children` — existing component, unchanged); `useSidebarNavigate` from `src/routes/useSidebarNavigate` (existing hook, unchanged).
- Produces: `SettingsView` default export (no props). Task 4 imports it as `import SettingsView from '../modules/settings/views/SettingsView'` and mounts it at `/pengaturan`.

- [ ] **Step 1: Implement `SettingsView`**

Create `src/modules/settings/views/SettingsView.jsx`:

```jsx
import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import SettingsRow from '../components/SettingsRow'

const SETTINGS_ITEMS = [
  { id: 'akun', icon: 'person', label: 'Edit Profil Akun', to: '/pengaturan/akun' },
  { id: 'laundry', icon: 'storefront', label: 'Edit Profil Laundry', to: '/pengaturan/laundry' },
  { id: 'notifikasi', icon: 'notifications', label: 'Pengaturan Notifikasi', to: '/pengaturan/notifikasi' },
  { id: 'pembayaran', icon: 'receipt_long', label: 'Pengaturan Pembayaran', to: '/pengaturan/pembayaran' },
]

export default function SettingsView() {
  const handleSidebarNavigate = useSidebarNavigate()

  return (
    <PageShell
      activeItemId="pengaturan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <header>
        <h1 className="text-h1 text-on-surface">Pengaturan</h1>
        <p className="text-body-md text-on-surface-variant/80 font-medium mt-1">
          Atur profil bisnis, akun, dan preferensi sistem Anda.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {SETTINGS_ITEMS.map((item) => (
          <SettingsRow key={item.id} icon={item.icon} label={item.label} to={item.to} />
        ))}
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 2: Verify manually via dev server**

This view has no story/test of its own (matching the codebase convention — no other `*View.jsx` under `src/modules/*/views/` has a story or unit test; only reusable `components/ui/*` pieces do). Verify by running the app and rendering `SettingsView` directly via a temporary route, OR skip standalone verification and confirm as part of Task 4's end-to-end check (recommended — avoids a throwaway route). If you want to check it in isolation now:

Run: `npm run dev`
Then temporarily add `<Route path="/pengaturan" element={<SettingsView />} />` to `src/routes/AppRoutes.jsx` (without `ProtectedRoute`, for a quick unauthenticated look), open `http://localhost:5173/pengaturan` in a browser, confirm the 4 rows render with correct icons/labels/chevrons, then revert this temporary route edit (Task 4 adds the real one).

- [ ] **Step 3: Commit**

```bash
git add src/modules/settings/views/SettingsView.jsx
git commit -m "feat(settings): add SettingsView menu page"
```

---

### Task 3: `SettingsPlaceholderView` shared placeholder page

**Files:**
- Create: `src/modules/settings/views/SettingsPlaceholderView.jsx`

**Interfaces:**
- Consumes: `PageShell` (as above); `ErrorState` from `src/components/ui/ErrorState` (props used: `title`, `description`, `action` — existing component, unchanged, see `src/components/ui/ErrorState/ErrorState.jsx`); `Button` from `src/components/ui/Button` (props used: `variant`, `appearance`, `onClick`, `children` — existing component, unchanged); `useSidebarNavigate`; `useNavigate` from `react-router-dom`.
- Produces: `SettingsPlaceholderView` default export, props `{ title: string }`. Task 4 imports it as `import SettingsPlaceholderView from '../modules/settings/views/SettingsPlaceholderView'` and mounts it 4 times with a different `title`.

- [ ] **Step 1: Implement `SettingsPlaceholderView`**

Create `src/modules/settings/views/SettingsPlaceholderView.jsx`:

```jsx
import { useNavigate } from 'react-router-dom'
import PageShell from '../../../components/ui/PageShell'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'

// Shared stand-in for the 4 settings sub-pages (account/laundry/notification/
// payment) until each is designed and built. Swap the matching <Route>
// element in AppRoutes.jsx for the real view once it exists — SettingsView
// and SettingsRow don't need to change.
export default function SettingsPlaceholderView({ title }) {
  const handleSidebarNavigate = useSidebarNavigate()
  const navigate = useNavigate()

  return (
    <PageShell activeItemId="pengaturan" onItemClick={handleSidebarNavigate}>
      <div className="flex h-full flex-col p-6 md:p-8">
        <ErrorState
          title={title}
          description="Halaman ini sedang dalam pengembangan."
          action={
            <Button variant="primary" appearance="outline" onClick={() => navigate('/pengaturan')}>
              Kembali ke Pengaturan
            </Button>
          }
        />
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/settings/views/SettingsPlaceholderView.jsx
git commit -m "feat(settings): add SettingsPlaceholderView for pending sub-pages"
```

---

### Task 4: Wire routes and sidebar navigation

**Files:**
- Modify: `src/routes/AppRoutes.jsx`
- Modify: `src/routes/sidebarRoutes.js`

**Interfaces:**
- Consumes: `SettingsView` (Task 2, default export, no props) and `SettingsPlaceholderView` (Task 3, default export, prop `title: string`).
- Produces: working `/pengaturan`, `/pengaturan/akun`, `/pengaturan/laundry`, `/pengaturan/notifikasi`, `/pengaturan/pembayaran` routes; a clickable "Pengaturan" sidebar item.

- [ ] **Step 1: Add imports and routes to `AppRoutes.jsx`**

In `src/routes/AppRoutes.jsx`, add these imports after the existing `OrderDetailView` import (line 8):

```jsx
import SettingsView from '../modules/settings/views/SettingsView'
import SettingsPlaceholderView from '../modules/settings/views/SettingsPlaceholderView'
```

Then add these routes after the `/orders/:id` route block (after line 71, before the `/403` route):

```jsx
      <Route
        path="/pengaturan"
        element={
          <ProtectedRoute>
            <SettingsView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/akun"
        element={
          <ProtectedRoute>
            <SettingsPlaceholderView title="Edit Profil Akun" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/laundry"
        element={
          <ProtectedRoute>
            <SettingsPlaceholderView title="Edit Profil Laundry" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/notifikasi"
        element={
          <ProtectedRoute>
            <SettingsPlaceholderView title="Pengaturan Notifikasi" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pengaturan/pembayaran"
        element={
          <ProtectedRoute>
            <SettingsPlaceholderView title="Pengaturan Pembayaran" />
          </ProtectedRoute>
        }
      />
```

- [ ] **Step 2: Map the sidebar item to its route in `sidebarRoutes.js`**

In `src/routes/sidebarRoutes.js`, change:

```js
export const SIDEBAR_ROUTES = {
  dashboard: '/dashboard',
  pesanan: '/orders',
  layanan: '/products',
}
```

to:

```js
export const SIDEBAR_ROUTES = {
  dashboard: '/dashboard',
  pesanan: '/orders',
  layanan: '/products',
  pengaturan: '/pengaturan',
}
```

- [ ] **Step 3: Verify end-to-end manually**

Run: `npm run dev`

In the browser (log in first, since these routes are behind `ProtectedRoute`):
1. Click "Pengaturan" in the sidebar → lands on `/pengaturan`, sidebar highlights "Pengaturan", page shows the 4 rows with correct icons/labels in order (Edit Profil Akun, Edit Profil Laundry, Pengaturan Notifikasi, Pengaturan Pembayaran).
2. Click each row → lands on its `/pengaturan/...` placeholder route, showing that row's exact label as the placeholder title, sidebar still highlights "Pengaturan".
3. Click "Kembali ke Pengaturan" on a placeholder → returns to `/pengaturan`.
4. Navigate directly to `http://localhost:5173/pengaturan` while logged out → confirm `ProtectedRoute` redirects like the other protected routes (same behavior as e.g. `/dashboard` while logged out).

- [ ] **Step 4: Run the full Storybook test project to confirm nothing else broke**

Run: `npx vitest run --project storybook`
Expected: PASS (all existing stories plus the new `SettingsRow` stories from Task 1).

- [ ] **Step 5: Commit**

```bash
git add src/routes/AppRoutes.jsx src/routes/sidebarRoutes.js
git commit -m "feat(settings): wire /pengaturan routes and sidebar navigation"
```
