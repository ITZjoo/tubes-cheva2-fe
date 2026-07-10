import { useParams } from 'react-router-dom'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'

export default function OrderDetailView() {
  const { id } = useParams()

  // TODO: replace with orderService.getOrder(id)

  return (
    <DashboardLayout activeRoute="/orders">
      <h1 className="font-heading mb-6 text-2xl font-bold text-on-surface">
        Detail Pesanan #{id}
      </h1>
      <Card title="Informasi Pesanan">
        <div className="space-y-2 text-sm text-on-surface">
          <p>Customer: -</p>
          <p>
            Status: <Badge status="pending" />
          </p>
          <p>Tanggal: -</p>
        </div>
      </Card>
    </DashboardLayout>
  )
}
