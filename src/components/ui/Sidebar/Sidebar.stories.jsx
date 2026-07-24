import React, { useState } from 'react'
import Sidebar from './Sidebar'

const DEFAULT_MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'pesanan', label: 'Pesanan', icon: 'assignment' },
  { id: 'layanan', label: 'Layanan', icon: 'dry_cleaning' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'notifikasi', label: 'Notifikasi', icon: 'notifications' },
  { id: 'pendapatan', label: 'Pendapatan', icon: 'leaderboard' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'settings' },
]

const DEFAULT_USER = {
  name: 'Utama Laundry',
  role: 'Owner',
  avatarUrl: null,
}

const MENU_ITEM_OPTIONS = DEFAULT_MENU_ITEMS.map((item) => item.id)

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {
    activeItemId: {
      control: { type: 'select' },
      options: MENU_ITEM_OPTIONS,
      description: 'ID dari item menu aktif (controlled mode)',
    },
    defaultActiveItemId: {
      control: { type: 'select' },
      options: MENU_ITEM_OPTIONS,
      description: 'Default ID dari item menu aktif (uncontrolled mode)',
    },
    user: {
      control: 'object',
      description: 'Data pengguna yang sedang masuk',
    },
    onItemClick: { action: 'clicked item' },
    onLogout: { action: 'clicked log out' },
  },
}

// Komponen pembungkus untuk menghindari kesalahan aturan React Hooks (linter) pada storybook render method
const SidebarInteractiveWrapper = (args) => {
  const [activeId, setActiveId] = useState(args.defaultActiveItemId)
  return (
    <div className="flex bg-surface-dim/20 min-h-[700px] border border-outline-variant rounded-2xl overflow-hidden shadow-md">
      <Sidebar
        {...args}
        activeItemId={activeId}
        onItemClick={(item) => {
          setActiveId(item.id)
          args.onItemClick(item)
        }}
      />
      <div className="flex-1 p-8 flex flex-col justify-between bg-surface">
        <div>
          <h2 className="text-h2 text-primary capitalize mb-2">Halaman: {activeId}</h2>
          <p className="text-body-md text-on-surface-variant max-w-md">
            Ini adalah area konten utama aplikasi. Ketika kamu mengklik item menu di Sidebar,
            halaman ini akan berganti secara responsif.
          </p>
        </div>
        <div className="text-label-sm text-on-surface-variant/70 border-t border-outline-variant pt-4">
          Status Sidebar: **Berjalan Lancar (Up-to-date dengan Main)**
        </div>
      </div>
    </div>
  )
}

// 1. Showcase Interaktif (Menggunakan state lokal agar menu bisa diklik dan berganti secara interaktif di Storybook)
export const InteractivePlayground = {
  args: {
    defaultActiveItemId: 'dashboard',
    user: DEFAULT_USER,
  },
  render: (args) => <SidebarInteractiveWrapper {...args} />,
}

// 2. Showcase Grid (Menampilkan semua 7 status menu aktif sekaligus seperti yang terlihat di mockup Sidebar.png)
export const AllMockupStates = {
  render: () => (
    <div className="flex flex-col gap-10 bg-surface-dim/10 p-8 rounded-2xl border border-outline-variant">
      <div>
        <h3 className="text-h3 text-primary mb-2">Semua State Sesuai Gambar Mockup (Sidebar.png)</h3>
        <p className="text-body-sm text-on-surface-variant mb-6">
          Berikut adalah visualisasi komponen Sidebar pada masing-masing item menu saat berstatus aktif.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">1. Dashboard Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="dashboard" />
          </div>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">2. Pesanan Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="pesanan" />
          </div>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">3. Layanan Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="layanan" />
          </div>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">4. History Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="history" />
          </div>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">5. Notifikasi Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="notifikasi" />
          </div>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">6. Pendapatan Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="pendapatan" />
          </div>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface-variant mb-2">7. Pengaturan Aktif</h4>
          <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm inline-block bg-white">
            <Sidebar activeItemId="pengaturan" />
          </div>
        </div>
      </div>
    </div>
  ),
}

// 3. Kustom User dengan Foto Profil asli
export const CustomUserWithPhoto = {
  args: {
    defaultActiveItemId: 'dashboard',
    user: {
      name: 'Nabila Safira',
      role: 'Administrator',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  },
}
