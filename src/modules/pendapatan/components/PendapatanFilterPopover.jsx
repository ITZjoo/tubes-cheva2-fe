import { useEffect, useState } from 'react'
import Popover from '../../../components/ui/Popover'
import Checkbox from '../../../components/ui/Checkbox'
import Icon from '../../../components/ui/Icon'
import DatePickerPopover from '../../../components/ui/DatePicker/DatePickerPopover'
import { PAYMENT_METHOD_LABEL } from '../../../constants/paymentMethod'
import { EXPENSE_CATEGORY_LABEL, SERVICE_TYPE_OPTIONS } from '../../../constants/expenseOptions'

const BUDGET_TYPE_LABEL = {
  PEMASUKAN: 'Pemasukan',
  PENGELUARAN: 'Pengeluaran',
}

const PAYMENT_METHODS = Object.keys(PAYMENT_METHOD_LABEL)
const EXPENSE_CATEGORIES = Object.keys(EXPENSE_CATEGORY_LABEL)

export const EMPTY_PENDAPATAN_FILTERS = {
  dateRange: { from: null, to: null },
  budgetTypes: ['PEMASUKAN', 'PENGELUARAN'],
  serviceTypes: [],
  paymentMethods: [],
  expenseCategories: [],
}

function countActiveFilters(filters) {
  let count = 0
  if (filters.dateRange?.from) count += 1
  if (filters.budgetTypes.length !== 2) count += 1
  count += filters.serviceTypes.length
  count += filters.paymentMethods.length
  count += filters.expenseCategories.length
  return count
}

function FilterSection({ title, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-md font-bold text-on-surface">{title}</span>
      <div className="flex flex-col divide-y divide-outline-variant">{children}</div>
    </div>
  )
}

function FilterCheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-body-md text-on-surface-variant">{label}</span>
      <Checkbox checked={checked} onChange={onChange} />
    </label>
  )
}

// Filter keuangan untuk halaman Pendapatan.
// - "Rentang Tanggal" pakai DatePickerPopover mode="range" (arahan dari komentar
//   di DatePicker.jsx sendiri, yang menyebut kebutuhan range ini datang dari
//   "Filter drawer's date section").
// - "Jenis Anggaran" menentukan apakah entri Pemasukan dan/atau Pengeluaran ikut
//   ditampilkan.
// - "Jenis Layanan" & "Metode Pembayaran" hanya relevan untuk Pemasukan, jadi
//   hanya muncul jika "Pemasukan" dicentang.
// - "Jenis Pengeluaran" hanya relevan untuk Pengeluaran, jadi hanya muncul jika
//   "Pengeluaran" dicentang.
export default function PendapatanFilterPopover({ value, onApply }) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const toggleBudgetType = (type) => {
    setDraft((prev) => ({
      ...prev,
      budgetTypes: prev.budgetTypes.includes(type)
        ? prev.budgetTypes.filter((t) => t !== type)
        : [...prev.budgetTypes, type],
    }))
  }

  const toggleInList = (key, item) => {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter((v) => v !== item) : [...prev[key], item],
    }))
  }

  const showPemasukanSections = draft.budgetTypes.includes('PEMASUKAN')
  const showPengeluaranSections = draft.budgetTypes.includes('PENGELUARAN')

  const activeCount = countActiveFilters(value)

  return (
    <Popover
      align="end"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-1.5 h-[46px] px-3 rounded-xl border border-outline-variant text-label-sm text-on-surface-variant cursor-pointer hover:bg-surface-container-low shrink-0"
        >
          <Icon name="filter_alt" size={18} />
          Filter
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary">
              {activeCount}
            </span>
          )}
        </button>
      )}
    >
      {({ close }) => (
        <div className="w-72 max-h-[70vh] overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-lg flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-label-md font-bold text-on-surface">Rentang Tanggal</span>
            <DatePickerPopover
              mode="range"
              value={draft.dateRange}
              onChange={(dateRange) => setDraft((prev) => ({ ...prev, dateRange }))}
              placeholder="Atur Tanggal"
              className="w-full"
            />
          </div>

          <FilterSection title="Jenis Anggaran">
            {Object.entries(BUDGET_TYPE_LABEL).map(([key, label]) => (
              <FilterCheckboxRow
                key={key}
                label={label}
                checked={draft.budgetTypes.includes(key)}
                onChange={() => toggleBudgetType(key)}
              />
            ))}
          </FilterSection>

          {showPemasukanSections && (
            <FilterSection title="Jenis Layanan">
              {SERVICE_TYPE_OPTIONS.map((service) => (
                <FilterCheckboxRow
                  key={service}
                  label={service}
                  checked={draft.serviceTypes.includes(service)}
                  onChange={() => toggleInList('serviceTypes', service)}
                />
              ))}
            </FilterSection>
          )}

          {showPemasukanSections && (
            <FilterSection title="Metode Pembayaran">
              {PAYMENT_METHODS.map((method) => (
                <FilterCheckboxRow
                  key={method}
                  label={PAYMENT_METHOD_LABEL[method]}
                  checked={draft.paymentMethods.includes(method)}
                  onChange={() => toggleInList('paymentMethods', method)}
                />
              ))}
            </FilterSection>
          )}

          {showPengeluaranSections && (
            <FilterSection title="Jenis Pengeluaran">
              {EXPENSE_CATEGORIES.map((category) => (
                <FilterCheckboxRow
                  key={category}
                  label={EXPENSE_CATEGORY_LABEL[category]}
                  checked={draft.expenseCategories.includes(category)}
                  onChange={() => toggleInList('expenseCategories', category)}
                />
              ))}
            </FilterSection>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setDraft(EMPTY_PENDAPATAN_FILTERS)}
              className="flex-1 py-2.5 rounded-xl border border-outline-variant text-label-sm font-bold text-on-surface-variant cursor-pointer hover:bg-surface-container-low"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft)
                close?.()
              }}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-label-sm font-bold cursor-pointer hover:brightness-95"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </Popover>
  )
}