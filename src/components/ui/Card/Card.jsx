export default function Card({ title, children }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
      {title && (
        <h3 className="font-heading mb-3 text-base font-semibold text-on-surface">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
