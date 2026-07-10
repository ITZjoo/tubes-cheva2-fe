import Sidebar from '../Sidebar'
import Navbar from '../Navbar'

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/products', label: 'Produk' },
  { path: '/orders', label: 'Pesanan' },
]

export default function DashboardLayout({ children, activeRoute }) {
  return (
    <div className="flex h-screen">
      <Sidebar menuItems={MENU_ITEMS} activeRoute={activeRoute} />
      <div className="flex flex-1 flex-col">
        <Navbar userName="Admin" onLogout={() => {}} />
        <main className="flex-1 overflow-y-auto bg-surface p-6">{children}</main>
      </div>
    </div>
  )
}
