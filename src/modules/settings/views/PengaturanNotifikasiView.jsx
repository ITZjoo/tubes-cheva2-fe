import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import Typography from '../../../components/ui/Typography'
import Sidebar from '../../../components/ui/Sidebar'
import Toggle from '../../../components/ui/Toggle'
import NotificationToggleRow from '../components/NotificationToggleRow'

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

const NOTIF_ITEMS = [
  {
    key: 'pesananBaru',
    title: 'Pesanan Baru',
    description: 'Munculkan peringatan saat ada pesanan antar-jemput baru',
  },
  {
    key: 'pembayaranBerhasil',
    title: 'Pembayaran Berhasil',
    description: 'Dapatkan pemberitahuan seketika saat pelanggan berhasil membayar via QRIS/Transfer',
  },
  {
    key: 'chatPelanggan',
    title: 'Chat Pelanggan',
    description: 'Beri tahu jika ada catatan khusus atau chat masuk dari pelanggan yang butuh balasan',
  },
]

export default function PengaturanNotifikasiView() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    pesananBaru: true,
    pembayaranBerhasil: true,
    chatPelanggan: true,
  })

  const allOn = Object.values(values).every(Boolean)

  function handleToggleAll(next) {
    setValues({ pesananBaru: next, pembayaranBerhasil: next, chatPelanggan: next })
  }

  function handleToggleOne(key, next) {
    setValues((prev) => ({ ...prev, [key]: next }))
  }

  function handleSidebarItemClick(item) {
    const path = SIDEBAR_ROUTES[item.id]
    if (path) navigate(path)
  }

  function handleLogout() {
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-container-low">
      <Sidebar activeItemId="pengaturan" onItemClick={handleSidebarItemClick} onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto p-8">
        {/* Header: arrow + judul sejajar di satu baris */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center">
            <Icon name="arrow_back_ios" size={20} className="text-[#1C1B1F]" />
          </button>
          <Typography
            variant="h1"
            className="font-sans !w-[375px] !text-[32px] !font-bold !leading-10 !tracking-[-0.01em] text-black"
          >
            Pengaturan Notifikasi
          </Typography>
        </div>

        <div className="mt-6 flex max-w-[1054px] items-center justify-between rounded-lg bg-surface p-6 shadow-[0px_1px_8px_0px_#00000026]">
          <Typography variant="h3" as="span" className="!text-[20px] !font-semibold !leading-7 text-on-background">
            Semua Notifikasi
          </Typography>
          <Toggle checked={allOn} onChange={handleToggleAll} />
        </div>

        <div className="mt-2 flex max-w-[1054px] flex-col gap-2 rounded-2xl bg-surface p-6 shadow-[0px_1px_8px_0px_#0000001A]">
          {NOTIF_ITEMS.map((item) => (
            <NotificationToggleRow
              key={item.key}
              title={item.title}
              description={item.description}
              checked={values[item.key]}
              onChange={(next) => handleToggleOne(item.key, next)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}