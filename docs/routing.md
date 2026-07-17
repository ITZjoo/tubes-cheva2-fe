# Routing

All routes are declared in one place: `src/routes/AppRoutes.jsx`.

> **Status:** the feature components each view used to render (`Input`,
> `Button`, `Table`, `Card`, `Badge`, `StatCard`, `DashboardLayout`) were
> removed pending a rebuild. Every view below currently renders a plain
> `Typography.H1` + a placeholder note instead — no forms, no layout shell,
> no data fetching.

| Path                  | View                 | Layout            | Notes                              |
| ---------------------- | --------------------- | ------------------- | ------------------------------------ |
| `/`                    | —                    | —                  | Redirects to `/login`               |
| `/login`               | `LoginView`           | full-screen        | Placeholder — form pending rebuild  |
| `/register`            | `RegisterView`        | full-screen        | Placeholder — form pending rebuild  |
| `/dashboard`           | `DashboardView`       | none (pending)     | Placeholder — layout/StatCard pending rebuild |
| `/products`            | `ProductListView`     | none (pending)     | Placeholder — layout/Table pending rebuild |
| `/products/new`        | `ProductFormView`     | none (pending)     | Create mode; placeholder — layout/Input/Button pending rebuild |
| `/products/:id/edit`   | `ProductFormView`     | none (pending)     | Edit mode (reads `id` from params); same placeholder |
| `/orders`              | `OrderListView`       | none (pending)     | Placeholder — layout/Table pending rebuild |
| `/orders/:id`          | `OrderDetailView`     | none (pending)     | Reads `id` from params; placeholder — layout/Card/Badge pending rebuild |

## Adding a new route

1. Add the view under the right module's `views/` folder.
2. Register the path in `src/routes/AppRoutes.jsx`.
3. If the page needs the authenticated shell, wrap it in
   `<DashboardLayout activeRoute="/your-path">`; otherwise render it
   full-screen like the auth views.

## Not implemented yet

- Route guards / redirect-if-not-authenticated. `AuthContext` exists but
  nothing currently reads `token` to protect a route — add a
  `<ProtectedRoute>` wrapper once real login is wired up.
- Nested/lazy-loaded routes. Not needed at this scale yet.
