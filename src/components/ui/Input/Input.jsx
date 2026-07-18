import { useId, useState } from 'react'

function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function ClearIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  )
}

function ErrorIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  )
}

const VARIANT_FIELD_CLASSES = {
  filled: {
    base: 'rounded-md border-0 border-b bg-surface-container-low px-3 py-2.5',
    normal: 'border-outline-variant text-on-surface',
    focus: 'border-b-2 border-b-primary',
    error: 'border-b-2 border-b-error bg-error-container text-on-error-container',
    disabled: 'bg-surface-container text-on-surface-variant',
  },
  outlined: {
    base: 'rounded-md border bg-surface-container-lowest px-3 py-2.5',
    normal: 'border-outline-variant text-on-surface',
    focus: 'border-2 border-primary',
    error: 'border-2 border-error bg-error-container text-on-error-container',
    disabled: 'border-outline-variant bg-surface-container text-on-surface-variant',
  },
}

function getFieldState({ disabled, error, isFocused }) {
  if (disabled) return 'disabled'
  if (error) return 'error'
  if (isFocused) return 'focus'
  return 'normal'
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  helperText,
  variant = 'filled',
  floatingLabel = false,
  startIcon,
  showClear = false,
  onClear,
  disabled = false,
  id,
  className = '',
  ...rest
}) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const [isFocused, setIsFocused] = useState(false)

  const hasValue = value !== undefined && value !== null && String(value).length > 0
  const fieldState = getFieldState({ disabled, error, isFocused })
  const palette = VARIANT_FIELD_CLASSES[variant] ?? VARIANT_FIELD_CLASSES.filled

  const labelColor = error
    ? 'text-error'
    : isFocused
      ? 'text-primary'
      : 'text-on-surface-variant'

  const showTrailingClear = showClear && hasValue && !disabled && !error
  const trailingIcon = error ? (
    <ErrorIcon className="h-4 w-4 text-error" />
  ) : showTrailingClear ? (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex text-on-surface-variant transition-colors hover:text-on-surface"
      aria-label="Hapus isian"
    >
      <ClearIcon className="h-4 w-4" />
    </button>
  ) : null

  const fieldClasses = [
    palette.base,
    palette[fieldState],
    'w-full text-sm outline-none transition-colors duration-200',
    startIcon ? 'pl-10' : '',
    trailingIcon ? 'pr-10' : '',
    floatingLabel ? 'pt-5 pb-2' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const describedBy = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="block text-left">
      {!floatingLabel && label && (
        <label htmlFor={inputId} className={`mb-1 block text-xs font-medium ${labelColor}`}>
          {label}
        </label>
      )}

      <div className="relative">
        {floatingLabel && label && (
          <label
            htmlFor={inputId}
            className={`pointer-events-none absolute left-3 top-2 text-xs font-medium transition-colors ${labelColor}`}
          >
            {label}
          </label>
        )}

        {startIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 inline-flex -translate-y-1/2 text-on-surface-variant">
            {startIcon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={fieldClasses}
          {...rest}
        />

        {trailingIcon && (
          <span className="absolute right-3 top-1/2 inline-flex -translate-y-1/2">{trailingIcon}</span>
        )}
      </div>

      {(helperText || error) && (
        <p
          id={error ? errorId : helperId}
          className={`mt-1 text-xs ${error ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export { SearchIcon, ClearIcon, ErrorIcon }
