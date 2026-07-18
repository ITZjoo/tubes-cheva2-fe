import React from 'react'

export const LOADING_SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

export const LOADING_VARIANTS = {
  primary: 'border-primary border-t-transparent',
  secondary: 'border-secondary border-t-transparent',
  tertiary: 'border-tertiary border-t-transparent',
  white: 'border-white border-t-transparent',
}

export default function Loading({
  size = 'md',
  variant = 'primary',
  fullPage = false,
  text = '',
  className = '',
  ...rest
}) {
  const sizeClass = LOADING_SIZES[size] || LOADING_SIZES.md
  const variantClass = LOADING_VARIANTS[variant] || LOADING_VARIANTS.primary

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full ${sizeClass} ${variantClass} ${className}`}
        role="status"
        aria-label="loading"
        {...rest}
      />
      {text && (
        <span className="text-body-md text-on-surface-variant font-medium animate-pulse">
          {text}
        </span>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/30 backdrop-blur-sm">
        <div className="rounded-2xl bg-surface-container-low p-6 shadow-lg border border-outline-variant">
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}
