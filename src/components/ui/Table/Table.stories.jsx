import Table from './Table'

export default {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nama' },
  { key: 'price', label: 'Harga' },
]

export const Default = {
  args: {
    columns,
    rows: [
      { id: 1, name: 'Cuci Kiloan', price: 'Rp 6.000/kg' },
      { id: 2, name: 'Cuci Satuan - Selimut', price: 'Rp 15.000' },
    ],
  },
}

export const Empty = {
  args: { columns, rows: [] },
}
