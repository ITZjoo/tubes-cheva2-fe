import { useState } from 'react'
import Drawer from '../Drawer'
import Icon from '../Icon'
import Checkbox from '../Checkbox'
import DatePicker from '../DatePicker'
import { ORDER_STEPS } from '../Stepper'
import { SERVICE_TYPE_OPTIONS } from '../FilterPopover'

export { SERVICE_TYPE_OPTIONS }

function formatDate(date) {
  return date?.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-body-md text-on-surface-variant">{label}</span>
      <Checkbox checked={checked} onChange={onChange} className="-mr-3" />
    </label>
  )
}

// "Rentang Tanggal" section: a single "Atur Tanggal" field showing the
// current selection, with a calendar button that reveals DatePicker in range
// mode so the user can pick a custom from/to range.
function DateRangeSection({ range, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const label = () => {
    if (!range.from) return 'Pilih tanggal'
    if (!range.to) return formatDate(range.from)
    return `${formatDate(range.from)} — ${formatDate(range.to)}`
  }

  return (
    <div>
      <span className="text-label-md font-bold text-on-surface">Rentang Tanggal</span>
      <div className="mt-1">
        <span className="text-label-sm text-on-surface-variant">Atur Tanggal</span>
        <button
          type="button"
          onClick={() => setPickerOpen((prev) => !prev)}
          aria-pressed={pickerOpen}
          className={[
            'mt-1 flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-body-md',
            pickerOpen ? 'border-primary' : 'border-outline-variant',
            range.from ? 'text-on-surface' : 'text-on-surface-variant',
          ].join(' ')}
        >
          <span>{label()}</span>
          <Icon name="calendar_month" size={20} className="text-on-surface-variant" />
        </button>
      </div>

      {pickerOpen && (
        <div className="mt-3">
          <DatePicker mode="range" value={range} onChange={onChange} className="w-full shadow-none" />
        </div>
      )}
    </div>
  )
}

// "Urutkan" section: mutually exclusive A-Z / Z-A sort toggle, matching the
// existing checkbox-per-option convention already used in OrderListView's
// hand-rolled filter (checking one clears the other).
function SortSection({ sortOrder, onChange }) {
  return (
    <div>
      <span className="text-label-md font-bold text-on-surface">Urutkan</span>
      <div className="mt-1 flex flex-col divide-y divide-outline-variant">
        <CheckboxRow
          label="A - Z"
          checked={sortOrder === 'asc'}
          onChange={() => onChange(sortOrder === 'asc' ? null : 'asc')}
        />
        <CheckboxRow
          label="Z - A"
          checked={sortOrder === 'desc'}
          onChange={() => onChange(sortOrder === 'desc' ? null : 'desc')}
        />
      </div>
    </div>
  )
}

const EMPTY_FILTERS = { dateRange: { from: null, to: null }, statuses: [], services: [], sortOrder: null }

export default function FilterDrawer({
  open,
  onClose,
  statusOptions = ORDER_STEPS,
  serviceOptions = SERVICE_TYPE_OPTIONS,
  onApply,
}) {
  const [dateRange, setDateRange] = useState(EMPTY_FILTERS.dateRange)
  const [selectedStatuses, setSelectedStatuses] = useState(EMPTY_FILTERS.statuses)
  const [selectedServices, setSelectedServices] = useState(EMPTY_FILTERS.services)
  const [sortOrder, setSortOrder] = useState(EMPTY_FILTERS.sortOrder)

  // Every field applies its filter immediately on change, matching
  // FilterPopover's existing "no Terapkan/Reset step" behavior. The footer's
  // "Terapkan Filter" still gives a visible confirm action that also closes
  // the drawer, and "Reset" clears everything back out.
  const emit = (overrides = {}) =>
    onApply?.({
      dateRange,
      statuses: selectedStatuses,
      services: selectedServices,
      sortOrder,
      ...overrides,
    })

  const toggleStatus = (key) => {
    const next = selectedStatuses.includes(key)
      ? selectedStatuses.filter((item) => item !== key)
      : [...selectedStatuses, key]
    setSelectedStatuses(next)
    emit({ statuses: next })
  }

  const toggleService = (label) => {
    const next = selectedServices.includes(label)
      ? selectedServices.filter((item) => item !== label)
      : [...selectedServices, label]
    setSelectedServices(next)
    emit({ services: next })
  }

  const handleReset = () => {
    setDateRange(EMPTY_FILTERS.dateRange)
    setSelectedStatuses(EMPTY_FILTERS.statuses)
    setSelectedServices(EMPTY_FILTERS.services)
    setSortOrder(EMPTY_FILTERS.sortOrder)
    onApply?.(EMPTY_FILTERS)
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filter"
      closeIcon="chevron_left"
      footer={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-outline-variant px-4 py-2.5 text-label-md text-outline"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              emit()
              onClose?.()
            }}
            className="flex-1 rounded-lg bg-primary py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary/90"
          >
            Terapkan Filter
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <DateRangeSection
          range={dateRange}
          onChange={(next) => {
            setDateRange(next)
            emit({ dateRange: next })
          }}
        />

        <div>
          <span className="text-label-md font-bold text-on-surface">Status</span>
          <div className="mt-1 flex flex-col divide-y divide-outline-variant">
            {statusOptions.map((step) => (
              <CheckboxRow
                key={step.key}
                label={step.label}
                checked={selectedStatuses.includes(step.key)}
                onChange={() => toggleStatus(step.key)}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="text-label-md font-bold text-on-surface">Jenis Layanan</span>
          <div className="mt-1 flex flex-col divide-y divide-outline-variant">
            {serviceOptions.map((service) => (
              <CheckboxRow
                key={service}
                label={service}
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />
            ))}
          </div>
        </div>

        <SortSection
          sortOrder={sortOrder}
          onChange={(next) => {
            setSortOrder(next)
            emit({ sortOrder: next })
          }}
        />
      </div>
    </Drawer>
  )
}
