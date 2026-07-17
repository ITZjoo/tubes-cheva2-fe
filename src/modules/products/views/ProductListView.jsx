import { Link } from 'react-router-dom'
import Typography from '../../../components/ui/Typography'

export default function ProductListView() {
  // TODO: replace with productService.getProducts() once Table is rebuilt

  return (
    <div className="p-6">
      <div className="mb-2 flex items-center justify-between">
        <Typography.H1>Produk</Typography.H1>
        <Typography.Link as={Link} to="/products/new">
          Tambah Produk
        </Typography.Link>
      </div>
      <Typography.BodyMd className="text-on-surface-variant">
        Layout dan Table menunggu di-develop ulang.
      </Typography.BodyMd>
    </div>
  )
}
