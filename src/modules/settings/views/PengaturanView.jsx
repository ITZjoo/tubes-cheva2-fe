import { useNavigate } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'
import Sidebar from '../../../components/ui/Sidebar'
import SettingsMenuItem from '../components/Settingsmenuitem'

const MENU_ITEMS = [
  { icon: 'account_circle', label: 'Edit Profil Akun', path: '/pengaturan/edit-akun' },
  { icon: 'edit_square', label: 'Edit Profil Laundry', path: '/pengaturan/edit-laundry' },
  { icon: 'notifications', label: 'Pengaturan Notifikasi', path: '/pengaturan/notifikasi' },
  { icon: 'payments', label: 'Pengaturan Pembayaran', path: '/pengaturan/pembayaran' },
]

// TODO: sesuaikan kalau id menu Sidebar ternyata beda path-nya di AppRoutes
const SIDEBAR_ROUTES = {
  dashboard: '/dashboard',
  pesanan: '/orders',
  layanan: '/products',
  history: '/history',
  notifikasi: '/notifikasi',
  pendapatan: '/pendapatan',
  pengaturan: '/pengaturan',
}

export default function PengaturanView() {
  const navigate = useNavigate()

  function handleSidebarItemClick(item) {
    const path = SIDEBAR_ROUTES[item.id]
    if (path) navigate(path)
  }

  function handleLogout() {
    navigate('/login')
  }

  return (
    // h-screen + overflow-hidden: kunci tinggi wrapper ke viewport supaya
    // Sidebar (h-screen) gak ikut ke-scroll saat konten kanan lebih panjang
    // dari layar — cuma div konten yang scroll internal (overflow-y-auto).
    <div className="flex h-screen overflow-hidden bg-surface-container-low">
      <Sidebar activeItemId="pengaturan" onItemClick={handleSidebarItemClick} onLogout={handleLogout} />

      <div className="flex-1 overflow-y-auto p-8">
        <Typography variant="h1" className="!text-[32px] !leading-10 !tracking-[-0.01em] text-black">
          Pengaturan
        </Typography>
        <Typography
          variant="body-lg"
          className="mt-1 !text-[20px] !font-medium !leading-7 text-on-surface-variant"
        >
          Atur profil bisnis, akun, dan preferensi sistem Anda.
        </Typography>

        <div className="mt-8 flex max-w-[1054px] flex-col gap-2">
          {MENU_ITEMS.map((item) => (
            <SettingsMenuItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}