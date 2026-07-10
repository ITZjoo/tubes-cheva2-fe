import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../../components/layout/DashboardLayout'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

export default function ProductFormView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.name) nextErrors.name = 'Nama produk wajib diisi'
    if (!form.price) nextErrors.price = 'Harga wajib diisi'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    // TODO: call productService.createProduct/updateProduct
    navigate('/products')
  }

  return (
    <DashboardLayout activeRoute="/products">
      <h1 className="font-heading mb-6 text-2xl font-bold text-on-surface">
        {isEdit ? 'Edit Produk' : 'Tambah Produk'}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
      >
        <Input
          label="Nama Produk"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="Cuci Kiloan"
        />
        <Input
          label="Kategori"
          value={form.category}
          onChange={handleChange('category')}
          placeholder="Kiloan / Satuan"
        />
        <Input
          label="Harga"
          type="number"
          value={form.price}
          onChange={handleChange('price')}
          error={errors.price}
          placeholder="6000"
        />
        <Input
          label="Stok"
          type="number"
          value={form.stock}
          onChange={handleChange('stock')}
          placeholder="0"
        />

        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            Simpan
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
            Batal
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
