import Icon from '../Icon'

export default function QuantityInput({ value = 0, min = 0, max, onChange, className = '' }) {
  const canDecrement = value > min
  const canIncrement = max === undefined || value < max

  const decrement = () => {
    if (canDecrement) onChange?.(value - 1)
  }

  const increment = () => {
    if (canIncrement) onChange?.(value + 1)
  }

  return (
    <div
      className={[
        'mx-auto flex h-8 w-[92px] flex-row items-center justify-center gap-2.5 rounded-lg bg-primary-container/30 px-2.5 py-[5px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        onClick={increment}
        disabled={!canIncrement}
        aria-label="Tambah jumlah"
        className="flex items-center justify-center text-primary disabled:opacity-40"
      >
        <Icon name="add" size={16} />
      </button>
      <span className="text-label-sm tabular-nums text-on-surface">{value}</span>
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement}
        aria-label="Kurangi jumlah"
        className="flex items-center justify-center text-primary disabled:opacity-40"
      >
        <Icon name="remove" size={16} />
      </button>
    </div>
  )
}
