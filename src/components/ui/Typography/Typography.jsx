// Single source of truth: className + default tag + subcomponent name per
// variant. Storybook and any other consumer read from this instead of
// keeping their own copy of the variant list.
export const TYPOGRAPHY_VARIANTS = {
  'display-lg': { className: 'text-display-lg', defaultTag: 'h1', subcomponent: 'DisplayLg' },
  'display-md': { className: 'text-display-md', defaultTag: 'h1', subcomponent: 'DisplayMd' },
  'display-sm': { className: 'text-display-sm', defaultTag: 'h1', subcomponent: 'DisplaySm' },
  h1: { className: 'text-h1', defaultTag: 'h1', subcomponent: 'H1' },
  h2: { className: 'text-h2', defaultTag: 'h2', subcomponent: 'H2' },
  h3: { className: 'text-h3', defaultTag: 'h3', subcomponent: 'H3' },
  subtitle: { className: 'text-subtitle', defaultTag: 'p', subcomponent: 'Subtitle' },
  'body-lg': { className: 'text-body-lg', defaultTag: 'p', subcomponent: 'BodyLg' },
  'body-md': { className: 'text-body-md', defaultTag: 'p', subcomponent: 'BodyMd' },
  'body-sm': { className: 'text-body-sm', defaultTag: 'p', subcomponent: 'BodySm' },
  'label-lg': { className: 'text-label-lg', defaultTag: 'span', subcomponent: 'LabelLg' },
  'label-md': { className: 'text-label-md', defaultTag: 'span', subcomponent: 'LabelMd' },
  'label-sm': { className: 'text-label-sm', defaultTag: 'span', subcomponent: 'LabelSm' },
  pretitle: { className: 'text-pretitle', defaultTag: 'span', subcomponent: 'Pretitle' },
  button: { className: 'text-button', defaultTag: 'span', subcomponent: 'ButtonText' },
  link: { className: 'text-link', defaultTag: 'a', subcomponent: 'Link' },
  'link-lg': { className: 'text-link-lg', defaultTag: 'a', subcomponent: 'LinkLg' },
}

export default function Typography({ variant = 'body-lg', as, className = '', children, ...rest }) {
  const config = TYPOGRAPHY_VARIANTS[variant]
  const Tag = as || config?.defaultTag || 'p'

  return (
    <Tag className={[config?.className, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}

// Compound API so callers don't need to remember variant strings, e.g.
// `<Typography.H1>Title</Typography.H1>` instead of
// `<Typography variant="h1">Title</Typography>`. Both forms work.
Object.entries(TYPOGRAPHY_VARIANTS).forEach(([variant, { subcomponent }]) => {
  const Component = (props) => <Typography variant={variant} {...props} />
  Component.displayName = `Typography.${subcomponent}`
  Typography[subcomponent] = Component
})
