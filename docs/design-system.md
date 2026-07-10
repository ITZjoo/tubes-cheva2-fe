# Design System

## Typography

Two type families, split by role:

| Role                                   | Font              | Where it's applied                       |
| --------------------------------------- | ----------------- | ----------------------------------------- |
| Headings, titles, buttons, nav labels   | **Plus Jakarta Sans** | `.font-heading` utility, `h1`–`h4` tags |
| Body copy, labels, links, inputs        | **Urbanist**       | default `body` font                       |

Both are loaded via Google Fonts in `src/index.css` and exposed as Tailwind
theme variables:

```css
--font-sans: 'Plus Jakarta Sans', ...;   /* utility: font-heading */
--font-body: 'Urbanist', ...;             /* default body font */
```

Use the `font-heading` class whenever a piece of UI (a card title, a button
label, a page heading) should read as Plus Jakarta Sans instead of the
default body font.

## Color tokens

Colors follow a Material 3–style tonal palette: each semantic color has a
base tone, an "on" (foreground) tone, and a "container" (soft background)
pair. All tokens live in `src/index.css` under `@theme` and are consumed
as regular Tailwind utilities (`bg-primary`, `text-on-primary-container`,
`border-outline-variant`, etc.).

> **These hex values are placeholders**, approximated from the design
> reference during scaffolding. Swap them for exact tokens once they're
> exported from Figma — the variable names are already final, so no
> component code should need to change.

| Group      | Tokens                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| Primary    | `primary`, `on-primary`, `primary-container`, `on-primary-container`, `primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`, `on-primary-fixed-variant` |
| Secondary  | same pattern as Primary                                                  |
| Tertiary   | same pattern as Primary                                                  |
| Error      | `error`, `on-error`, `error-container`, `on-error-container`             |
| Success    | `success`, `on-success`, `success-container`, `on-success-container`     |
| Warning    | `warning`, `on-warning`, `warning-container`, `on-warning-container`     |
| Info       | `info`, `on-info`, `info-container`, `on-info-container`                 |
| Accent     | `accent`, `on-accent`, `accent-container`, `on-accent-container`         |
| Surface    | `surface-dim`, `surface`, `surface-bright`, `surface-container-lowest/low/(none)/high/highest`, `on-surface`, `on-surface-variant` |
| Neutral    | `outline`, `outline-variant`, `inverse-surface`, `inverse-on-surface`, `inverse-primary`, `scrim`, `shadow` |

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

## Component reference

See [`docs/components.md`](./components.md) for the full `components/ui`
inventory, or run Storybook (`npm run storybook`) to browse every variant
interactively.
