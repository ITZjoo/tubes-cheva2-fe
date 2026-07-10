import Card from './Card'

export default {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
}

export const Default = {
  args: {
    title: 'Ringkasan Hari Ini',
    children: <p className="text-sm text-gray-500">Placeholder konten card.</p>,
  },
}

export const WithoutTitle = {
  args: {
    children: <p className="text-sm text-gray-500">Card tanpa judul.</p>,
  },
}
