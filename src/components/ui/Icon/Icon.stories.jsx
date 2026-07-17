import Icon from './Icon'

export default {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: [20, 24, 40, 48] },
  },
}

// `name` is any Material Symbols glyph name (snake_case) — the same
// library the Iconography spec is built on. No new file per icon.
export const Outlined = {
  args: { name: 'local_laundry_service', size: 24, filled: false },
}

export const Filled = {
  args: { name: 'local_laundry_service', size: 24, filled: true },
}

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: 16 }}>
      {[20, 24, 40, 48].map((size) => (
        <Icon key={size} name="local_laundry_service" size={size} />
      ))}
    </div>
  ),
}

// The laundry-domain glyph set from the Iconography spec, reused via
// the same <Icon name="..." /> API.
export const LaundryIconSet = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {[
        'local_laundry_service',
        'dry_cleaning',
        'iron',
        'wash',
        'shopping_basket',
        'moped',
        'qr_code_2',
        'receipt_long',
        'smartphone',
      ].map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Icon name={name} size={24} />
          <span style={{ fontSize: 11 }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
