export default function EmptyState({ message = 'Tidak ada data', icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-on-surface-variant">
      {icon && <div className="mb-2 text-3xl">{icon}</div>}
      <p className="text-sm">{message}</p>
    </div>
  )
}
