import Typography, { TYPOGRAPHY_VARIANTS } from './Typography'

const VARIANTS = Object.keys(TYPOGRAPHY_VARIANTS)

export default {
  title: 'UI/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select' }, options: VARIANTS },
  },
}

export const Playground = {
  args: { variant: 'h1', children: 'Utama Laundry' },
}

// Every role from the Type Scale (Web) spec, via the `variant` prop.
export const TypeScale = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <Typography key={variant} variant={variant} {...(variant.startsWith('link') ? { href: '#' } : {})}>
          {variant} — Utama Laundry
        </Typography>
      ))}
    </div>
  ),
}

// Same roles via the compound API (Typography.H1, Typography.BodyLg, ...) —
// no variant string to remember or typo.
export const CompoundApi = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography.DisplayLg>Typography.DisplayLg</Typography.DisplayLg>
      <Typography.H1>Typography.H1</Typography.H1>
      <Typography.Subtitle>Typography.Subtitle</Typography.Subtitle>
      <Typography.BodyLg>Typography.BodyLg</Typography.BodyLg>
      <Typography.LabelMd>Typography.LabelMd</Typography.LabelMd>
      <Typography.Pretitle>Typography.Pretitle</Typography.Pretitle>
      <Typography.ButtonText>Typography.ButtonText</Typography.ButtonText>
      <Typography.Link href="#">Typography.Link</Typography.Link>
    </div>
  ),
}
