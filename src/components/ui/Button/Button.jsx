import Icon from '../Icon'

export const COLOR_STYLES = {
  primary: {
    solid:
      'bg-primary text-on-primary hover:brightness-90 active:bg-primary-container active:text-on-primary-container active:brightness-100',
    outline:
      'border border-primary bg-transparent text-primary hover:bg-primary hover:text-on-primary active:bg-primary-container active:text-on-primary-container active:border-primary-container',
  },
  secondary: {
    solid:
      'bg-secondary text-on-secondary hover:brightness-90 active:bg-secondary-container active:text-on-secondary-container active:brightness-100',
    outline:
      'border border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-on-secondary active:bg-secondary-container active:text-on-secondary-container active:border-secondary-container',
  },
  danger: {
    solid:
      'bg-error text-on-error hover:brightness-90 active:bg-error-container active:text-on-error-container active:brightness-100',
    outline:
      'border border-error bg-transparent text-error hover:bg-error hover:text-on-error active:bg-error-container active:text-on-error-container active:border-error-container',
  },
}

export const DISABLED_STYLES = {
  solid:
    'disabled:bg-surface-container-lowest disabled:text-on-surface-variant disabled:border disabled:border-outline-variant disabled:hover:brightness-100 disabled:active:bg-surface-container-lowest disabled:active:text-on-surface-variant',
  outline:
    'disabled:bg-surface-container-low disabled:text-outline disabled:border-outline-variant disabled:hover:bg-surface-container-low disabled:hover:text-outline disabled:active:bg-surface-container-low disabled:active:text-outline',
}

const SIZE_CLASSES = {
  sm: { root: 'h-8 gap-1.5 px-3', iconOnly: 'h-8 w-8' },
  md: { root: 'h-10 gap-2 px-4', iconOnly: 'h-10 w-10' },
  lg: { root: 'h-11 gap-2 px-5', iconOnly: 'h-11 w-11' },
  xl: { root: 'h-12 gap-2.5 px-6', iconOnly: 'h-12 w-12' },
}

export default function Button({
  children,
  variant = 'primary',
  appearance = 'solid',
  size = 'md',
  disabled = false,
  type = 'button',
  startIcon,
  iconOnly = false,
  onClick,
  className = '',
  ...rest
}) {
  const palette = COLOR_STYLES[variant] ?? COLOR_STYLES.primary
  const sizeConfig = SIZE_CLASSES[size] ?? SIZE_CLASSES.md

  const shapeClasses = iconOnly
    ? `${sizeConfig.iconOnly} shrink-0 justify-center rounded-full p-0`
    : `${sizeConfig.root} rounded-md`

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'text-button inline-flex items-center justify-center transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-100',
        shapeClasses,
        palette[appearance] ?? palette.solid,
        DISABLED_STYLES[appearance] ?? DISABLED_STYLES.solid,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {startIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">{startIcon}</span>
      )}
      {!iconOnly && children}
    </button>
  )
}