# Design System

## Typography

Two type families, split by role: **Plus Jakarta Sans** for display/heading/
button roles, **Urbanist** for body/label/link roles. Both are loaded via
Google Fonts in `src/index.css` and exposed as `--font-sans` / `--font-body`.

Every role in the Type Scale (Web) spec has a matching utility class in
`src/index.css` — use these instead of one-off `text-*`/`font-*` combos so
the app stays on-spec:

| Class               | Font              | Size / line-height | Weight | Letter-spacing | Notes                    |
| -------------------- | ------------------ | -------------------- | ------ | ---------------- | -------------------------- |
| `.text-display-lg`  | Plus Jakarta Sans | 48px / 56px          | 700    | -0.01em          | Hero title                 |
| `.text-display-md`  | Plus Jakarta Sans | 40px / 48px          | 700    | -0.01em          | Hero title                 |
| `.text-display-sm`  | Plus Jakarta Sans | 36px / 44px          | 700    | -0.01em          | Hero title                 |
| `.text-h1`          | Plus Jakarta Sans | 32px / 40px          | 700    | -0.01em          | Page title                 |
| `.text-h2`          | Plus Jakarta Sans | 28px / 36px          | 700    | -0.01em          | Page title                 |
| `.text-h3`          | Plus Jakarta Sans | 24px / 32px          | 700    | -0.005em         | Section title              |
| `.text-subtitle`    | Plus Jakarta Sans | 20px / 28px          | 600    | 0                | Card title                 |
| `.text-body-lg`     | Urbanist          | 16px / 2.4           | 400    | 0                | Body                       |
| `.text-body-md`     | Urbanist          | 14px / 2.2           | 400    | 0                | Body                       |
| `.text-body-sm`     | Urbanist          | 12px / 1.8           | 500    | 0                | Body                       |
| `.text-label-lg`    | Urbanist          | 16px / 2.4           | 600    | 0                | Label                      |
| `.text-label-md`    | Urbanist          | 14px / 2.0           | 500    | 0                | Label                      |
| `.text-label-sm`    | Urbanist          | 12px / 1.8           | 500    | 0                | Label                      |
| `.text-pretitle`    | Urbanist          | 16px / 1             | 700    | 0.03em           | Uppercase                  |
| `.text-button`      | Plus Jakarta Sans | 16px / 1             | 600    | 0.04em           | Uppercase                  |
| `.text-link`        | Urbanist          | 18px / 1             | 700    | 0                | Underlined, `--color-link` |
| `.text-link-lg`     | Urbanist          | 24px / 1             | 700    | 0                | Underlined, `--color-link` |

`--color-link` (`#4B4DED`) is a separate token from `--color-primary` — the
type-scale spec defines its own link color rather than reusing the M3
primary, so it's kept distinct instead of forced to match.

The `font-heading` class (Plus Jakarta Sans, weight 700, no fixed size) still
exists for one-off cases that don't match a named role exactly; prefer a
`.text-*` class above when the role does match.

## Color tokens

Colors follow a Material 3–style tonal palette: each semantic color has a
base tone, an "on" (foreground) tone, and a "container" (soft background)
pair. All tokens live in `src/index.css` under `@theme` and are consumed
as regular Tailwind utilities (`bg-primary`, `text-on-primary-container`,
`border-outline-variant`, etc.).

> Hex values below are taken directly from the project's design token
> reference (`Color_Tokens_Kelompok2_Cheva`, Light Theme). `scrim` is not
> defined separately in that doc and is set to `#000000`, matching the
> standard Material 3 default (same as `shadow`).

