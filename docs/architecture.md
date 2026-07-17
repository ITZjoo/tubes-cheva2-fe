# Architecture

## Module-based structure

The app is organized by **feature module**, not by file type. Each business
capability (auth, dashboard, products, orders) owns its own `views`,
`components`, and `services`. This keeps a feature's code in one place and
lets multiple people work on different modules without stepping on each
other during the 6-week build.

```
src/
├── components/
│   ├── ui/          # Reusable atoms shared across ALL modules
│   │   ├── Icon/         # Icon.jsx + Icon.stories.jsx + index.js
│   │   ├── Typography/
│   │   └── ...           # one folder per component
│   └── layout/       # page shell components (currently empty, pending rebuild)
├── modules/
│   ├── auth/
│   │   ├── views/        # LoginView, RegisterView
│   │   ├── components/   # auth-only components (currently empty)
│   │   └── services/      # authService.js
│   ├── dashboard/
│   │   ├── views/        # DashboardView
│   │   └── components/   # dashboard-only components (currently empty)
│   ├── products/
│   │   ├── views/        # ProductListView, ProductFormView
│   │   ├── components/   # product-only components (currently empty)
│   │   └── services/      # productService.js
│   └── orders/
│       ├── views/        # OrderListView, OrderDetailView
│       ├── components/   # order-only components (currently empty)
│       └── services/      # orderService.js
├── routes/           # AppRoutes.jsx — single source of truth for paths
├── services/         # api.js — shared axios instance
├── context/          # AuthContext
├── constants/         # orderStatus.js, etc.
├── hooks/            # cross-module hooks (currently empty)
└── layouts/          # reserved for future top-level layouts
```

## Rules of thumb

- **`components/ui`** only holds things that are truly reusable across every
  module. Currently just `Icon` and `Typography` — the feature components
  (`Button`, `Input`, `Card`, `Badge`, `Table`, `Modal`, `EmptyState`,
  `StatCard`) were removed and are pending a rebuild. Nothing here knows
  about "products" or "orders".
- **`components/layout`** is meant to hold the page shell (nav, sidebar,
  authenticated-layout wrapper). It's currently empty — removed pending a
  rebuild — so views render their own content directly instead of wrapping
  it in a shared layout.
- **There is no separate "forms" layer.** A form is just a view, built out
  of `components/ui` primitives — see `ProductFormView.jsx` or
  `LoginView.jsx`. This avoids an extra abstraction layer that a 6-week
  project doesn't have time to maintain.
- **A module's `services/`** only talks to the shared axios instance in
  `src/services/api.js`. It never imports `axios` directly.
- **State stays local for now.** Module views use `useState`/`useContext`.
  Redux/Zustand is intentionally not part of this stage — add it only if a
  real cross-cutting state need shows up.

## Data flow (current stage)

Nothing here calls a real backend yet. Every `views/*.jsx` renders static
placeholder content, and every `services/*.js` function is a stub that
returns an unresolved axios promise. API wiring is a later stage — not
part of this scaffold.
