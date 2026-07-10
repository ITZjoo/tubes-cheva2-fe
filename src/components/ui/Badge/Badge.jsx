const STATUS_CLASSES = {
  pending: 'bg-warning-container text-on-warning-container',
  diproses: 'bg-info-container text-on-info-container',
  selesai: 'bg-success-container text-on-success-container',
}

export default function Badge({ status, color, children }) {
  const className = color || STATUS_CLASSES[status] || 'bg-surface-container text-on-surface-variant'

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${className}`}>
      {children || status}
    </span>
  )
}
