import React, { useState } from 'react'
import Icon from '../Icon'

// SVG Logo kustom dengan desain premium bertema Laundry/Washing
// Droplet biru-teal dengan detail t-shirt putih dan gelembung sabun di sekelilingnya
const LaundryLogo = ({ className = 'w-10 h-10' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    fill="none"
    className={`${className} transition-transform duration-300 hover:scale-105`}
  >
    {/* Droplet background dengan gradasi warna primer */}
    <path
      d="M20 4C20 4 33 16.5 33 24.8C33 31.5 27.2 37 20 37C12.8 37 7 31.5 7 24.8C7 16.5 20 4 20 4Z"
      fill="url(#dropletGrad)"
    />
    
    {/* Kerah/Lipatan baju di dalam tetesan air */}
    <path
      d="M14.5 20.5H25.5C26.88 20.5 28 21.62 28 23V31C28 31.83 27.33 32.5 26.5 32.5H13.5C12.67 32.5 12 31.83 12 31V23C12 21.62 13.12 20.5 14.5 20.5Z"
      fill="white"
    />
    
    {/* Garis kerah V-neck biru untuk detail baju */}
    <path
      d="M16.5 20.5L20 24L23.5 20.5"
      stroke="#0a6780"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Gelembung-gelembung sabun estetis */}
    <circle cx="31" cy="12" r="3.2" fill="#89d0ed" />
    <circle cx="11" cy="10" r="2.2" fill="#89d0ed" />
    <circle cx="33" cy="20" r="1.8" fill="#89d0ed" opacity="0.8" />
    <circle cx="9" cy="17" r="2.5" fill="#89d0ed" opacity="0.8" />
    <circle cx="30" cy="28" r="1.5" fill="#89d0ed" opacity="0.6" />

    <defs>
      <linearGradient id="dropletGrad" x1="20" y1="4" x2="20" y2="37" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0a6780" />
        <stop offset="1" stopColor="#004d62" />
      </linearGradient>
    </defs>
  </svg>
)

// Default avatar jika user tidak mengunggah foto
// Ilustrasi kustom berformat SVG yang merepresentasikan owner Utama Laundry (baju merah dengan celemek putih/kuning)
const DefaultAvatar = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-full h-full object-cover"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background lingkaran biru muda */}
    <circle cx="50" cy="50" r="50" fill="#b9eaff" />
    
    {/* Rambut hitam belakang */}
    <path d="M25 45 C25 25, 75 25, 75 45" fill="#171d1e" />
    
    {/* Wajah / Kulit */}
    <circle cx="50" cy="45" r="22" fill="#ffdea4" />
    
    {/* Rambut hitam depan / poni */}
    <path d="M28 36 C35 26, 65 26, 72 36 C65 30, 35 30, 28 36 Z" fill="#171d1e" />
    
    {/* Leher */}
    <rect x="44" y="60" width="12" height="12" fill="#ffdea4" />
    
    {/* Baju merah */}
    <path d="M15 88 C15 72, 25 66, 38 66 L62 66 C75 66, 85 72, 85 88 Z" fill="#904a42" />
    
    {/* Celemek / Apron kuning cerah */}
    <path d="M36 66 L64 66 L60 88 L40 88 Z" fill="#79590c" opacity="0.15" />
    <path d="M38 72 L62 72 L58 88 L42 88 Z" fill="#ffdea4" opacity="0.3" />
  </svg>
)

const DEFAULT_MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'pesanan', label: 'Pesanan', icon: 'assignment' },
  { id: 'layanan', label: 'Layanan', icon: 'dry_cleaning' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'notifikasi', label: 'Notifikasi', icon: 'notifications' },
  { id: 'pendapatan', label: 'Pendapatan', icon: 'leaderboard' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'settings' },
]

const DEFAULT_USER = {
  name: 'Utama Laundry',
  role: 'Owner',
  avatarUrl: null,
}

/**
 * Komponen Sidebar Utama untuk Aplikasi Laundry Management System.
 * Sesuai dengan spesifikasi token desain visual dan rancangan mockup.
 */
export default function Sidebar({
  activeItemId,
  defaultActiveItemId = 'dashboard',
  onItemClick,
  menuItems = DEFAULT_MENU_ITEMS,
  user = DEFAULT_USER,
  onLogout,
  className = '',
  ...rest
}) {
  // Mode Uncontrolled jika activeItemId tidak disediakan dari luar
  const [localActiveId, setLocalActiveId] = useState(defaultActiveItemId)
  const currentActiveId = activeItemId !== undefined ? activeItemId : localActiveId

  // State untuk melacak status buka/tutup menu Log Out (Dropdown Profile)
  const [isProfileOpen, setIsProfileOpen] = useState(true)

  const handleItemClick = (item) => {
    if (activeItemId === undefined) {
      setLocalActiveId(item.id)
    }
    if (onItemClick) {
      onItemClick(item)
    }
  }

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev)
  }

  return (
    <aside
      className={[
        'w-[280px] h-screen flex flex-col bg-surface-container-lowest border-r border-outline-variant font-body shrink-0 select-none shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {/* Bagian Header / Brand Logo */}
      <div className="flex items-center gap-3.5 px-6 py-6 border-b border-outline-variant/30">
        <LaundryLogo className="w-10 h-10 shrink-0" />
        <div className="flex flex-col min-w-0">
          <h1 className="font-sans text-h3 leading-none text-primary font-bold tracking-tight truncate">
            UtamaLaundry
          </h1>
          <span className="text-label-sm text-on-surface-variant font-medium mt-1 truncate">
            Management System
          </span>
        </div>
      </div>

      {/* Bagian Menu Navigasi */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = currentActiveId === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={[
                'w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-label-md transition-all duration-200 text-left outline-none cursor-pointer',
                isActive
                  ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/10'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Icon
                name={item.icon}
                filled={isActive}
                size={22}
                className={isActive ? 'text-on-primary' : 'text-on-surface-variant'}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bagian Bawah / User Profile & Log Out */}
      <div className="p-4 border-t border-outline-variant/60 flex flex-col gap-3">
        {/* Row Profil User */}
        <div
          onClick={toggleProfile}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container cursor-pointer transition-colors duration-200 group"
          role="button"
          aria-expanded={isProfileOpen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleProfile()
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar Lingkaran */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant/50 group-hover:border-primary/50 transition-colors duration-200 shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <DefaultAvatar />
              )}
            </div>
            {/* Nama & Role */}
            <div className="flex flex-col min-w-0">
              <span className="text-label-md font-bold text-on-surface truncate">
                {user.name}
              </span>
              <span className="text-label-sm text-on-surface-variant font-medium truncate">
                {user.role}
              </span>
            </div>
          </div>
          {/* Tombol Chevron Expand */}
          <Icon
            name="keyboard_arrow_down"
            size={20}
            className="text-on-surface-variant transition-transform duration-300 shrink-0"
            style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>

        {/* Panel Logout (Bisa diciutkan/dilipat secara mulus) */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isProfileOpen ? '80px' : '0px',
            opacity: isProfileOpen ? 1 : 0,
            transform: isProfileOpen ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 border border-error/20 bg-error-container/30 hover:bg-error-container/50 active:bg-error-container/70 text-error font-sans font-bold py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer outline-none shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Icon name="logout" size={20} className="text-error" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
