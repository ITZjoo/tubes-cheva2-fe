const ORIENTATION_CLASSES = {
  horizontal: 'h-px w-full border-t',
  vertical: 'w-px self-stretch border-l',
}

// 16px inset, matching the design spec's list-divider margins.
const INSET_CLASSES = {
  horizontal: {
    none: '',
    start: 'ms-4',
    both: 'mx-4',
  },
  vertical: {
    none: '',
    start: 'mt-4',
    both: 'my-4',
  },
}

export default function Divider({ orientation = 'horizontal', inset = 'none', className = '', ...rest }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={[
        ORIENTATION_CLASSES[orientation] ?? ORIENTATION_CLASSES.horizontal,
        INSET_CLASSES[orientation]?.[inset] ?? '',
        'border-outline-variant',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  )
}
