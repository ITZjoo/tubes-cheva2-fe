import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon'
import Sidebar from '../../../components/ui/Sidebar'
import Typography from '../../../components/ui/Typography'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as productService from '../services/productService'

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
          const service = await productService.getSingleLayananUtama(id)
          if (service) {
            setForm({
              name: service.name,
              description: service.description,
              price: service.price.toString(),
              unit: service.unit
            })
          } else {
            setError('Layanan tidak ditemukan')
          }
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

    try {
      setLoading(true)
      if (isEdit) {
        await productService.updateLayananUtama(id, form)
      } else {
        await productService.createLayananUtama(form)
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
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <Sidebar activeItemId="layanan" onItemClick={handleSidebarNavigate} />

      {/* Main Content Pane */}
      <main className="flex-1 p-8 font-body max-w-[900px] mx-auto flex flex-col gap-6 text-left">
        
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
          <form onSubmit={handleSubmit} className="bg-white border border-outline-variant/30 rounded-3xl p-7 shadow-md flex flex-col gap-5.5 max-w-lg">
            
            {/* Input: Nama Layanan */}
            <div className="block">
              <label className="mb-2 block text-label-md text-on-surface font-bold">Nama Layanan</label>
              <input
                type="text"
                placeholder="Masukkan Nama Layanan..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full bg-surface-container-low border ${
                  formErrors.name ? 'border-error' : 'border-primary-container'
                } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all`}
              />
              {formErrors.name && <p className="mt-1 text-body-sm text-error">{formErrors.name}</p>}
            </div>

            {/* Textarea: Deskripsi */}
            <div className="block">
              <label className="mb-2 block text-label-md text-on-surface font-bold">Deskripsi</label>
              <textarea
                placeholder="Layanan cuci pakaian..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="4"
                className="w-full bg-surface-container-low border border-primary-container rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Price & Unit fields row */}
            <div className="block">
              <label className="mb-2 block text-label-md text-on-surface font-bold">Harga</label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    placeholder="Masukkan Harga"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={`w-full bg-surface-container-low border ${
                      formErrors.price ? 'border-error' : 'border-primary-container'
                    } rounded-xl px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:bg-white transition-all font-sans`}
                  />
                  {formErrors.price && <p className="mt-1 text-body-sm text-error">{formErrors.price}</p>}
                </div>

                {/* Unit selector Custom Dropdown */}
                <div className="relative w-36">
                  <button
                    type="button"
                    onClick={() => setUnitDropdownOpen(!unitDropdownOpen)}
                    className="w-full h-full bg-surface-container-low border border-primary-container rounded-xl px-4 flex items-center justify-between text-body-md text-primary font-semibold cursor-pointer select-none"
                  >
                    <span>/ {form.unit}</span>
                    <Icon name="arrow_drop_down" size={20} className="text-primary" />
                  </button>

                  {unitDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-full bg-white border border-outline-variant/35 rounded-xl shadow-lg z-20 py-1.5 font-sans">
                      {['Kg', 'Pcs'].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, unit: u })
                            setUnitDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-body-md font-semibold hover:bg-surface-container-low transition-colors text-on-surface ${
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
            </div>

            {/* Actions Submit */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-primary-container text-on-primary-container font-bold py-3 px-6 rounded-2xl hover:brightness-95 transition-all cursor-pointer shadow-xs font-sans text-label-md"
              >
                {isEdit ? 'Simpan Layanan' : 'Tambahkan Layanan'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
