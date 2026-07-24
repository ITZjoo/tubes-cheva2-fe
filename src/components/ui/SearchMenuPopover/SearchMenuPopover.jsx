import { useState } from 'react'
import Popover from '../Popover'
import Icon from '../Icon'
import { ORDER_STEPS } from '../Stepper'
import { STATUS_TONES } from '../StatusBadge'

export const SAMPLE_RECENT_SEARCHES = ['TRX-0230045698', 'TRX-0230045698', 'TRX-0230045698', 'TRX-0230045698']

export const SAMPLE_RECENT_ORDERS = [
  { id: 'TRX-0230045698', status: 'menunggu', weight: '7.1 Kg' },
  { id: 'TRX-0230015698', status: 'disetrika', weight: '7.1 Kg' },
  { id: 'TRX-0230025698', status: 'diantar', weight: '7.1 Kg' },
  { id: 'TRX-0230035698', status: 'selesai', weight: '7.1 Kg' },
]

export default function SearchMenuPopover({
  value,
  onChange,
  recentSearches = SAMPLE_RECENT_SEARCHES,
  recentOrders = SAMPLE_RECENT_ORDERS,
  onSelectRecentSearch,
  onSelectOrder,
  placeholder = 'Cari pesanan, pelanggan, transaksi',
  className = '',
}) {
  const [query, setQuery] = useState(value ?? '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : query

  const handleChange = (event) => {
    if (!isControlled) setQuery(event.target.value)
    onChange?.(event.target.value)
  }

  return (
    <Popover
      align="start"
      matchTriggerWidth
      className={['w-80', className].filter(Boolean).join(' ')}
      trigger={({ show }) => (
        <div className="relative w-full">
          <input
            type="text"
            value={currentValue}
            onChange={handleChange}
            onFocus={show}
            placeholder={placeholder}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 pl-4 pr-11 text-body-md text-on-surface shadow-sm placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
          <Icon
            name="search"
            size={20}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80"
          />
        </div>
      )}
    >
      {({ close }) => (
        <div className="w-full rounded-lg bg-surface-container-lowest p-4 shadow-lg">
          <span className="text-label-sm text-outline">Pencarian baru-baru ini</span>
          <ul className="mt-2 flex flex-col">
            {recentSearches.map((term, index) => (
              <li key={`${term}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectRecentSearch?.(term)
                    close()
                  }}
                  className="flex w-full items-center gap-3 rounded-lg py-2 text-left hover:bg-surface-container"
                >
                  <Icon name="history" size={20} className="text-outline" />
                  <span className="text-body-md text-on-surface-variant">{term}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="my-3 flex items-center gap-3">
            <span aria-hidden="true" className="h-px flex-1 bg-outline-variant" />
            <span className="text-label-sm text-outline">Pesanan Terbaru</span>
            <span aria-hidden="true" className="h-px flex-1 bg-outline-variant" />
          </div>

          <ul className="flex flex-col">
            {recentOrders.map((order) => {
              const step = ORDER_STEPS.find((s) => s.key === order.status)
              const tone = STATUS_TONES[order.status] ?? STATUS_TONES.menunggu

              return (
                <li key={order.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOrder?.(order)
                      close()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg py-1.5 text-left hover:bg-surface-container"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.bg}`}>
                      <Icon name={step?.icon ?? 'inventory_2'} size={18} className={tone.text} />
                    </span>
                    <span className="flex-1 truncate text-body-md text-on-surface-variant">{order.id}</span>
                    <span className="shrink-0 text-label-sm text-outline">{order.weight}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Popover>
  )
}
