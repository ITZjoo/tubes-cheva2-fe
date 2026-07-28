import { useRef, useState } from 'react'
import Drawer from '../Drawer'
import Icon from '../Icon'
import QuantityInput from '../QuantityInput'
import TeleportPanel from '../TeleportPanel'

export const ADDITIONAL_SERVICE_GROUPS = [
  {
    key: 'selimut',
    label: 'Selimut',
    items: [
      { key: 'selimut_kecil', label: 'Selimut Kecil' },
      { key: 'selimut_besar', label: 'Selimut Besar' },
    ],
  },
  {
    key: 'sprei',
    label: 'Sprei',
    items: [
      { key: 'sprei_kecil', label: 'Sprei Kecil' },
      { key: 'sprei_besar', label: 'Sprei Besar' },
    ],
  },
  {
    key: 'bantal',
    label: 'Bantal',
    items: [
      { key: 'bantal_kecil', label: 'Bantal Kecil' },
      { key: 'bantal_besar', label: 'Bantal Besar' },
    ],
  },
  {
    key: 'boneka',
    label: 'Boneka',
    items: [
      { key: 'boneka_kecil', label: 'Boneka Kecil' },
      { key: 'boneka_besar', label: 'Boneka Besar' },
    ],
  },
  {
    key: 'bed_cover',
    label: 'Bed Cover',
    items: [
      { key: 'bed_cover_kecil', label: 'Bed Cover Kecil' },
      { key: 'bed_cover_besar', label: 'Bed Cover Besar' },
    ],
  },
  {
    key: 'karpet',
    label: 'Karpet',
    items: [
      { key: 'karpet_kecil', label: 'Karpet Kecil' },
      { key: 'karpet_besar', label: 'Karpet Besar' },
    ],
  },
]

