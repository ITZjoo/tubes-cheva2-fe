import Button from './Button'

function PlusIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'outline-secondary', 'danger'],
    },
    appearance: { control: 'select', options: ['solid', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    iconOnly: { control: 'boolean' },
  },
}

export const Primary = {
  args: { children: 'Button Sample', variant: 'primary', size: 'md' },
}

export const Secondary = {
  args: { children: 'Button Sample', variant: 'secondary', size: 'md' },
}

export const Outline = {
  args: { children: 'Button Sample', variant: 'outline', size: 'md' },
}

export const OutlineSecondary = {
  args: { children: 'Button Sample', variant: 'outline-secondary', size: 'md' },
}

export const Danger = {
  args: { children: 'Hapus', variant: 'danger', size: 'md' },
}

export const IconText = {
  args: {
    children: 'Button Sample',
    variant: 'primary',
    size: 'md',
    startIcon: <PlusIcon />,
  },
}

export const IconOnly = {
  args: {
    variant: 'primary',
    size: 'md',
    iconOnly: true,
    'aria-label': 'Tambah',
  },
}

export const Disabled = {
  args: { children: 'Button Sample', variant: 'primary', size: 'md', disabled: true },
}

export const DisabledOutline = {
  args: { children: 'Button Sample', variant: 'outline', size: 'md', disabled: true },
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

export const PrimaryStates = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">Default</Button>
      <Button variant="primary" className="brightness-90">
        Hover
      </Button>
      <Button variant="primary" className="bg-primary-container text-on-primary-container">
        Active
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
}

export const OutlineStates = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline">Default</Button>
      <Button variant="outline" className="bg-primary text-on-primary">
        Hover
      </Button>
      <Button
        variant="outline"
        className="border-primary-container bg-primary-container text-on-primary-container"
      >
        Active
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </div>
  ),
}

export const ColorMatrix = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="outline-secondary">Outline Secondary</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" startIcon={<PlusIcon />}>
          Icon Text
        </Button>
        <Button variant="secondary" startIcon={<PlusIcon />}>
          Icon Text
        </Button>
        <Button variant="primary" iconOnly aria-label="Tambah primary" />
        <Button variant="secondary" iconOnly aria-label="Tambah secondary" />
      </div>
    </div>
  ),
}
