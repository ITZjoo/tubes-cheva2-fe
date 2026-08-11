import PageShell from '../../../components/ui/PageShell'
import ErrorState, { ServerErrorIllustration } from '../../../components/ui/ErrorState'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'

// 500 route (see AppRoutes' `path="/500"`). No sidebar item maps to a page
// that's down, so activeItemId is explicitly null rather than left
// undefined — that keeps Sidebar from defaulting to "Dashboard".
export default function ServerErrorView() {
  const handleSidebarNavigate = useSidebarNavigate()

  return (
    <PageShell activeItemId={null} onItemClick={handleSidebarNavigate}>
      <div className="flex h-full flex-col p-6 md:p-8">
        <ErrorState
          illustration={<ServerErrorIllustration />}
          title="Sistem Lagi Bermasalah"
          description="Terjadi gangguan teknis. Silahkan hubungi teknisi terkait, dan coba muat ulang beberapa saat lagi"
        />
      </div>
    </PageShell>
  )
}
