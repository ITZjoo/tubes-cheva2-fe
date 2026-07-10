export default function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-lg text-on-primary-container">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p className="font-heading text-xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  )
}
