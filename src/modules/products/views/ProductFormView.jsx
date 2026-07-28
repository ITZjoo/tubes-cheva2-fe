import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import PageShell from '../../../components/ui/PageShell'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as serviceService from '../services/productService'

function generateServiceCode(name) {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  const suffix = Date.now().toString(36).toUpperCase().slice(-5)
  return `${base || 'LAYANAN'}_${suffix}`
}

export default function ProductFormView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const handleSidebarNavigate = useSidebarNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'Kg'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const fetchService = async () => {
        try {
          setLoading(true)
          const service = await serviceService.getService(id)
          setForm({
            name: service.name,
            description: service.description || '',
            price: String(service.type === 'SATUAN' ? service.priceUnit : service.pricePerKg),
            unit: service.type === 'SATUAN' ? 'Pcs' : 'Kg',
          })
        } catch (err) {
          console.error('Gagal memuat data layanan:', err)
          setError(`Gagal memuat data layanan. Detail: ${err.message || err}`)
        } finally {
          setLoading(false)
        }
      }
      fetchService()
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama layanan wajib diisi'
    if (!form.price.trim() || isNaN(Number(form.price))) errs.price = 'Harga wajib diisi'

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }

    const type = form.unit === 'Kg' ? 'KILOAN' : 'SATUAN'
    const payload = {
      name: form.name,
      description: form.description || undefined,
      type,
      pricePerKg: type === 'KILOAN' ? Number(form.price) : undefined,
      priceUnit: type === 'SATUAN' ? Number(form.price) : undefined,
    }

    try {
      setLoading(true)
      if (isEdit) {
        await serviceService.updateService(id, payload)
      } else {
        await serviceService.createService({ ...payload, code: generateServiceCode(form.name) })
      }
      navigate('/products')
    } catch (err) {
      console.error('Gagal menyimpan data layanan:', err)
      setError(`Gagal menyimpan data layanan. Detail: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      activeItemId="layanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-8 font-body max-w-[900px] mx-auto flex flex-col gap-6 text-left"
    >
        
        {/* Header Section */}
        <section className="flex items-center gap-3 border-b border-outline-variant/35 pb-4.5">
          <button
            onClick={() => navigate('/products')}
            className="w-10 h-10 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
          >
            <Icon name="arrow_back" size={22} className="text-on-surface" />
          </button>
          <h2 className="text-xl font-bold text-on-surface">
            {isEdit ? 'Edit Layanan' : 'Tambah Layanan'}
          </h2>
        </section>

        {/* Form Body */}
        {loading && !form.name ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <span className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
            <Typography.BodyMd className="text-on-surface-variant font-semibold">Memuat...</Typography.BodyMd>
          </div>
        ) : error ? (
          <div className="bg-error-container/30 border border-error/20 rounded-2xl p-6 text-center max-w-md mx-auto">
            <Icon name="error" size={40} className="text-error mb-2" />
            <Typography.H3 className="text-error">{error}</Typography.H3>
            <Button
              variant="primary"
              appearance="outline"
              onClick={() => navigate('/products')}
              className="mt-4 font-bold rounded-xl cursor-pointer"
            >
              Kembali ke Kelola Layanan
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-outline-variant/30 rounded-3xl p-7 shadow-md flex flex-col gap-4 max-w-lg">
            <Input
              variant="outlined"
              label="Nama Layanan"
              placeholder="Masukkan Nama Layanan..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={formErrors.name}
            />

            <div className="block">
              <label className="mb-2 block text-label-md text-on-surface font-bold">Deskripsi</label>
              <textarea
                placeholder="Layanan cuci pakaian..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="4"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-primary transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-end gap-2">
              <Input
                variant="outlined"
                label="Harga"
                type="text"
                inputMode="numeric"
                placeholder="Masukkan Harga"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^0-9]/g, '') })}
                error={formErrors.price}
                className="flex-1"
              />

              <div className="relative w-28 shrink-0">
                <button
                  type="button"
                  onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                  className="flex w-full items-center justify-between gap-1 rounded-lg border border-outline-variant px-4 py-2.5 text-body-md text-on-surface"
                >
                  <span>/ {form.unit}</span>
                  <Icon name="expand_more" size={20} className="text-on-surface-variant" />
                </button>

                {unitDropdownOpen && (
                  <div className="absolute bottom-full right-0 z-10 mb-1 w-full overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest py-1.5 shadow-lg">
                    {['Kg', 'Pcs'].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, unit: u })
                          setUnitDropdownOpen(false)
                        }}
                        className={`block w-full px-4 py-2 text-left text-body-md text-on-surface hover:bg-surface-container-low ${
                          form.unit === u ? 'bg-primary-container/40 text-on-primary-container' : ''
                        }`}
                      >
                        / {u}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-primary-container text-on-primary-container font-bold py-3 px-6 rounded-2xl hover:brightness-95 transition-all cursor-pointer shadow-xs font-sans text-label-md"
              >
                {isEdit ? 'Simpan Layanan' : 'Tambahkan Layanan'}
              </button>
            </div>
          </form>
        )}
    </PageShell>
  )
}
