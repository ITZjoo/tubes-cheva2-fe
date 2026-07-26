import { useNavigate } from 'react-router-dom'
import { SIDEBAR_ROUTES } from './sidebarRoutes'

// Turns a Sidebar onItemClick callback into a route change, keeping
// Sidebar itself free of any react-router dependency. Items without a
// mapped route in SIDEBAR_ROUTES are a no-op — the page for them doesn't
// exist yet.
export default function useSidebarNavigate() {
  const navigate = useNavigate()

  return (item) => {
    const path = SIDEBAR_ROUTES[item.id]
    if (path) navigate(path)
  }
}
