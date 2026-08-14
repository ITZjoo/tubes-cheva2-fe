import { useState, useEffect } from 'react'
import Icon from '../../../components/ui/Icon'
import PageShell from '../../../components/ui/PageShell'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as serviceService from '../services/productService'

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div className="mb-6 relative">
        <svg viewBox="0 0 200 200" className="w-56 h-56 text-primary">
          <rect x="70" y="90" width="70" height="70" fill="#004d62" rx="6" />
          <circle cx="105" cy="125" r="5" fill="#ffffff" />
          <rect x="75" y="45" width="60" height="42" fill="#003543" rx="6" />
          <circle cx="105" cy="66" r="4" fill="#ffffff" />
          <path d="M40 70 C40 50, 60 50, 60 70 L55 140 L45 140 Z" fill="#0a6780" />
          <circle cx="50" cy="45" r="12" fill="#ffdea4" />
          <path d="M40 45 C40 35, 60 35, 60 45 Z" fill="#171d1e" />
          <circle cx="115" cy="25" r="14" fill="#eff5f6" stroke="#0a6780" strokeWidth="2" />
          <text x="115" y="30" textAnchor="middle" fill="#0a6780" fontWeight="bold" fontSize="16">!</text>
          <rect x="155" y="120" width="16" height="20" fill="#70787c" rx="2" />
          <line x1="163" y1="120" x2="163" y2="90" stroke="#70787c" strokeWidth="2" />
          <circle cx="163" cy="85" r="5" fill="#2d6a44" />
          <circle cx="156" cy="98" r="4.5" fill="#2d6a44" />
          <circle cx="170" cy="108" r="4.5" fill="#2d6a44" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-on-surface font-sans mb-1.5">Tambahkan Layanan Dulu!</h2>
      <p className="text-body-md text-on-surface-variant/70 font-semibold max-w-sm">
        Silahkan tekan tombol layanan, untuk menambahkan layanan
      </p>
    </div>
  )
}

function generateServiceCode(name) {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  const suffix = Date.now().toString(36).toUpperCase().slice(-5)
  return `${base || 'LAYANAN'}_${suffix}`
}

