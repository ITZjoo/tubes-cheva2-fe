import Button, { COLOR_STYLES } from './Button'
import Icon from '../Icon'

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    appearance: { control: 'select', options: ['solid', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    iconOnly: { control: 'boolean' },
    uppercase: { control: 'boolean' },
  },
}

export const Primary = {
  args: { children: 'Button Sample', variant: 'primary', appearance: 'solid', size: 'md' },
}

export const Secondary = {
  args: { children: 'Button Sample', variant: 'secondary', appearance: 'solid', size: 'md' },
}

export const Outline = {
  args: { children: 'Button Sample', variant: 'primary', appearance: 'outline', size: 'md' },
}

export const OutlineSecondary = {
  args: { children: 'Button Sample', variant: 'secondary', appearance: 'outline', size: 'md' },
}

export const Danger = {
  args: { children: 'Hapus', variant: 'danger', appearance: 'solid', size: 'md' },
}

export const OutlineDanger = {
  args: { children: 'Hapus', variant: 'danger', appearance: 'outline', size: 'md' },
}

export const IconText = {
  args: {
    children: 'Button Sample',
    variant: 'primary',
    appearance: 'solid',
    size: 'md',
    startIcon: <Icon name="add" size={20} />,
  },
}

export const IconOnly = {
  args: {
    variant: 'primary',
    appearance: 'solid',
    size: 'md',
    iconOnly: true,
    startIcon: <Icon name="add" size={20} />,
    'aria-label': 'Tambah',
  },
}

export const Disabled = {
  args: { children: 'Button Sample', variant: 'primary', appearance: 'solid', size: 'md', disabled: true },
}

export const DisabledOutline = {
  args: { children: 'Button Sample', variant: 'primary', appearance: 'outline', size: 'md', disabled: true },
}

export const Sizes = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Normal</Button>
      <Button size="lg">Medium</Button>
      <Button size="xl">Large</Button>
    </div>
  ),
}

function forceState(colorClasses, state) {
  const prefix = `${state}:`
  return colorClasses
    .split(' ')
    .filter((cls) => cls.startsWith(prefix))
    .map((cls) => `!${cls.slice(prefix.length)}`)
    .join(' ')
}

function StatePreview({ variant, appearance }) {
  const classes = COLOR_STYLES[variant][appearance]
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant={variant} appearance={appearance}>
        Default
      </Button>
      <Button variant={variant} appearance={appearance} className={forceState(classes, 'hover')}>
        Hover
      </Button>
      <Button variant={variant} appearance={appearance} className={forceState(classes, 'active')}>
        Active
      </Button>
      <Button variant={variant} appearance={appearance} disabled>
        Disabled
      </Button>
    </div>
  )
}

export const PrimaryStates = {
  render: () => <StatePreview variant="primary" appearance="solid" />,
}

export const OutlineStates = {
  render: () => <StatePreview variant="primary" appearance="outline" />,
}

export const ColorMatrix = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" appearance="outline">
          Primary Outline
        </Button>
        <Button variant="secondary" appearance="outline">
          Secondary Outline
        </Button>
        <Button variant="danger" appearance="outline">
          Danger Outline
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" startIcon={<Icon name="add" size={20} />}>
          Icon Text
        </Button>
        <Button variant="secondary" startIcon={<Icon name="add" size={20} />}>
          Icon Text
        </Button>
        <Button variant="primary" iconOnly startIcon={<Icon name="add" size={20} />} aria-label="Tambah primary" />
        <Button variant="secondary" iconOnly startIcon={<Icon name="add" size={20} />} aria-label="Tambah secondary" />
      </div>
    </div>
  ),
}