export default function AddOrderPopover({
  triggerLabel = 'Tambah Pesanan',
  serviceGroups = ADDITIONAL_SERVICE_GROUPS,
  customers = [],
  onAddCustomer,
  onSubmit,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [weightKg, setWeightKg] = useState('')
  const [quantities, setQuantities] = useState({})
  const [customerQuery, setCustomerQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [suggestOpen, setSuggestOpen] = useState(false)
  // 'list' shows matching customers (or a "tambah pelanggan baru" row when
  // there are none); 'add' swaps the same panel to a small name+phone form.
  const [panelMode, setPanelMode] = useState('list')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const customerFieldRef = useRef(null)

  const setQuantity = (key, value) => setQuantities((prev) => ({ ...prev, [key]: value }))

  const trimmedName = customerQuery.trim()
  const matchedCustomer = customers.find((customer) => customer.name.toLowerCase() === trimmedName.toLowerCase())
  const customerSuggestions = trimmedName
    ? customers.filter((customer) => customer.name.toLowerCase().includes(trimmedName.toLowerCase()))
    : customers

  const selectCustomer = (customer) => {
    setCustomerQuery(customer.name)
    setSelectedCustomer(customer)
    setSuggestOpen(false)
    setPanelMode('list')
  }

  const openAddPanel = () => {
    setNewCustomerPhone('')
    setPanelMode('add')
  }

  const handleAddCustomer = () => {
    const name = customerQuery.trim()
    const phone = newCustomerPhone.trim()
    if (!name || !phone) return
    const created = onAddCustomer?.({ name, phone }) ?? { name, phone }
    setSelectedCustomer(created)
    setCustomerQuery(created.name)
    setSuggestOpen(false)
    setPanelMode('list')
  }

  const handleClose = () => setOpen(false)

  const closeCustomerPanel = () => {
    setSuggestOpen(false)
    setPanelMode('list')
  }

  const resetForm = () => {
    setWeightKg('')
    setQuantities({})
    setCustomerQuery('')
    setSelectedCustomer(null)
    setNewCustomerPhone('')
    setSuggestOpen(false)
    setPanelMode('list')
  }

  const handleSubmit = () => {
    const customer = selectedCustomer ?? matchedCustomer ?? null
    onSubmit?.({ weightKg: Number(weightKg) || 0, quantities, customer })
    resetForm()
    setOpen(false)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90"
      >
        <Icon name="add" size={18} />
        {triggerLabel}
      </button>

      <Drawer
        open={open}
        onClose={handleClose}
        title="Tambah Pesanan"
        closeIcon="chevron_left"
        footer={
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-lg bg-primary py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary/90"
          >
            Simpan Pesanan
          </button>
        }
      >
        <div className="relative" ref={customerFieldRef}>
          <span className="text-label-md font-bold text-on-surface">Nama Pelanggan</span>
          <input
            type="text"
            value={customerQuery}
            onChange={(event) => {
              setCustomerQuery(event.target.value)
              setSelectedCustomer(null)
              setPanelMode('list')
              setSuggestOpen(true)
            }}
            onFocus={() => setSuggestOpen(true)}
            placeholder="Cari atau masukkan nama pelanggan"
            className="mt-1 w-full rounded-lg border border-outline-variant px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary"
          />

          <TeleportPanel
            anchorRef={customerFieldRef}
            open={suggestOpen && (panelMode === 'add' || customerSuggestions.length > 0 || Boolean(trimmedName))}
            onClose={closeCustomerPanel}
            className="rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg"
          >
              {panelMode === 'list' ? (
                customerSuggestions.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    {customerSuggestions.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="block w-full px-4 py-2.5 text-left text-body-md text-on-surface hover:bg-surface-container-low"
                      >
                        {customer.name}
                      </button>
                    ))}
                  </div>
                ) : trimmedName ? (
                  <button
                    type="button"
                    onClick={openAddPanel}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-body-md text-primary hover:bg-surface-container-low"
                  >
                    <Icon name="add" size={18} />
                    Tambah pelanggan baru
                  </button>
                ) : null
              ) : (
                <div className="flex flex-col gap-3 p-4">
                  <div>
                    <span className="text-label-sm font-bold text-on-surface">Nama Pelanggan</span>
                    <input
                      type="text"
                      value={customerQuery}
                      onChange={(event) => setCustomerQuery(event.target.value)}
                      placeholder="Masukkan nama pelanggan"
                      className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <span className="text-label-sm font-bold text-on-surface">No. Handphone</span>
                    <input
                      type="tel"
                      value={newCustomerPhone}
                      onChange={(event) => setNewCustomerPhone(event.target.value)}
                      placeholder="Masukkan nomor HP"
                      className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPanelMode('list')}
                      className="flex-1 rounded-lg border border-outline-variant py-2 text-label-sm text-outline"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomer}
                      disabled={!trimmedName || !newCustomerPhone.trim()}
                      className="flex-1 rounded-lg bg-primary py-2 text-label-sm text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              )}
          </TeleportPanel>
        </div>

        <span className="mt-5 block text-label-md font-bold text-on-surface">Layanan utama</span>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-body-md text-on-surface-variant">Cuci Kiloan</span>
          <input
            type="number"
            min="0"
            value={weightKg}
            onChange={(event) => setWeightKg(event.target.value)}
            placeholder="Masukkan Kilogram"
            className="w-36 [appearance:textfield] rounded-lg border border-primary/50 px-3 py-1.5 text-left text-label-sm text-primary placeholder:text-primary/50 focus:border-primary focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </div>

        <span className="mt-5 block text-label-md font-bold text-on-surface">Layanan Tambahan</span>
        {serviceGroups.map((group) => (
          <div key={group.key} className="mt-4">
            <span className="text-label-sm font-bold text-outline">{group.label}</span>
            <div className="mt-2 flex flex-col gap-2">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-3">
                  <span className="text-body-md text-on-surface-variant">{item.label}</span>
                  <QuantityInput
                    value={quantities[item.key] ?? 0}
                    onChange={(value) => setQuantity(item.key, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Drawer>
    </div>
  )
}
