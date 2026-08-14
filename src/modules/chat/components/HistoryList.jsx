function formatDateTime(iso) {
  if (!iso) return '-'
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  return `${datePart}, ${timePart}`
}

/**
 * HistoryList — read-only audit log of past canned-question lookups
 * (GET /canned-questions/history). Each entry is already answered, so this
 * is a log feed, not an inbox — no per-row actions.
 *
 * Props:
 * - entries: Array<{ id, questionText, answerText, createdAt, cannedQuestion?, user?, customer?, order? }>
 * - loading?: boolean
 * - error?: string | null
 * - className?: string
 */
export default function HistoryList({ entries = [], loading = false, error = null, className = '' }) {
  return (
    <div className={['flex flex-col gap-3 overflow-y-auto custom-scrollbar', className].join(' ')}>
      {loading ? (
        <p className="text-body-sm text-on-surface-variant/70 text-center py-6">Memuat riwayat...</p>
      ) : error ? (
        <p className="text-body-sm text-error text-center py-6">{error}</p>
      ) : entries.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant/70 text-center py-6">Belum ada riwayat pencarian jawaban.</p>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="rounded-2xl border border-outline-variant/40 px-[15px] py-[12px] flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <span className="w-fit rounded-md bg-secondary-container/35 px-2 py-0.5 text-[11px] font-bold text-secondary shrink-0">
                {entry.cannedQuestion?.category ?? 'GENERAL'}
              </span>
              <span className="text-body-sm text-outline shrink-0">{formatDateTime(entry.createdAt)}</span>
            </div>
            <p className="text-body-sm font-bold text-on-surface">{entry.questionText}</p>
            <p className="text-body-sm text-on-surface-variant">{entry.answerText}</p>
            {(entry.customer || entry.order || entry.user) && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant/70">
                {entry.customer && <span>Pelanggan: {entry.customer.name}</span>}
                {entry.order && <span>· Pesanan: {entry.order.orderNumber}</span>}
                {entry.user && <span>· Dicatat oleh {entry.user.name}</span>}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
