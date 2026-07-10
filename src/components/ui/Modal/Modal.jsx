export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/50">
      <div className="w-full max-w-md rounded-lg bg-surface-container-lowest p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="font-heading text-lg font-semibold text-on-surface">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-on-surface-variant hover:text-on-surface"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
