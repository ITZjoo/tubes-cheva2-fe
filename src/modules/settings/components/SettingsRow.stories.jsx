import { MemoryRouter } from 'react-router-dom'
import SettingsRow from './SettingsRow'

export default {
  title: 'Modules/Settings/SettingsRow',
  component: SettingsRow,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-2xl">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
}

export const Account = {
  args: { icon: 'person', label: 'Edit Profil Akun', to: '/pengaturan/akun' },
}

export const Laundry = {
  args: { icon: 'storefront', label: 'Edit Profil Laundry', to: '/pengaturan/laundry' },
}

export const Notifications = {
  args: { icon: 'notifications', label: 'Pengaturan Notifikasi', to: '/pengaturan/notifikasi' },
}

export const Payment = {
  args: { icon: 'receipt_long', label: 'Pengaturan Pembayaran', to: '/pengaturan/pembayaran' },
}
