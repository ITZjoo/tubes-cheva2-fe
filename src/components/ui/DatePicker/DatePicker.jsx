import { useState } from 'react'
import Icon from '../Icon'

const WEEKDAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function isSameDay(a, b) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Builds a full 7-wide grid of weeks covering the given month, padded with
// the trailing days of the previous month and the leading days of the next
// month so every week row stays complete.
function buildMonthGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)

  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay())

  const gridEnd = new Date(lastOfMonth)
  gridEnd.setDate(gridEnd.getDate() + (6 - lastOfMonth.getDay()))

  const days = []
  const cursor = new Date(gridStart)
  while (cursor <= gridEnd) {
    days.push({ date: new Date(cursor), isCurrentMonth: cursor.getMonth() === month })
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

// `mode="range"` turns this into a two-endpoint range picker: `value` becomes
// `{ from, to }` and `onChange` receives the updated range object. The first
// click (re)starts a range at `from` with `to` cleared; the second click
// closes it at `to` (swapping the two if picked out of order) — this is the
// "arrange a custom range" interaction the Filter drawer's date section
// needs, on top of the single-date mode every other caller already uses.
export default function DatePicker({ mode = 'single', value = null, onChange, defaultMonth, className = '' }) {
  const isRange = mode === 'range'
  const rangeFrom = isRange ? (value?.from ?? null) : null
  const rangeTo = isRange ? (value?.to ?? null) : null

  const [viewDate, setViewDate] = useState(() =>
    startOfMonth(defaultMonth ?? (isRange ? rangeFrom : value) ?? new Date())
  )

  const days = buildMonthGrid(viewDate)
  const today = new Date()
  const monthLabel = viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  const goToPrevMonth = () => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const goToNextMonth = () => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

  const handleDayClick = (date) => {
    if (!isRange) {
      onChange?.(date)
      return
    }
    if (!rangeFrom || rangeTo) {
      onChange?.({ from: date, to: null })
      return
    }
    onChange?.(date < rangeFrom ? { from: date, to: rangeFrom } : { from: rangeFrom, to: date })
  }

  return (
    <div
      className={['w-[min(369px,calc(100vw-32px))] rounded-lg bg-surface-container-lowest p-6 shadow-lg', className]
      .filter(Boolean)
      .join(' ')}
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="text-subtitle capitalize text-primary">{monthLabel}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Bulan sebelumnya"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary-container"
          >
            <Icon name="chevron_left" size={20} className="text-primary-fixed-dim" />
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Bulan berikutnya"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary-container"
          >
            <Icon name="chevron_right" size={20} className="text-primary-fixed-dim" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-label-sm text-primary/65">
            {label}
          </span>
        ))}

        {days.map(({ date, isCurrentMonth }) => {
          const isFrom = isRange && isSameDay(date, rangeFrom)
          const isTo = isRange && isSameDay(date, rangeTo)
          const inRange = isRange && rangeFrom && rangeTo && date > rangeFrom && date < rangeTo
          const selected = isRange ? isFrom || isTo : isSameDay(date, value)
          const isToday = isSameDay(date, today)

          return (
            <div key={date.toISOString()} className="relative">
              {inRange && <span aria-hidden="true" className="absolute inset-y-1 inset-x-0 bg-primary-container/50" />}
              {isFrom && rangeTo && (
                <span aria-hidden="true" className="absolute inset-y-1 left-1/2 right-0 bg-primary-container/50" />
              )}
              {isTo && rangeFrom && (
                <span aria-hidden="true" className="absolute inset-y-1 left-0 right-1/2 bg-primary-container/50" />
              )}
              <button
                type="button"
                onClick={() => handleDayClick(date)}
                aria-current={isToday ? 'date' : undefined}
                aria-pressed={selected}
                className={[
                  'relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-label-md transition-colors',
                  selected
                    ? 'bg-primary text-on-primary'
                    : isCurrentMonth
                      ? 'text-primary hover:bg-primary-container/50'
                      : 'text-primary-fixed-dim hover:bg-primary-container/30',
                  isToday && !selected && 'ring-1 ring-primary',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
