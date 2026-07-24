// The 8 order statuses from the laundry status-tracking spec.
// `border` matches `primary-fixed-dim` for the "dicuci" tone per the design
// spec; every other tone reuses its own solid color for both border and text.
export const STATUS_TONES = {
  menunggu: { label: 'Menunggu', bg: 'bg-outline-variant', border: 'border-outline', text: 'text-outline' },
  dicuci: { label: 'Dicuci', bg: 'bg-primary-container', border: 'border-primary-fixed-dim', text: 'text-primary' },
  dikeringkan: {
    label: 'Dikeringkan',
    bg: 'bg-secondary-container',
    border: 'border-secondary',
    text: 'text-secondary',
  },
  disetrika: { label: 'Disetrika', bg: 'bg-tertiary-container', border: 'border-tertiary', text: 'text-tertiary' },
  siap_diambil: { label: 'Siap Diambil', bg: 'bg-success-container', border: 'border-success', text: 'text-success' },
  diantar: { label: 'Diantar', bg: 'bg-accent-container', border: 'border-accent', text: 'text-accent' },
  selesai: { label: 'Selesai', bg: 'bg-secondary-fixed-dim', border: 'border-secondary', text: 'text-secondary' },
  dibatalkan: { label: 'Dibatalkan', bg: 'bg-error-container', border: 'border-error', text: 'text-error' },
}

export default function StatusBadge({ status, label, className = '' }) {
  const tone = STATUS_TONES[status] ?? STATUS_TONES.menunggu

  return (
    <span
      className={[
        'inline-flex items-center whitespace-nowrap rounded-lg border px-2.5 py-0.5 text-label-sm',
        tone.bg,
        tone.border,
        tone.text,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label ?? tone.label}
    </span>
  )
}
