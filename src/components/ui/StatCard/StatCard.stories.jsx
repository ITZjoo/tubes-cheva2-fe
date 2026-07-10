import StatCard from './StatCard'

export default {
  title: 'UI/StatCard',
  component: StatCard,
  tags: ['autodocs'],
}

export const TotalProduk = {
  args: { label: 'Total Produk', value: 24, icon: '🧺' },
}

export const TotalPesanan = {
  args: { label: 'Total Pesanan', value: 128, icon: '📦' },
}

export const WithoutIcon = {
  args: { label: 'Pesanan Pending', value: 5 },
}
