# Component Library (`src/components/ui`)

> **Status:** most feature components (`Button`, `Input`, `Card`, `Badge`,
> `Table`, `Modal`, `EmptyState`, `StatCard`) and all of `components/layout`
> (`Sidebar`, `Navbar`, `DashboardLayout`) have been removed and are pending
> a rebuild. Only the foundation components — `Icon` and `Typography` — are
> currently implemented. Views that used to render the removed components
> now show a plain placeholder instead; see
> [`docs/routing.md`](./routing.md) for the current state per route.

All components below are pure, presentational, and reusable across every
module. Each one lives in its own folder alongside its story:

```
components/ui/Icon/
├── Icon.jsx
├── Icon.stories.jsx
└── index.js          # export { default } from './Icon'
```

The `index.js` barrel means other files still import the folder itself —
`import Icon from '../../../components/ui/Icon'` — nothing outside the
component's own folder needs to know it's a directory instead of a single
file. Browse every variant live with `npm run storybook`.

| Component    | Key props                                              | Typical use                          |
| ------------- | -------------------------------------------------------- | -------------------------------------- |
| `Icon`        | `name`, `size` (20/24/40/48), `filled`                    | Any icon, anywhere (see below)        |
| `Typography`  | `variant`, `as`                                           | Any text matching the Type Scale (see below) |

### `Typography`

Wraps the [Type Scale (Web)](./design-system.md#typography) utility classes
from `src/index.css` so components don't have to remember class names. Two
equivalent ways to use it — pick whichever reads better at the call site:

```jsx
import Typography from '../../../components/ui/Typography'

// 1. variant prop — handy when the variant is dynamic/data-driven
<Typography variant="h1">Utama Laundry</Typography>
<Typography variant="link" href="/login">Masuk</Typography>

// 2. compound API — no string to type or typo, autocompletes in the editor
<Typography.H1>Utama Laundry</Typography.H1>
<Typography.Link href="/login">Masuk</Typography.Link>
```

- `variant` — one of `display-lg/md/sm`, `h1/h2/h3`, `subtitle`,
  `body-lg/md/sm`, `label-lg/md/sm`, `pretitle`, `button`, `link`,
  `link-lg`. Defaults to `body-lg`. The full list is exported as
  `TYPOGRAPHY_VARIANTS` from `Typography.jsx` — read from it instead of
  hardcoding the variant names elsewhere (Storybook does this).
- `Typography.H1`, `Typography.BodyLg`, `Typography.LabelMd`,
  `Typography.Link`, etc. — one subcomponent per variant, generated from the
  same `TYPOGRAPHY_VARIANTS` map, so it can never drift out of sync with the
  `variant` prop values.
- `as` — override the rendered tag (each variant has a sensible default,
  e.g. `h1` variant/`Typography.H1` renders an `<h1>`, `link`/`Typography.Link`
  renders an `<a>`). Pass a router component (e.g. `as={Link}`) to get
  client-side navigation with type-scale styling.
- Any other prop (`href`, `to`, `onClick`, `className`, ...) passes through
  to the underlying element.

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

Currently empty (`.gitkeep` only) — `Sidebar`, `Navbar`, and
`DashboardLayout` were removed pending a rebuild. When they're added back,
follow the same one-folder-per-component convention as `components/ui`.

## Conventions

- **No forms live in `components/`.** A form is a view built from UI
  primitives, not a standalone component. If a form needs to be reused
  across two views in the same module, promote it to that module's
  `components/` folder — never to `components/ui`.
- Every new shared component needs a story before it's considered done.
- Components take plain props and callbacks; they never import a
  module's `services/*` or reach into `context/` directly.
