import { useState } from 'react'
import Popover from '../Popover'
import Icon from '../Icon'
import Checkbox from '../Checkbox'
import { ORDER_STEPS } from '../Stepper'

export const SERVICE_TYPE_OPTIONS = ['Cuci Kiloan', 'Selimut', 'Sprei', 'Bantal', 'Boneka', 'Bed Cover', 'Karpet']

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
      <span className="text-body-md text-on-surface-variant">{label}</span>
      <Checkbox checked={checked} onChange={onChange} className="-mr-3" />
    </label>
  )
}

export default function FilterPopover({
  statusOptions = ORDER_STEPS.map((step) => ({ key: step.key, label: step.label })),
  serviceOptions = SERVICE_TYPE_OPTIONS,
  onApply,
  className = '',
}) {
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedServices, setSelectedServices] = useState([])

  // Checkboxes apply their filter immediately on toggle — there's no
  // separate "Terapkan"/"Reset" step to confirm or discard a pending change.
  const toggleStatus = (key) => {
    const next = selectedStatuses.includes(key)
      ? selectedStatuses.filter((item) => item !== key)
      : [...selectedStatuses, key]
    setSelectedStatuses(next)
    onApply?.({ statuses: next, services: selectedServices })
  }

  const toggleService = (label) => {
    const next = selectedServices.includes(label)
      ? selectedServices.filter((item) => item !== label)
      : [...selectedServices, label]
    setSelectedServices(next)
    onApply?.({ statuses: selectedStatuses, services: next })
  }

  return (
    <Popover
      align="end"
      className={className}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-1.5 text-label-sm text-on-surface-variant"
        >
          <Icon name="filter_alt" size={18} className="text-on-surface-variant" />
          Filter
        </button>
      )}
    >
      {({ close }) => (
        <div className="flex max-h-[582px] w-[359px] flex-col rounded-lg bg-surface-container-lowest shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-outline-variant px-5 py-4">
            <button type="button" onClick={close} aria-label="Kembali" className="flex items-center">
              <Icon name="chevron_left" size={24} className="text-on-surface" />
            </button>
            <span className="text-button text-on-surface">Filter</span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
            <span className="text-label-md font-bold text-on-surface">Status</span>
            <div className="mt-1 flex flex-col divide-y divide-outline-variant">
              {statusOptions.map((status) => (
                <CheckboxRow
                  key={status.key}
                  label={status.label}
                  checked={selectedStatuses.includes(status.key)}
                  onChange={() => toggleStatus(status.key)}
                />
              ))}
            </div>

            <span className="mt-5 block text-label-md font-bold text-on-surface">Jenis Layanan</span>
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
        </div>
      )}
    </Popover>
  )
}
