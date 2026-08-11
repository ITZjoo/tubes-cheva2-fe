import { useState } from 'react'
import Typography from '../../../components/ui/Typography'
import Icon from '../../../components/ui/Icon'
import HistoryDetailCard from './HistoryDetailCard'

// Renders the "Status berubah: X → Y" (order status change) or
// "Status berubah: X" (single-value change, e.g. price/service edits) line.
// Only one of `to` or a bare `from` is required — pass just `from` for the
// single-value case (see image 4: "Menambahkan Selimut Sedang").
function ChangeLabel({ from, to }) {
  return (
    <Typography variant="label-sm" className="text-on-surface-variant">
      Status berubah:{' '}
      <span className="text-primary">{from}</span>
      {to && (
        <>
          {' '}
          <span className="text-on-surface-variant">→</span>{' '}
          <span className="text-primary">{to}</span>
        </>
      )}
    </Typography>
  )
}

export default function HistoryListItem({
  code,
  name,
  date,
  time,
  changeFrom,
  changeTo,
  detail,
  defaultExpanded = false,
  className = '',
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <div className="flex h-[84px] items-center rounded-lg px-[18px] py-2.5 hover:bg-surface-container-low">
        <div className="min-w-0 flex-1">
          <Typography variant="label-md" className="block truncate text-on-surface">
            {code}
          </Typography>
          <Typography variant="label-sm" className="text-outline">
            {name}
          </Typography>
        </div>

        <div className="flex w-[138px] shrink-0 items-center gap-2 p-2.5">
          <Icon name="schedule" size={20} className="text-on-surface-variant" />
          <div>
            <Typography variant="label-sm" className="block text-on-surface-variant">
              {date}
            </Typography>
            <Typography variant="label-sm" className="text-on-surface-variant">
              {time}
            </Typography>
          </div>
        </div>

        <div className="flex w-[300px] shrink-0 items-center p-2.5">
          <ChangeLabel from={changeFrom} to={changeTo} />
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex h-[42px] w-24 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[#89D0ED] bg-primary-container px-3 text-label-sm font-medium text-primary transition-colors hover:brightness-95"
        >
          {expanded ? 'Tutup' : 'Lihat Detail'}
        </button>
      </div>

      {expanded && detail && (
        <div className="px-[18px] pb-3">
          <HistoryDetailCard {...detail} />
        </div>
      )}
    </div>
  )
}