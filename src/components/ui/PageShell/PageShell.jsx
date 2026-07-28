import { useNavigate } from 'react-router-dom'
import Sidebar from '../Sidebar'
import { useAuth } from '../../../context/AuthContext'

// Shared page frame used by every Sidebar-driven route: pins the sidebar to
// the viewport height and scopes document scroll to `<main>` so the sidebar
// never scrolls out of view. Extracted once so all pages share the same
// fixed-sidebar/scrollable-content behavior instead of re-declaring it.
export default function PageShell({ activeItemId, onItemClick, mainClassName = '', children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar
        activeItemId={activeItemId}
        onItemClick={onItemClick}
        onLogout={handleLogout}
        user={user ? { name: user.name, role: user.role === 'ADMIN' ? 'Owner' : 'Staff', avatarUrl: null } : undefined}
      />
      <main className={['flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar', mainClassName].filter(Boolean).join(' ')}>
        {children}
      </main>
    </div>
  )
}
