function PlusIcon({ className = 'h-4 w-4' }) {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

const STYLE_CLASSES = {
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

const DISABLED_CLASSES = {
  solid:
    'disabled:bg-surface-container-lowest disabled:text-on-surface-variant disabled:border disabled:border-outline-variant disabled:hover:brightness-100 disabled:active:bg-surface-container-lowest disabled:active:text-on-surface-variant',
  outline:
    'disabled:bg-surface-container-low disabled:text-outline disabled:border-outline-variant disabled:hover:bg-surface-container-low disabled:hover:text-outline disabled:active:bg-surface-container-low disabled:active:text-outline',
}

const SIZE_CLASSES = {
  sm: {
    root: 'h-8 gap-1.5 px-3 text-xs',
    iconOnly: 'h-8 w-8',
    icon: 'h-3.5 w-3.5',
  },
  md: {
    root: 'h-10 gap-2 px-4 text-sm',
    iconOnly: 'h-10 w-10',
    icon: 'h-4 w-4',
  },
  lg: {
    root: 'h-11 gap-2 px-5 text-sm',
    iconOnly: 'h-11 w-11',
    icon: 'h-4 w-4',
  },
  xl: {
    root: 'h-12 gap-2.5 px-6 text-base',
    iconOnly: 'h-12 w-12',
    icon: 'h-5 w-5',
  },
}

function resolveAppearance(variant, appearance) {
  if (variant === 'outline') {
    return { color: 'primary', style: 'outline' }
  }

  if (variant === 'outline-secondary') {
    return { color: 'secondary', style: 'outline' }
  }

  return { color: variant, style: appearance }
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
  const { color, style } = resolveAppearance(variant, appearance)
  const palette = STYLE_CLASSES[color] ?? STYLE_CLASSES.primary
  const sizeConfig = SIZE_CLASSES[size] ?? SIZE_CLASSES.md
  const iconSize = sizeConfig.icon
  const resolvedIcon = startIcon ?? (iconOnly ? <PlusIcon className={iconSize} /> : null)

  const shapeClasses = iconOnly
    ? `${sizeConfig.iconOnly} shrink-0 justify-center rounded-full p-0`
    : `${sizeConfig.root} rounded-md`

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'font-heading inline-flex items-center justify-center font-semibold transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-100',
        shapeClasses,
        palette[style],
        DISABLED_CLASSES[style],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {resolvedIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">{resolvedIcon}</span>
      )}
      {!iconOnly && children}
    </button>
  )
}
