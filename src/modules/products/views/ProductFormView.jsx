import { useParams } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'

export default function ProductFormView() {
  const { id } = useParams()
  const isEdit = Boolean(id)

  // TODO: call productService.createProduct/updateProduct once Input/Button are rebuilt

  return (
    <div className="p-6">
      <Typography.H1 className="mb-2">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</Typography.H1>
      <Typography.BodyMd className="text-on-surface-variant">
        Layout, Input, dan Button menunggu di-develop ulang.
      </Typography.BodyMd>
    </div>
  )
}
