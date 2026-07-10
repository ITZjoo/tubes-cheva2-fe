export default function Sidebar({ menuItems = [], activeRoute }) {
  return (
    <aside className="flex h-full w-56 flex-col gap-1 border-r border-outline-variant bg-surface-container-lowest p-4">
      <p className="font-heading mb-2 px-2 text-sm font-bold text-on-surface">Utama Laundry</p>
      {menuItems.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={`rounded-md px-3 py-2 text-sm ${
            activeRoute === item.path
              ? 'bg-primary-container font-medium text-on-primary-container'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          {item.label}
        </a>
      ))}
    </aside>
  )
}
