import { useState } from 'react'
import Drawer from '../../../components/ui/Drawer'
import Icon from '../../../components/ui/Icon'
import DatePickerPopover from '../../../components/ui/DatePicker/DatePickerPopover'
import * as pendapatanService from '../services/pendapatanService'
import { toDateStr } from '../utils/revenuePeriods'
import { EXPENSE_CATEGORY_OPTIONS, FUNDING_SOURCE_OPTIONS } from '../../../constants/expenseOptions'

const INITIAL_FORM = {
  date: new Date(),
  category: '',
  fundingSource: '',
  amount: '',
  description: '',
  receipt: null,
}

// Shared Figma-spec styling for every field in this drawer (select, input,
// textarea): background: #B9EAFF4D; border: 1px solid
// var(--Schemes-Inverse-Primary, #89D0ED).
const FIELD_CLASS =
  'mt-2 w-full bg-[#B9EAFF4D] border border-[var(--color-inverse-primary)] focus:border-primary rounded-xl px-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none shadow-sm'

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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setForm((prev) => ({ ...prev, receipt: file }))
  }

  const handleSubmit = async () => {
    if (!form.category) {
      setError('Pilih jenis pengeluaran terlebih dahulu.')
      return
    }
    if (!form.fundingSource) {
      setError('Pilih sumber dana terlebih dahulu.')
      return
    }
    const amount = parseInt(form.amount, 10)
    if (!amount || amount <= 0) {
      setError('Masukkan nominal pengeluaran yang valid.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await pendapatanService.createExpense({
        date: toDateStr(form.date),
        category: form.category,
        fundingSource: form.fundingSource,
        amount,
        description: form.description.trim() || undefined,
        receipt: form.receipt || undefined,
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
        <div className="flex justify-end">
          {/* Simpan button — exact Figma spec:
              box: 72x38, radius 8px, padding 8px 15px, bg var(--Schemes-Primary-Container, #B9EAFF)
              label: Urbanist 500 12px/180%, color var(--Schemes-Primary, #0A6780) */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: 72, height: 38 }}
            className="flex items-center justify-center rounded-lg bg-primary-container px-[15px] py-2 text-label-sm font-medium text-primary transition-all duration-200 cursor-pointer hover:brightness-95 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? '...' : 'Simpan'}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Tanggal</span>
          <div className="mt-2">
            <DatePickerPopover
              mode="single"
              value={form.date}
              onChange={(date) => setForm((prev) => ({ ...prev, date }))}
              placeholder="Pilih tanggal"
            />
          </div>
        </div>

        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Pilih Jenis Pengeluaran</span>
          <select
            value={form.category}
            onChange={updateField('category')}
            className={FIELD_CLASS}
          >
            <option value="" disabled>
              Pilih Jenis Pengeluaran
            </option>
            {EXPENSE_CATEGORY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Pilih Sumber Dana</span>
          <select
            value={form.fundingSource}
            onChange={updateField('fundingSource')}
            className={FIELD_CLASS}
          >
            <option value="" disabled>
              Pilih Sumber Dana
            </option>
            {FUNDING_SOURCE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Nominal</span>
          <input
            type="number"
            min="0"
            value={form.amount}
            onChange={updateField('amount')}
            placeholder="Masukkan Nominal (Rp)"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Keterangan</span>
          <textarea
            value={form.description}
            onChange={updateField('description')}
            placeholder="Masukkan keterangan mengenai pengeluaran ini"
            rows={3}
            className={`${FIELD_CLASS} resize-none`}
          />
        </div>

        <div>
          <span className="text-body-md font-sans font-bold text-on-surface">Nota/Struk Belanja</span>
          <label className="mt-2 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--color-inverse-primary)] bg-[#B9EAFF4D] px-4 py-8 cursor-pointer text-center hover:bg-[#B9EAFF66] transition-colors">
            <span className="text-body-sm text-on-surface-variant/70 font-medium">
              {form.receipt ? form.receipt.name : 'Upload Foto'}
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {error && <p className="text-body-sm text-error">{error}</p>}
      </div>
    </Drawer>
  )
}