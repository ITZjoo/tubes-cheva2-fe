import { useNavigate } from 'react-router-dom'
import PageShell from '../../../components/ui/PageShell'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'

// Shared stand-in for the 4 settings sub-pages (account/laundry/notification/
// payment) until each is designed and built. Swap the matching <Route>
// element in AppRoutes.jsx for the real view once it exists — SettingsView
// and SettingsRow don't need to change.
export default function SettingsPlaceholderView({ title }) {
  const handleSidebarNavigate = useSidebarNavigate()
  const navigate = useNavigate()

  return (
    <PageShell activeItemId="pengaturan" onItemClick={handleSidebarNavigate}>
      <div className="flex h-full flex-col p-6 md:p-8">
        <ErrorState
          title={title}
          description="Halaman ini sedang dalam pengembangan."
          action={
            <Button variant="primary" appearance="outline" onClick={() => navigate('/pengaturan')}>
              Kembali ke Pengaturan
            </Button>
          }
        />
      </div>
    </PageShell>
  )
}
