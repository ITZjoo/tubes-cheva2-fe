const VARIANT_CLASSES = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
  danger: 'bg-error text-on-error hover:opacity-90',
}

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`font-heading rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}`}
      {...rest}
    >
      {children}
    </button>
  )
}
