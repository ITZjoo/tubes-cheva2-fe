import Dashboard from './Dashboard'

export default {
  title: 'UI/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  argTypes: {
    showSidebar: {
      control: 'boolean',
      description: 'Menampilkan Sidebar Utama di sebelah kiri layout',
    },
    onLogoutClick: { action: 'clicked log out' },
    onShopStatusChange: { action: 'shop status toggled' },
  },
}

// 1. Full Dashboard Layout (Dengan Sidebar - Sesuai dengan mockup Dashboard.png)
export const FullLayout = {
  args: {
    showSidebar: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
}

// 2. Hanya Panel Konten Utama (Tanpa Sidebar - Berguna jika sidebar dirender di tingkat root layout)
export const ContentPaneOnly = {
  args: {
    showSidebar: false,
  },
}
