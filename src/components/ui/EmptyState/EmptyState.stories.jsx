import EmptyState from './EmptyState'

export default {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
}

export const Default = {
  args: { message: 'Belum ada produk' },
}

export const WithIcon = {
  args: { message: 'Belum ada pesanan', icon: '📦' },
}
