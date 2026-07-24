import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon'
import QuantityInput from '../QuantityInput'

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
  onSubmit,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [weightKg, setWeightKg] = useState('')
  const [quantities, setQuantities] = useState({})

  const setQuantity = (key, value) => setQuantities((prev) => ({ ...prev, [key]: value }))

  const handleClose = () => setOpen(false)

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleSubmit = () => {
    onSubmit?.({ weightKg: Number(weightKg) || 0, quantities })
    setWeightKg('')
    setQuantities({})
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

      {open &&
        createPortal(
          <div
            role="presentation"
            className="fixed inset-0 z-30 flex items-start justify-center bg-on-surface/40 pt-24"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) handleClose()
            }}
          >
            <div
              role="dialog"
              aria-label="Tambah Pesanan"
              className="flex max-h-[80vh] w-[359px] flex-col rounded-lg bg-surface-container-lowest shadow-lg"
            >
              <div className="flex items-center gap-2.5 border-b border-outline-variant px-5 py-4">
                <button type="button" onClick={handleClose} aria-label="Kembali" className="flex items-center">
                  <Icon name="chevron_left" size={24} className="text-on-surface" />
                </button>
                <span className="text-button text-on-surface">Tambah Pesanan</span>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
                <span className="text-label-md font-bold text-on-surface">Layanan utama</span>
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
                          {/* QuantityInput centers itself via `mx-auto`; wrapping it in an
                              equal-width box makes that centering a no-op so this row's
                              `justify-between` is what pins it to the right edge. */}
                          <div className="w-[92px] shrink-0">
                            <QuantityInput
                              value={quantities[item.key] ?? 0}
                              onChange={(value) => setQuantity(item.key, value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant px-5 py-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-primary py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary/90"
                >
                  Simpan Pesanan
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
