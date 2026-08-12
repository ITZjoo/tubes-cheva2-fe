import Icon from '../Icon'

// Vertical up/value/down numeric stepper — the hour or minute column inside
// TimeSettingPopover. Same controlled (value/min/max/onChange) shape as
// QuantityInput, just laid out vertically with bigger digits since this
// reads as a clock face rather than an order-line quantity.
export default function TimeStepper({ value, min = 0, max, onChange, pad = 2, label, className = '' }) {
  const canDecrement = value > min
  const canIncrement = max === undefined || value < max
  const decrement = () => {
    if (canDecrement) onChange?.(value - 1)
  }
  const increment = () => {
    if (canIncrement) onChange?.(value + 1)
  }

  return (
    <div className={['flex flex-col items-center gap-1.5', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={increment}
        disabled={!canIncrement}
        aria-label={label ? `Tambah ${label}` : 'Tambah'}
        className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary-container text-primary-fixed-dim transition-colors hover:brightness-95 disabled:opacity-40"
      >
        <Icon name="keyboard_arrow_up" size={16} />
      </button>
      <span className="text-h2 tabular-nums text-primary">{String(value).padStart(pad, '0')}</span>
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement}
        aria-label={label ? `Kurangi ${label}` : 'Kurangi'}
        className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary-container text-primary-fixed-dim transition-colors hover:brightness-95 disabled:opacity-40"
      >
        <Icon name="keyboard_arrow_down" size={16} />
      </button>
    </div>
  )
}
