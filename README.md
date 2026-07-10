# Utama Laundry — Admin Panel

Web app for **Utama Laundry** (kiloan & satuan laundry UMKM) staff to
manage products and orders. This is the admin/back-office app — end
customers are served by a separate mobile app.

> **Status:** scaffold stage. Folder structure, routing, and the reusable
> component library are in place; none of it is wired to a real API yet.
> See [What's implemented](#whats-implemented) below.

## Tech stack

| Layer            | Choice                          |
| ------------------ | ---------------------------------- |
| Build tool        | [Vite](https://vitejs.dev)         |
| UI                 | React 19                           |
| Styling            | Tailwind CSS v4                    |
| Component workshop | Storybook 10                       |
| Routing            | React Router v7                    |
| HTTP client        | axios                              |
| State              | React Context / local state        |
| Linting            | oxlint                             |

## Getting started

**Requirements:** Node 20+, npm.

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL once a backend exists
npm run dev                # http://localhost:5173
```

### Available scripts

| Command                  | What it does                                  |
| -------------------------- | ------------------------------------------------ |
| `npm run dev`             | Start the Vite dev server with HMR              |
| `npm run build`           | Production build to `dist/`                     |
| `npm run preview`         | Preview the production build locally            |
| `npm run lint`            | Run oxlint                                       |
| `npm run storybook`       | Start Storybook at `http://localhost:6006`      |
| `npm run build-storybook` | Build a static Storybook site to `storybook-static/` |

## Project layout

```
src/
├── components/
│   ├── ui/          # Reusable, presentational components (Button, Input, Table, ...)
│   └── layout/       # Sidebar, Navbar, DashboardLayout
├── modules/          # One folder per feature: auth, dashboard, products, orders
│   └── <feature>/
│       ├── views/       # Pages (what used to be called "pages")
│       ├── components/  # Components local to this feature only
│       └── services/    # API calls for this feature
├── routes/           # AppRoutes.jsx — all paths in one place
├── services/         # Shared axios instance
├── context/          # AuthContext
├── constants/         # orderStatus.js and other shared enums
└── hooks/            # Cross-module hooks
```

Full write-up in [`docs/architecture.md`](./docs/architecture.md).

## Documentation

| Doc                                              | Covers                                              |
| --------------------------------------------------- | ------------------------------------------------------ |
| [`docs/architecture.md`](./docs/architecture.md)    | Module-based structure, where things go and why       |
| [`docs/design-system.md`](./docs/design-system.md)  | Typography (Plus Jakarta Sans + Urbanist) and color tokens |
| [`docs/components.md`](./docs/components.md)        | Full `components/ui` and `components/layout` reference |
| [`docs/routing.md`](./docs/routing.md)              | Route table and how to add a new page                 |

## Component library

Every shared component in `components/ui` and `components/layout` ships
with a Storybook story covering its main variants. Run:

```bash
npm run storybook
```

and browse `Button`, `Input`, `Card`, `Badge`, `Table`, `Modal`,
`EmptyState`, `StatCard`, `Sidebar`, and `Navbar` interactively.

## What's implemented

- ✅ Folder structure (module-based: auth, dashboard, products, orders)
- ✅ Tailwind CSS v4 with a Material 3–style color token set and Plus
  Jakarta Sans / Urbanist typography
- ✅ Full `components/ui` + `components/layout` library with Storybook
  stories
- ✅ Routing for all MVP screens (login, register, dashboard, product
  list/form, order list/detail), rendering placeholder content
- ✅ Client-side form validation on Login/Register/Product form
- ✅ `AuthContext` and `orderStatus` constants scaffolded

## What's not implemented yet

- ❌ Real API calls — every `services/*.js` function is a stub
- ❌ Persisted auth / protected routes
- ❌ Real product and order data (tables render empty states)

## Backend

Talks to a Laravel API using Sanctum token-based auth (not yet connected).
Order status is a shared enum across this app and the customer mobile
app: `pending → diproses → selesai`, defined once in
[`src/constants/orderStatus.js`](./src/constants/orderStatus.js).
