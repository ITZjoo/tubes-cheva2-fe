import Loading, { LOADING_SIZES, LOADING_VARIANTS } from './Loading'

const SIZES = Object.keys(LOADING_SIZES)
const VARIANTS = Object.keys(LOADING_VARIANTS)

export default {
  title: 'UI/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'select' }, options: SIZES },
    variant: { control: { type: 'select' }, options: VARIANTS },
    fullPage: { control: 'boolean' },
    text: { control: 'text' },
  },
}

export const Playground = {
  args: {
    size: 'md',
    variant: 'primary',
    fullPage: false,
    text: 'Memuat data...',
  },
}

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Loading size={size} />
          <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 16, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Loading variant={variant} />
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#334155' }}>{variant}</span>
        </div>
      ))}
    </div>
  ),
}

export const WithCustomText = {
  args: {
    size: 'md',
    variant: 'primary',
    text: 'Menghubungkan ke server...',
  },
}
