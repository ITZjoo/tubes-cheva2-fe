# Pengaturan (Settings) Menu Page — Design

## Context

The app has a `pengaturan` sidebar nav item (see `src/components/ui/Sidebar/Sidebar.jsx`) that already highlights correctly but has no route or page behind it — clicking it is currently a no-op because `pengaturan` is missing from `src/routes/sidebarRoutes.js`'s `SIDEBAR_ROUTES` map.

The user supplied a screenshot and a Figma SVG export specifying the exact design:
- Page header: "Pengaturan" title + "Atur profil bisnis, akun, dan preferensi sistem Anda." subtitle.
- Four separate full-width white rounded cards (**not** one card with internal dividers), each ~89px tall, drop-shadowed, containing: a bare teal icon (no colored chip background) on the left, a bold single-line label, and a `chevron_right` arrow on the far right edge.
- Row labels + icons: "Edit Profil Akun" (person), "Edit Profil Laundry" (storefront), "Pengaturan Notifikasi" (bell), "Pengaturan Pembayaran" (receipt).

None of the four sub-pages (account edit, laundry profile edit, notification settings, payment settings) exist yet — this spec covers only the settings menu screen plus placeholder destinations for its rows.

## Goal

Build the `/pengaturan` menu screen matching the supplied design, wire it into the sidebar, and give each row a real (if placeholder) destination so the navigation isn't a dead end.

## Approach

Follow the codebase's existing conventions exactly — no new dependencies, no new layout primitives:

- **Feature module**: `src/modules/settings/` with `views/` and `components/` subfolders, matching every other feature module (`orders`, `products`, `dashboard`).
- **Layout**: reuse `PageShell` (already renders the sidebar + auth/logout wiring) exactly as `DashboardView`/`OrderListView` do — `<PageShell activeItemId="pengaturan" onItemClick={handleSidebarNavigate}>`.
- **Icons**: reuse the existing `Icon` component (Material Symbols Outlined ligature font) — no icon library needed.
- **Styling tokens**: reuse the existing Tailwind v4 `@theme` tokens from `src/index.css` (`bg-primary`/`text-primary` teal, `bg-surface-container-lowest`, `border-outline-variant`, `text-h1`/`text-h3`/`text-body-md` type scale) already used throughout `DashboardView.jsx` and `OrderListView.jsx`.

### Alternative considered: single card with dividers

The original screenshot alone could be read as one card containing 4 divided rows (like the "Status Pesanan" pattern in `DashboardView.jsx`). The follow-up SVG export clarifies this is **not** the case — it shows 4 independently shadowed/rounded cards with gaps between them. Going with the SVG as the source of truth since it's the more precise reference.

### Alternative considered: no navigation until sub-pages exist

Rejected per user preference — rows should navigate to real placeholder routes now so the menu isn't inert, and so the sub-pages can be filled in later without touching `SettingsView` again.

## Routes

Added to `src/routes/AppRoutes.jsx`, all wrapped in `<ProtectedRoute>` like existing routes:

| Path | View | Notes |
|---|---|---|
| `/pengaturan` | `SettingsView` | The menu screen |
| `/pengaturan/akun` | `SettingsPlaceholderView` | title="Edit Profil Akun" |
| `/pengaturan/laundry` | `SettingsPlaceholderView` | title="Edit Profil Laundry" |
| `/pengaturan/notifikasi` | `SettingsPlaceholderView` | title="Pengaturan Notifikasi" |
| `/pengaturan/pembayaran` | `SettingsPlaceholderView` | title="Pengaturan Pembayaran" |

`src/routes/sidebarRoutes.js`'s `SIDEBAR_ROUTES` map gets `pengaturan: '/pengaturan'` added so the sidebar nav item becomes clickable (it currently silently no-ops for unmapped ids by design — see existing comment in that file).

## Components

### `src/modules/settings/views/SettingsView.jsx`

Default-exported page component, same shape as `DashboardView`/`OrderListView`:
- Calls `useSidebarNavigate()` for `onItemClick`.
- Renders `PageShell` → inside `main`, a page header (`Pengaturan` as `text-h1`/`text-3xl font-extrabold`, subtitle as `text-body-md text-on-surface-variant`) followed by a vertically-stacked list (`flex flex-col gap-2` or similar) of 4 `SettingsRow` components driven by a local `SETTINGS_ITEMS` array (label, icon name, target path) — no service/API call needed, purely static data.

### `src/modules/settings/components/SettingsRow.jsx`

Presentational + navigation component, one row = one card:
- Props: `icon`, `label`, `to` (route path).
- Renders a `<button>` (full width, `bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm px-6 py-6 flex items-center justify-between hover:bg-surface-container transition-colors`) containing: `<Icon name={icon} className="text-primary" size={24} />` + `<span className="text-h3 font-sans font-bold text-on-surface">{label}</span>` on the left (flex gap-4), and `<Icon name="chevron_right" className="text-on-surface-variant" size={20} />` on the right.
- Uses `useNavigate()` from `react-router-dom` internally to go to `to` on click (kept inside the row component rather than passed down as a callback, since it's the same pattern for all 4 rows and keeps `SettingsView` free of navigation wiring).

### `src/modules/settings/views/SettingsPlaceholderView.jsx`

Shared placeholder for all 4 sub-routes:
- Reads a `title` via each route's `element` prop (`<SettingsPlaceholderView title="Edit Profil Akun" />`) — simplest option given there are only 4 call sites; no need for route params/config lookup.
- Renders `PageShell activeItemId="pengaturan"` → a card with the given `title` as heading, "Halaman ini sedang dalam pengembangan." (or similar) as body text, and a `Button`/link back to `/pengaturan`.
- Reuses the existing `ErrorState`-adjacent illustration pattern only if trivial to reuse; otherwise a plain centered text block is fine — this is intentionally minimal since it's a placeholder, not a feature.

## Out of scope

- The actual account/laundry/notification/payment settings forms — those are separate future features, each will replace `SettingsPlaceholderView` at its route once designed.
- Backend/API wiring — this page is fully static, no service calls.
- Any change to `Sidebar.jsx` or `PageShell.jsx` — both already support this page as-is.
