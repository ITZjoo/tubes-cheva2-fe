import Button from './Button'

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export const Primary = {
  args: { children: 'Simpan', variant: 'primary' },
}

export const Secondary = {
  args: { children: 'Batal', variant: 'secondary' },
}

export const Danger = {
  args: { children: 'Hapus', variant: 'danger' },
}

export const Disabled = {
  args: { children: 'Simpan', variant: 'primary', disabled: true },
}