export default function ProductListView() {
  const handleSidebarNavigate = useSidebarNavigate()
  // 'utama' = per-kilogram services (type KILOAN/EXPRESS), 'tambahan' = per-satuan services (type SATUAN).
  // The backend Service model is a flat list with no grouping field, so both tabs
  // are just filtered views over the same list rather than a nested group/item tree.
  const [activeTab, setActiveTab] = useState('utama')

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeMenuId, setActiveMenuId] = useState(null)
  const [activeModal, setActiveModal] = useState(null) // null | 'form'
  const [deleteConfirm, setDeleteConfirm] = useState(null) // null | { id, message }

  const [selectedItem, setSelectedItem] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', unit: 'Kg' })
  const [errors, setErrors] = useState({})
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await serviceService.listServices({ all: true })
      setServices(data)
    } catch (err) {
      console.error('Failed to load services', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [])

  const utamaServices = services.filter((s) => s.type !== 'SATUAN')
  const tambahanServices = services.filter((s) => s.type === 'SATUAN')
  const currentList = activeTab === 'utama' ? utamaServices : tambahanServices

  const handleOpenModal = (service = null) => {
    setErrors({})
    setUnitDropdownOpen(false)
    if (service) {
      setSelectedItem(service)
      setForm({
        name: service.name,
        description: service.description || '',
        price: String(service.type === 'SATUAN' ? service.priceUnit : service.pricePerKg),
        unit: service.type === 'SATUAN' ? 'Pcs' : 'Kg',
      })
    } else {
      setSelectedItem(null)
      setForm({ name: '', description: '', price: '', unit: activeTab === 'tambahan' ? 'Pcs' : 'Kg' })
    }
    setActiveModal('form')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama layanan wajib diisi'
    if (!form.price.trim() || isNaN(Number(form.price))) errs.price = 'Harga wajib diisi'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
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
      if (selectedItem) {
        await serviceService.updateService(selectedItem.id, payload)
      } else {
        await serviceService.createService({ ...payload, code: generateServiceCode(form.name) })
      }
      setActiveModal(null)
      await loadData()
    } catch (err) {
      setErrors({ name: err.message })
    }
  }

  const handleToggleActive = async (service) => {
    try {
      await serviceService.updateService(service.id, { isActive: !service.isActive })
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = (service) => {
    setDeleteConfirm({
      id: service.id,
      message: `Apakah Anda yakin ingin menghapus "${service.name}"? Tindakan ini tidak dapat dibatalkan.`,
    })
  }

  const confirmDelete = async () => {
    const { id } = deleteConfirm
    setDeleteConfirm(null)
    try {
      await serviceService.deleteService(id)
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageShell
      activeItemId="layanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-[32px] font-bold text-on-surface font-sans leading-tight">Layanan</h1>
          <p className="text-body-md text-on-surface-variant/80 font-medium mt-1">
            Kelola layanan laundry yang tersedia untuk pelanggan.
          </p>
        </div>

        <button className="w-11 h-11 bg-white border border-outline-variant/40 rounded-full flex items-center justify-center relative shadow-xs cursor-pointer hover:bg-surface-container transition-all">
          <Icon name="notifications" size={22} className="text-on-surface-variant" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border border-white"></span>
        </button>
      </header>

      <section className="bg-white border border-outline-variant/30 rounded-3xl shadow-md p-6.5 flex-1 flex flex-col min-h-[500px]">
        <div className="flex justify-center border-b border-outline-variant/30 mb-6 font-sans">
          <button
            onClick={() => setActiveTab('utama')}
            className={`px-8 py-3.5 text-label-lg font-bold transition-all relative border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'utama'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'
            }`}
          >
            Layanan Utama
          </button>
          <button
            onClick={() => setActiveTab('tambahan')}
            className={`px-8 py-3.5 text-label-lg font-bold transition-all relative border-b-2 -mb-[2px] cursor-pointer ${
              activeTab === 'tambahan'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant/50 border-transparent hover:text-on-surface-variant'
            }`}
          >
            Layanan Tambahan
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <span className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
              <p className="text-body-md text-on-surface-variant/70 font-semibold">Memuat layanan...</p>
            </div>
          ) : currentList.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-4">
              {currentList.map((service) => (
                <div
                  key={service.id}
                  className={`border border-outline-variant/40 rounded-2xl p-5 flex items-center justify-between transition-all bg-white hover:shadow-sm ${
                    !service.isActive ? 'opacity-55' : ''
                  }`}
                >
                  <div className="flex-1 pr-6 text-left">
                    <h3 className="text-lg font-bold text-on-surface font-sans flex items-center gap-2">
                      {service.name}
                      {!service.isActive && (
                        <Icon name="visibility_off" size={16} className="text-on-surface-variant/60" />
                      )}
                    </h3>
                    {service.description && (
                      <p className="text-body-sm font-semibold text-on-surface-variant/80 mt-1 max-w-[700px] leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-8">
                    <span className="text-xl font-bold text-primary font-sans">
                      Rp. {((service.type === 'SATUAN' ? service.priceUnit : service.pricePerKg) ?? 0).toLocaleString('id-ID')}{' '}
                      <span className="text-body-sm font-medium text-on-surface-variant">
                        / {service.type === 'SATUAN' ? 'Pcs' : 'Kg'}
                      </span>
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="border border-outline-variant/60 rounded-xl px-4 py-2 text-label-md font-bold text-on-surface-variant flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer bg-white"
                      >
                        <Icon name="edit" size={18} />
                        <span>Edit</span>
                      </button>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMenuId(activeMenuId === service.id ? null : service.id)
                          }}
                          className="w-10 h-10 hover:bg-surface-container rounded-xl flex items-center justify-center transition-colors cursor-pointer text-on-surface-variant"
                        >
                          <Icon name="more_vert" size={22} />
                        </button>

                        {activeMenuId === service.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-1 w-56 bg-white border border-outline-variant/40 rounded-2xl shadow-lg py-2.5 z-10 font-sans"
                          >
                            <button
                              onClick={() => {
                                handleToggleActive(service)
                                setActiveMenuId(null)
                              }}
                              className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-on-surface hover:bg-surface-container flex items-center gap-3 cursor-pointer"
                            >
                              <Icon
                                name={service.isActive ? 'visibility_off' : 'visibility'}
                                size={18}
                                className="text-on-surface-variant/80"
                              />
                              <span>{service.isActive ? 'Sembunyikan' : 'Tampilkan'}</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(service)
                                setActiveMenuId(null)
                              }}
                              className="w-full text-left px-4.5 py-2.5 text-label-md font-bold text-error hover:bg-error-container/30 flex items-center gap-3 cursor-pointer"
                            >
                              <Icon name="delete" size={18} className="text-error" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6.5">
            <Button
              variant="primary"
              appearance="solid"
              startIcon={<Icon name="add" size={20} />}
              onClick={() => handleOpenModal()}
              className="font-bold rounded-xl cursor-pointer bg-primary text-white hover:brightness-95 px-5 h-11"
            >
              {activeTab === 'utama' ? 'Tambahkan Layanan' : 'Tambahkan Layanan Tambahan'}
            </Button>
          </div>
        </div>
      </section>

      {/* Tambah / Edit Layanan */}
      <Modal
        open={activeModal === 'form'}
        onClose={() => setActiveModal(null)}
        title={selectedItem ? 'Edit Layanan' : 'Tambah Layanan'}
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="rounded-lg border border-outline-variant px-4 py-2.5 text-label-md text-outline"
            >
              Batal
            </button>
            <button
              type="submit"
              form="form-service"
              className="flex-1 rounded-lg bg-primary py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary/90"
            >
              {selectedItem ? 'Simpan Layanan' : 'Tambahkan Layanan'}
            </button>
          </div>
        }
      >
        <form id="form-service" onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            variant="outlined"
            label="Nama Layanan"
            placeholder="Masukkan Nama Layanan..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />

          <div className="block">
            <label className="mb-2 block text-label-md text-on-surface font-bold">Deskripsi</label>
            <textarea
              placeholder="Layanan cuci pakaian..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="3.5"
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
              error={errors.price}
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
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={Boolean(deleteConfirm)}
        onClose={() => setDeleteConfirm(null)}
        title="Konfirmasi Hapus"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="rounded-lg border border-outline-variant px-4 py-2.5 text-label-md text-outline"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="flex-1 rounded-lg bg-error py-2.5 text-label-md text-white transition-colors hover:bg-error/90"
            >
              Hapus
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <Icon name="warning" size={24} className="mt-0.5 shrink-0 text-error" />
          <p className="text-body-md leading-relaxed text-on-surface-variant">{deleteConfirm?.message}</p>
        </div>
      </Modal>
    </PageShell>
  )
}
