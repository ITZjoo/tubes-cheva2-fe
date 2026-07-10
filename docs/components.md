# Component Library (`src/components/ui`)

All components below are pure, presentational, and reusable across every
module. Each one lives in its own folder alongside its story:

```
components/ui/Button/
├── Button.jsx
├── Button.stories.jsx
└── index.js          # export { default } from './Button'
```

The `index.js` barrel means other files still import the folder itself —
`import Button from '../../../components/ui/Button'` — nothing outside the
component's own folder needs to know it's a directory instead of a single
file. Browse every variant live with `npm run storybook`.

| Component    | Key props                                              | Typical use                          |
| ------------- | -------------------------------------------------------- | -------------------------------------- |
| `Button`      | `variant` (primary/secondary/danger), `size`, `disabled`, `onClick` | Every form and action across the app |
| `Input`       | `label`, `type`, `value`, `onChange`, `error`           | Login, Register, Product form         |
| `Card`        | `title`, `children`                                     | Dashboard summaries, order detail     |
| `Badge`       | `status` (pending/diproses/selesai), `color`             | Order list/detail status              |
| `Table`       | `columns`, `rows`                                        | Product list, order list              |
| `Modal`       | `isOpen`, `onClose`, `title`, `children`                 | Confirm delete, quick detail view     |
| `EmptyState`  | `message`, `icon`                                         | Empty tables/lists                    |
| `StatCard`    | `label`, `value`, `icon`                                  | Dashboard KPI cards                   |

## `src/components/layout`

Same one-folder-per-component convention applies here.

| Component         | Key props                       | Notes                                    |
| ------------------ | --------------------------------- | ------------------------------------------ |
| `Sidebar`          | `menuItems`, `activeRoute`        | Left nav, highlights the active route     |
| `Navbar`           | `userName`, `onLogout`            | Top bar                                    |
| `DashboardLayout`  | `children`, `activeRoute`          | Wraps Sidebar + Navbar around a page       |

`DashboardLayout` is what every authenticated view (`DashboardView`,
`ProductListView`, `OrderDetailView`, etc.) wraps itself in. Auth views
(`LoginView`, `RegisterView`) render full-screen and skip the layout.

## Conventions

- **No forms live in `components/`.** A form is a view built from `Input` +
  `Button`, not a standalone component. If a form needs to be reused
  across two views in the same module, promote it to that module's
  `components/` folder — never to `components/ui`.
- Every new shared component needs a story before it's considered done.
- Components take plain props and callbacks; they never import a
  module's `services/*` or reach into `context/` directly.
