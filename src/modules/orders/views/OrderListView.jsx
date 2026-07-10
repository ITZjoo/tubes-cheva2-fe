import DashboardLayout from '../../../components/layout/DashboardLayout'
import Table from '../../../components/ui/Table'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Tanggal' },
]

export default function OrderListView() {
  // TODO: replace with orderService.getOrders(); status column should render <Badge status={...} />
  const rows = []

  return (
    <DashboardLayout activeRoute="/orders">
      <h1 className="font-heading mb-6 text-2xl font-bold text-on-surface">Pesanan</h1>
      <Table columns={columns} rows={rows} />
    </DashboardLayout>
  )
}
