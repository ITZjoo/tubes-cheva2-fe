import Input from './Input'

export default {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}

export const Default = {
  args: { label: 'Email', type: 'email', placeholder: 'nama@email.com' },
}

export const WithError = {
  args: {
    label: 'Password',
    type: 'password',
    value: '123',
    error: 'Password minimal 8 karakter',
  },
}

export const Disabled = {
  args: { label: 'Kode Produk', value: 'PRD-001', disabled: true },
}
