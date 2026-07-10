import Modal from './Modal'

export default {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
}

export const Open = {
  args: {
    isOpen: true,
    title: 'Hapus Produk',
    onClose: () => {},
    children: <p className="text-sm text-on-surface-variant">Yakin ingin menghapus produk ini?</p>,
  },
}

export const Closed = {
  args: {
    isOpen: false,
    title: 'Hapus Produk',
    onClose: () => {},
    children: <p className="text-sm text-on-surface-variant">Modal tersembunyi ketika isOpen false.</p>,
  },
}
