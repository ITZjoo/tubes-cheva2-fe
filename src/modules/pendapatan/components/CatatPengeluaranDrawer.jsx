import { useState } from 'react'
import Drawer from '../../../components/ui/Drawer'
import Input from '../../../components/ui/Input'
import * as pendapatanService from '../services/pendapatanService'

export const EXPENSE_CATEGORY_LABEL = {
  BAHAN_BAKU: 'Bahan Baku',
  UTILITAS: 'Utilitas',
  GAJI: 'Gaji',
  ADMINISTRASI: 'Administrasi',
  LAINNYA: 'Lainnya',
}

const CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY_LABEL)

const INITIAL_FORM = {
  category: 'BAHAN_BAKU',
  amount: '',
  source: '',
  description: '',
}

export default function CatatPengeluaranDrawer({ open, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleClose = () => {
    setForm(INITIAL_FORM)
    setError('')
    onClose?.()
  }

  const handleSubmit = async () => {
    const amount = parseInt(form.amount, 10)
    if (!amount || amount <= 0) {
      setError('Masukkan jumlah pengeluaran yang valid.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await pendapatanService.createExpense({
        category: form.category,
        amount,
        source: form.source.trim() || undefined,
        description: form.description.trim() || undefined,
      })
      setForm(INITIAL_FORM)
      onSaved?.()
      onClose?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Catat Pengeluaran"
      closeIcon="chevron_left"
      footer={
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary-container hover:bg-[#a6e2fc] active:bg-[#8dd8f9] text-on-primary-container font-sans font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] text-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Pengeluaran'}
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Kategori</span>
          <select
            value={form.category}
            onChange={updateField('category')}
            className="mt-2 w-full bg-transparent border border-[#cbdff7] focus:border-primary rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none shadow-sm"
          >
            {CATEGORY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Jumlah (Rp)"
          type="number"
          min="0"
          value={form.amount}
          onChange={updateField('amount')}
          placeholder="Masukkan jumlah"
        />

        <Input
          label="Sumber (opsional)"
          value={form.source}
          onChange={updateField('source')}
          placeholder="Contoh: Toko Kimia Jaya"
        />

        <div>
          <label className="mb-1 block text-label-sm text-on-surface-variant">Catatan (opsional)</label>
          <textarea
            value={form.description}
            onChange={updateField('description')}
            placeholder="Detail pengeluaran"
            rows={3}
            className="w-full rounded-t-md rounded-b-none border-0 border-b border-outline-variant bg-surface-container-low px-3 py-2.5 text-body-md text-on-surface outline-none focus:border-b-2 focus:border-b-primary resize-none"
          />
        </div>

        {error && <p className="text-body-sm text-error">{error}</p>}
      </div>
    </Drawer>
  )
}
