import Sidebar from './Sidebar'

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/products', label: 'Produk' },
  { path: '/orders', label: 'Pesanan' },
]

export const Default = {
  args: { menuItems, activeRoute: '/dashboard' },
}

export const ProductsActive = {
  args: { menuItems, activeRoute: '/products' },
}
