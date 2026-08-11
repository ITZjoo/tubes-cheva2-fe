import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import SettingsRow from '../components/SettingsRow'

const SETTINGS_ITEMS = [
  { id: 'akun', icon: 'person', label: 'Edit Profil Akun', to: '/pengaturan/akun' },
  { id: 'laundry', icon: 'storefront', label: 'Edit Profil Laundry', to: '/pengaturan/laundry' },
  { id: 'notifikasi', icon: 'notifications', label: 'Pengaturan Notifikasi', to: '/pengaturan/notifikasi' },
  { id: 'pembayaran', icon: 'receipt_long', label: 'Pengaturan Pembayaran', to: '/pengaturan/pembayaran' },
]

export default function SettingsView() {
  const handleSidebarNavigate = useSidebarNavigate()

  return (
    <PageShell
      activeItemId="pengaturan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <header>
        <h1 className="text-h1 text-on-surface">Pengaturan</h1>
        <p className="text-body-md text-on-surface-variant/80 font-medium mt-1">
          Atur profil bisnis, akun, dan preferensi sistem Anda.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {SETTINGS_ITEMS.map((item) => (
          <SettingsRow key={item.id} icon={item.icon} label={item.label} to={item.to} />
        ))}
      </div>
    </PageShell>
  )
}
