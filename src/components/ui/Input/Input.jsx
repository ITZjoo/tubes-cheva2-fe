import { forwardRef, useId, useState } from 'react'
import Icon from '../Icon'

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

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    helperText,
    variant = 'filled',
    compactLabel = false,
    startIcon,
    showClear = false,
    onClear,
    disabled = false,
    id,
    className = '',
    defaultValue,
    ...rest
  },
  ref
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const [isFocused, setIsFocused] = useState(false)

  if (import.meta.env.DEV && defaultValue !== undefined) {
    console.warn(
      '[Input] `defaultValue` is not supported on this controlled component — use `value`/`onChange` instead.'
    )
  }

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
    <Icon name="error" size={20} filled className="text-error" />
  ) : showTrailingClear ? (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex text-on-surface-variant transition-colors hover:text-on-surface"
      aria-label="Hapus isian"
    >
      <Icon name="close" size={20} />
    </button>
  ) : null

  const fieldClasses = [
    palette.base,
    palette[fieldState],
    'w-full text-body-md outline-none transition-colors duration-200',
    startIcon ? 'pl-10' : '',
    trailingIcon ? 'pr-10' : '',
    compactLabel ? 'pt-5 pb-2' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const describedBy = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="block text-left">
      {!compactLabel && label && (
        <label htmlFor={inputId} className={`mb-1 block text-label-sm ${labelColor}`}>
          {label}
        </label>
      )}

      <div className="relative">
        {compactLabel && label && (
          <label
            htmlFor={inputId}
            className={`pointer-events-none absolute left-3 top-2 text-label-sm transition-colors ${labelColor}`}
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
          ref={ref}
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
          className={`mt-1 text-body-sm ${error ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
})

export default Input