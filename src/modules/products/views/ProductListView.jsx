import { Link } from 'react-router-dom'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'

const columns = [
  { key: 'name', label: 'Nama Produk' },
  { key: 'category', label: 'Kategori' },
  { key: 'price', label: 'Harga' },
]

export default function ProductListView() {
  // TODO: replace with productService.getProducts()
  const rows = []

  return (
    <DashboardLayout activeRoute="/products">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-on-surface">Produk</h1>
        <Link to="/products/new">
          <Button variant="primary">Tambah Produk</Button>
        </Link>
      </div>
      <Table columns={columns} rows={rows} />
    </DashboardLayout>
  )
}
