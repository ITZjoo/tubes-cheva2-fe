const VALID_SIZES = [20, 24, 40, 48]

export default function Icon({ name, size = 24, filled = false, className = '', 'aria-label': ariaLabel, ...rest }) {
  const opsz = VALID_SIZES.includes(size) ? size : 24
  const decorative = !ariaLabel

  return (
    <span
      className={['material-symbols-outlined', className].filter(Boolean).join(' ')}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${opsz}`,
      }}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={ariaLabel}
      {...rest}
    >
      {name}
    </span>
  )
}
