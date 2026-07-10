# Routing

All routes are declared in one place: `src/routes/AppRoutes.jsx`. Every
view below is a placeholder — it renders a heading and the shared layout,
with no real data fetching yet.

| Path                  | View                 | Layout            | Notes                              |
| ---------------------- | --------------------- | ------------------- | ------------------------------------ |
| `/`                    | —                    | —                  | Redirects to `/login`               |
| `/login`               | `LoginView`           | full-screen        | Email + password, client-side validation |
| `/register`            | `RegisterView`        | full-screen        | Name/email/password + confirmation  |
| `/dashboard`           | `DashboardView`       | `DashboardLayout`  | 4 dummy `StatCard`s                 |
| `/products`            | `ProductListView`     | `DashboardLayout`  | Empty `Table` + "Tambah Produk"     |
| `/products/new`        | `ProductFormView`     | `DashboardLayout`  | Create mode                          |
| `/products/:id/edit`   | `ProductFormView`     | `DashboardLayout`  | Edit mode (reads `id` from params)  |
| `/orders`              | `OrderListView`       | `DashboardLayout`  | Empty `Table` (ID/Customer/Status/Tanggal) |
| `/orders/:id`          | `OrderDetailView`     | `DashboardLayout`  | Reads `id` from params              |

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
