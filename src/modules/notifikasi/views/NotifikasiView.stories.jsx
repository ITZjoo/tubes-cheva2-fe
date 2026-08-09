import { MemoryRouter } from 'react-router-dom'
import NotifikasiView from './NotifikasiView'

export default {
  title: 'Notifikasi/NotifikasiView',
  component: NotifikasiView,
  parameters: { layout: 'fullscreen' },
  // Sidebar pakai useSidebarNavigate (react-router), jadi butuh Router
  // context. KALAU .storybook/preview.js kamu udah punya Router decorator
  // global (banyak tim yang pasang ini biar semua story otomatis kebungkus),
  // hapus decorators di bawah ini — nested <Router> bakal error.
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/notifikasi']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export const Default = {}

export const Kosong = {
  args: {
    initialNotifications: [],
  },
}