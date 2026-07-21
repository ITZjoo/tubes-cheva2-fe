import { forwardRef, useId, useState } from 'react'
import Icon from '../Icon'

const FILLED_BASE = 'rounded-t-md rounded-b-none border-0 border-b px-3 py-2.5'
const FILLED_STATE = {
  normal: 'border-outline-variant bg-surface-container-low text-on-surface',
  focus: 'border-b-2 border-b-primary bg-surface-container-low text-on-surface',
  error: 'border-b-2 border-b-error bg-error-container text-on-error-container',
  disabled: 'bg-surface-container text-on-surface-variant',
}

const OUTLINED_BASE =
  'm-0 flex items-center gap-2 rounded-lg border border-solid px-3 pb-2.5 pt-0 transition-colors duration-200'
const OUTLINED_STATE = {
  normal: 'border-outline-variant bg-surface-container-lowest text-on-surface',
  focus: 'border-2 border-primary bg-surface-container-lowest text-on-surface',
  error: 'border-2 border-error bg-error-container text-on-error-container',
  disabled: 'border-outline-variant bg-surface-container text-on-surface-variant',
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
  const legendId = `${inputId}-legend`
  const [isFocused, setIsFocused] = useState(false)

  if (import.meta.env.DEV && defaultValue !== undefined) {
    console.warn(
      '[Input] `defaultValue` is not supported on this controlled component — use `value`/`onChange` instead.'
    )
  }

  const hasValue = value !== undefined && value !== null && String(value).length > 0
  const fieldState = getFieldState({ disabled, error, isFocused })

  const labelColor = error ? 'text-error' : isFocused ? 'text-primary' : 'text-on-surface-variant'

  const showTrailingClear = showClear && hasValue && !disabled && !error
  const trailingIcon = error ? (
    <Icon name="error" size={20} filled className="shrink-0 text-error" />
  ) : showTrailingClear ? (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex shrink-0 text-on-surface-variant transition-colors hover:text-on-surface"
      aria-label="Hapus isian"
    >
      <Icon name="close" size={20} />
    </button>
  ) : null

  const describedBy = [helperText ? helperId : null, error ? errorId : null].filter(Boolean).join(' ')

  const inputEl = (
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
      aria-labelledby={variant === 'outlined' && label ? legendId : undefined}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="min-w-0 flex-1 bg-transparent text-body-md outline-none placeholder:text-on-surface-variant disabled:cursor-not-allowed"
      {...rest}
    />
  )

  return (
    <div className="block text-left">
      {variant === 'outlined' ? (
        <fieldset
          disabled={disabled}
          className={[OUTLINED_BASE, OUTLINED_STATE[fieldState], className].filter(Boolean).join(' ')}
        >
          {label && (
            <legend className="px-1">
              <span id={legendId} className={`text-label-sm ${labelColor}`}>
                {label}
              </span>
            </legend>
          )}
          {startIcon && <span className="shrink-0 text-on-surface-variant">{startIcon}</span>}
          {inputEl}
          {trailingIcon}
        </fieldset>
      ) : (
        <>
          {!compactLabel && label && (
            <label htmlFor={inputId} className={`mb-1 block text-label-sm ${labelColor}`}>
              {label}
            </label>
          )}

          <div
            className={[
              'relative flex items-center gap-2',
              FILLED_BASE,
              FILLED_STATE[fieldState],
              compactLabel ? 'pt-5 pb-2' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {compactLabel && label && (
              <label
                htmlFor={inputId}
                className={`pointer-events-none absolute left-3 top-2 text-label-sm transition-colors ${labelColor}`}
              >
                {label}
              </label>
            )}
            {startIcon && <span className="shrink-0 text-on-surface-variant">{startIcon}</span>}
            {inputEl}
            {trailingIcon}
          </div>
        </>
      )}

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