| Group     | Token                       | Hex       |
| --------- | --------------------------- | --------- |
| Primary   | `primary`                   | `#0A6780` |
|           | `on-primary`                 | `#FFFFFF` |
|           | `primary-container`          | `#B9EAFF` |
|           | `on-primary-container`       | `#004D62` |
|           | `primary-fixed`              | `#B9EAFF` |
|           | `primary-fixed-dim`          | `#89D0ED` |
|           | `on-primary-fixed`           | `#001F29` |
|           | `on-primary-fixed-variant`   | `#004D62` |
| Secondary | `secondary`                  | `#006A61` |
|           | `on-secondary`               | `#FFFFFF` |
|           | `secondary-container`        | `#9EF2E5` |
|           | `on-secondary-container`     | `#004D62` |
|           | `secondary-fixed`            | `#9EF2E5` |
|           | `secondary-fixed-dim`        | `#82D5C9` |
|           | `on-secondary-fixed`         | `#00201D` |
|           | `on-secondary-fixed-variant` | `#005049` |
| Tertiary  | `tertiary`                   | `#66558F` |
|           | `on-tertiary`                | `#FFFFFF` |
|           | `tertiary-container`         | `#E9DDFF` |
|           | `on-tertiary-container`      | `#4D3D75` |
|           | `tertiary-fixed`             | `#E9DDFF` |
|           | `tertiary-fixed-dim`         | `#BCA7E2` |
|           | `on-tertiary-fixed`          | `#210F47` |
|           | `on-tertiary-fixed-variant`  | `#4D3D75` |
| Error     | `error`                      | `#904A42` |
|           | `on-error`                   | `#FFFFFF` |
|           | `error-container`            | `#FFDAD5` |
|           | `on-error-container`         | `#73342C` |
| Success   | `success`                    | `#2D6A44` |
|           | `on-success`                 | `#FFFFFF` |
|           | `success-container`          | `#B1F1C2` |
|           | `on-success-container`       | `#11512E` |
| Warning   | `warning`                    | `#87521A` |
|           | `on-warning`                 | `#FFFFFF` |
|           | `warning-container`          | `#FFDCC0` |
|           | `on-warning-container`       | `#6A3B02` |
| Info      | `info`                       | `#3D5F90` |
|           | `on-info`                    | `#FFFFFF` |
|           | `info-container`             | `#D5E3FF` |
|           | `on-info-container`          | `#224876` |
| Accent    | `accent`                     | `#79590C` |
|           | `on-accent`                  | `#FFFFFF` |
|           | `accent-container`           | `#FFDEA4` |
|           | `on-accent-container`        | `#5D4200` |
| Surface   | `surface-dim`                | `#D5DBDC` |
|           | `surface`                    | `#F5FAFC` |
|           | `surface-bright`             | `#F5FAFC` |
|           | `surface-container-lowest`   | `#FFFFFF` |
|           | `surface-container-low`      | `#EFF5F6` |
|           | `surface-container`          | `#E9EFF0` |
|           | `surface-container-high`     | `#E3E9EA` |
|           | `surface-container-highest`  | `#DEE3E5` |
|           | `on-surface`                 | `#171D1E` |
|           | `on-surface-variant`         | `#40484B` |
| Neutral   | `outline`                    | `#70787C` |
|           | `outline-variant`            | `#BFC8CC` |
|           | `inverse-surface`            | `#2B3133` |
|           | `inverse-on-surface`         | `#ECF2F3` |
|           | `inverse-primary`            | `#89D0ED` |
|           | `scrim`                      | `#000000` |
|           | `shadow`                     | `#000000` |

### Usage guidance

- Solid actions (primary button, active nav item) → `bg-primary` /
  `text-on-primary`.
- Soft/secondary surfaces (badges, hover states, containers) →
  `*-container` / `on-*-container` pairs.
- Order status badges map to semantic colors, not raw Tailwind grays — see
  `Badge.jsx`: `pending` → warning, `diproses` → info, `selesai` → success.
- Never hardcode a Tailwind gray/blue/red utility in a new component;
  reach for the semantic token instead so a future palette swap is a
  one-file change.

## Iconography

Icons come from **Material Symbols** (Outline + Fill, sizes 20/24/40/48),
matching the design's Iconography spec. There's a single `Icon` component
(`components/ui/Icon`) instead of one file per icon — see
[`docs/components.md`](./components.md#icon) for the API.

## Component reference

See [`docs/components.md`](./components.md) for the full `components/ui`
inventory, or run Storybook (`npm run storybook`) to browse every variant
interactively.
