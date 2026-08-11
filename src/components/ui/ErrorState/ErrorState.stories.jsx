import ErrorState from './ErrorState'
import NotFoundIllustration from './NotFoundIllustration'
import AccessDeniedIllustration from './AccessDeniedIllustration'
import ServerErrorIllustration from './ServerErrorIllustration'
import Button from '../Button'

export default {
  title: 'UI/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  argTypes: {
    card: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[500px] bg-surface p-6">
        <Story />
      </div>
    ),
  ],
}

export const NotFound = {
  args: {
    illustration: <NotFoundIllustration />,
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang kamu cari tidak tersedia. Halaman mungkin salah atau halaman sudah dihapus.',
    card: true,
  },
}

export const WithAction = {
  args: {
    illustration: <NotFoundIllustration />,
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang kamu cari tidak tersedia. Halaman mungkin salah atau halaman sudah dihapus.',
    card: true,
    action: <Button variant="primary">Kembali ke Dashboard</Button>,
  },
}

export const NoCard = {
  args: {
    illustration: <NotFoundIllustration />,
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang kamu cari tidak tersedia. Halaman mungkin salah atau halaman sudah dihapus.',
    card: false,
  },
}

export const AccessDenied = {
  args: {
    illustration: <AccessDeniedIllustration />,
    title: 'Akses Ditolak',
    description: 'Kamu tidak memiliki izin untuk membuka halaman ini. Hubungi administrator jika kamu merasa ini sebuah kesalahan.',
    card: true,
  },
}

export const ServerError = {
  args: {
    illustration: <ServerErrorIllustration />,
    title: 'Sistem Lagi Bermasalah',
    description: 'Terjadi gangguan teknis. Silahkan hubungi teknisi terkait, dan coba muat ulang beberapa saat lagi',
    card: true,
  },
}
