import { useParams } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'

export default function OrderDetailView() {
  const { id } = useParams()

  // TODO: replace with orderService.getOrder(id) once Card/Badge are rebuilt

  return (
    <div className="p-6">
      <Typography.H1 className="mb-2">Detail Pesanan #{id}</Typography.H1>
      <Typography.BodyMd className="text-on-surface-variant">
        Layout, Card, dan Badge menunggu di-develop ulang.
      </Typography.BodyMd>
    </div>
  )
}
