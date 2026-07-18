import { useEffect, useRef } from 'react'

// Unchecked border color per interaction state. `error` stays red at every
// state (matches spec); `primary` only tints on press, staying neutral the
// rest of the time.
const UNCHECKED_BORDER_CLASSES = {
  primary:
    'border-on-surface-variant peer-hover:border-on-surface peer-focus-visible:border-on-surface peer-active:border-primary',
  error: 'border-error',
}

const FILLED_BG_CLASSES = {
  primary: 'bg-primary',
  error: 'bg-error',
}

// State-layer (hover/focus/press circle) colors from the Checkbox spec.
// These are one-off values used only here — not shared design tokens like
// --color-primary/--color-error — so they stay local to this component
// instead of living in index.css.
const STATE_LAYER_CLASSES = {
  checked: {
    primary: 'bg-[#6750A4]',
    error: 'bg-[#B3261E]',
  },
  unchecked: {
    primary: 'bg-[#1D1B20]',
    error: 'bg-[#B3261E]',
  },
}

export default function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  color = 'primary',
  disabled = false,
  className = '',
  ...rest
}) {
  const inputRef = useRef(null)
  const isFilled = checked || indeterminate

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  const stateLayerClass = STATE_LAYER_CLASSES[isFilled ? 'checked' : 'unchecked'][color]
  const boxClass = disabled
    ? isFilled
      ? 'bg-on-surface'
      : 'border-on-surface-variant'
    : isFilled
      ? FILLED_BG_CLASSES[color]
      : UNCHECKED_BORDER_CLASSES[color]

  return (
    <span
      className={['relative inline-flex h-10 w-10 shrink-0 items-center justify-center', disabled ? 'opacity-[0.38]' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={[
          'pointer-events-none absolute h-10 w-10 rounded-full opacity-0 transition-opacity',
          'peer-hover:opacity-[0.08] peer-focus-visible:opacity-[0.1] peer-active:opacity-[0.1]',
          stateLayerClass,
        ].join(' ')}
      />
      {isFilled ? (
        <span
          aria-hidden="true"
          className={`pointer-events-none relative flex h-[18px] w-[18px] items-center justify-center rounded-[2px] ${boxClass}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {indeterminate ? (
              <path d="M3 10V8H15V10H3Z" fill="white" />
            ) : (
              <path d="M7 13.4L3 9.4L4.4 8L7 10.6L13.6 4L15 5.4L7 13.4Z" fill="white" />
            )}
          </svg>
        </span>
      ) : (
        <span aria-hidden="true" className={`pointer-events-none relative h-4 w-4 rounded-[1px] border-2 ${boxClass}`} />
      )}
    </span>
  )
}
