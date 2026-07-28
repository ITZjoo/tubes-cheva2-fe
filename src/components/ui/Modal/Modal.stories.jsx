import { useState } from 'react'
import Modal from './Modal'
import Input from '../Input'
import Icon from '../Icon'
import { SERVICE_TYPE_OPTIONS } from '../FilterPopover'

export default {
  title: 'ui/Modal',
  component: Modal,
}

function DropdownField({ label, value, options, onChange, prefix = '', className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={className}>
      {label && <span className="text-label-md font-bold text-on-surface">{label}</span>}
      <div className={['relative', label && 'mt-1'].filter(Boolean).join(' ')}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-1 rounded-lg border border-outline-variant px-4 py-2.5 text-body-md text-on-surface"
        >
          <span>
            {prefix}
            {value}
          </span>
          <Icon name="expand_more" size={20} className="text-on-surface-variant" />
        </button>
        {open && (
          <div className="absolute bottom-full right-0 z-10 mb-1 w-full min-w-[100px] overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest py-1.5 shadow-lg">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className="block w-full px-4 py-2 text-left text-body-md text-on-surface hover:bg-surface-container-low"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EditLayananExample() {
  const [open, setOpen] = useState(true)
  const [jenis, setJenis] = useState('Selimut')
  const [kategori, setKategori] = useState('Selimut')
  const [harga, setHarga] = useState('')
  const [satuan, setSatuan] = useState('Kg')

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary px-4 py-2.5 text-label-md text-on-primary"
      >
        Buka Edit Layanan
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Layanan"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-outline-variant px-4 py-2.5 text-label-md text-outline"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-primary py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary/90"
            >
              Simpan
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            variant="outlined"
            label="Jenis Layanan"
            value={jenis}
            onChange={(event) => setJenis(event.target.value)}
            placeholder="Masukkan jenis layanan"
          />
          <Input
            variant="outlined"
            label="Kategori"
            value={kategori}
            onChange={(event) => setKategori(event.target.value)}
            placeholder="Masukkan kategori"
          />

          <div className="flex items-end gap-2">
            <Input
              variant="outlined"
              label="Harga"
              type="text"
              inputMode="numeric"
              value={harga}
              onChange={(event) => setHarga(event.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Masukkan harga"
              className="flex-1"
            />
            <DropdownField
              value={satuan}
              options={['Kg', 'Pcs']}
              onChange={setSatuan}
              prefix="/ "
              className="w-28 shrink-0"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

export const EditLayanan = {
  render: () => <EditLayananExample />,
}

export const Basic = {
  render: () => {
    function Wrapper() {
      const [open, setOpen] = useState(true)
      return (
        <Modal open={open} onClose={() => setOpen(false)} title="Judul Modal">
          <p className="text-body-md text-on-surface-variant">Isi modal ditulis sebagai children.</p>
        </Modal>
      )
    }
    return <Wrapper />
  },
}
