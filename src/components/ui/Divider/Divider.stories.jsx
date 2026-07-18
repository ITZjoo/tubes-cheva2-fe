import Divider from './Divider'

export default {
  title: 'UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: { type: 'inline-radio' }, options: ['horizontal', 'vertical'] },
    inset: { control: { type: 'inline-radio' }, options: ['none', 'start', 'both'] },
  },
}

export const Horizontal = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <p style={{ margin: '0 0 12px' }}>Content above</p>
      <Divider {...args} />
      <p style={{ margin: '12px 0 0' }}>Content below</p>
    </div>
  ),
  args: { orientation: 'horizontal', inset: 'none' },
}

export const Vertical = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40 }}>
      <span>Left</span>
      <Divider {...args} />
      <span>Right</span>
    </div>
  ),
  args: { orientation: 'vertical' },
}

// Matches the list-divider spec: full-bleed between sections, inset-start
// (after leading content) and inset-both (between plain text rows).
export const InsetVariants = {
  render: () => (
    <div style={{ width: 320 }}>
      <p style={{ margin: '12px 0' }}>Section A</p>
      <Divider inset="none" />
      <p style={{ margin: '12px 0' }}>Section B</p>
      <Divider inset="start" />
      <p style={{ margin: '12px 0' }}>Item with leading icon</p>
      <Divider inset="both" />
      <p style={{ margin: '12px 0' }}>Plain text item</p>
    </div>
  ),
}
