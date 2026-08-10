import PageShell from '../../../components/ui/PageShell'
import ErrorState, { AccessDeniedIllustration } from '../../../components/ui/ErrorState'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'

// 403 route (see AppRoutes' `path="/403"`). No sidebar item maps to a page
// the user can't access, so activeItemId is explicitly null rather than
// left undefined — that keeps Sidebar from defaulting to "Dashboard".
export default function AccessDeniedView() {
  const handleSidebarNavigate = useSidebarNavigate()

  return (
    <PageShell activeItemId={null} onItemClick={handleSidebarNavigate}>
      <div className="flex h-full flex-col p-6 md:p-8">
        <ErrorState
          illustration={<AccessDeniedIllustration />}
          title="Akses Ditolak"
          description="Kamu tidak memiliki izin untuk membuka halaman ini. Hubungi administrator jika kamu merasa ini sebuah kesalahan."
        />
      </div>
    </PageShell>
  )
}
