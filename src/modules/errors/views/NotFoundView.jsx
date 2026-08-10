import PageShell from '../../../components/ui/PageShell'
import ErrorState, { NotFoundIllustration } from '../../../components/ui/ErrorState'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'

// Catch-all 404 route (see AppRoutes' `path="*"`). No sidebar item maps to
// a page that doesn't exist, so activeItemId is explicitly null rather than
// left undefined — that keeps Sidebar from defaulting to "Dashboard".
export default function NotFoundView() {
  const handleSidebarNavigate = useSidebarNavigate()

  return (
    <PageShell activeItemId={null} onItemClick={handleSidebarNavigate}>
      <div className="flex h-full flex-col p-6 md:p-8">
        <ErrorState
          illustration={<NotFoundIllustration />}
          title="Halaman Tidak Ditemukan"
          description="Halaman yang kamu cari tidak tersedia. Halaman mungkin salah atau halaman sudah dihapus."
        />
      </div>
    </PageShell>
  )
}
