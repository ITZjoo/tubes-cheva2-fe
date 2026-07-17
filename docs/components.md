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
| `Icon`        | `name`, `size` (20/24/40/48), `filled`                    | Any icon, anywhere (see below)        |

### `Icon`

Wraps the [Material Symbols](https://fonts.google.com/icons) variable font —
the same icon set the design's Iconography spec is built on (Outline/Fill
variants, sizes 20/24/40/48). There is **no per-icon file or import**: pass
any Material Symbols glyph name and it renders.

```jsx
import Icon from '../../../components/ui/Icon'

<Icon name="local_laundry_service" size={24} />
<Icon name="iron" size={20} filled />
```

- `name` — the glyph's snake_case name (e.g. `dry_cleaning`, `wash`,
  `shopping_basket`, `moped`, `qr_code_2`, `receipt_long`, `smartphone`).
  Browse the full set at [fonts.google.com/icons](https://fonts.google.com/icons).
- `size` — one of `20`, `24`, `40`, `48` (matches the `opsz` axis in the
  spec); defaults to `24`.
- `filled` — `true` for the Fill variant, `false` (default) for Outline.
- Color comes from CSS `color`, so it inherits any `text-*` token utility
  (`text-primary`, `text-on-surface-variant`, etc.) exactly like text.
- Purely decorative by default (`aria-hidden`). Pass `aria-label` if the
  icon is the only content conveying meaning (e.g. an icon-only button).

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
