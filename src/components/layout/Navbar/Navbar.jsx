export default function Navbar({ userName, onLogout }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6">
      <span className="font-heading text-sm font-semibold text-on-surface">Admin Panel</span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-on-surface-variant">{userName}</span>
        <button
          type="button"
          onClick={onLogout}
          className="text-sm font-medium text-error hover:underline"
        >
          Keluar
        </button>
      </div>
    </header>
  )
}
