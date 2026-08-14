import { MemoryRouter } from 'react-router-dom'
import NotifikasiView from './NotifikasiView'

export default {
  title: 'Notifikasi/NotifikasiView',
  component: NotifikasiView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/notifikasi']}>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export const Default = {}

export const Kosong = {}