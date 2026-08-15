function timeAgo(iso) {
  if (!iso) return ''
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  return `${Math.floor(hours / 24)} hari lalu`
}

/**
 * PesanCepatCard — widget "Pesan Cepat" di Dashboard: preview lookup FAQ
 * terakhir yang dicatat (dari GET /canned-questions/history), plus tombol
 * buat buka QuickChatModal (cari & catat jawaban baru).
 *
 * Props:
 * - center: return value dari useCannedQuestionCenter()
 * - onLihatSemua: () => void
 */
export default function PesanCepatCard({ center, onLihatSemua }) {
  const { history, loadingHistory } = center
  const latest = history[0] ?? null

  return (
    <div className="w-full bg-surface-container-lowest rounded-[18px] p-6 shadow-[0px_1px_8px_0px_#0000001A] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-semibold leading-[1.4] font-body text-black">Pesan Cepat</h3>
        <button
          type="button"
          onClick={onLihatSemua}
          className="text-[14px] font-medium leading-[2] font-body text-primary cursor-pointer hover:underline"
        >
          Lihat semua
        </button>
      </div>

      {loadingHistory ? (
        <p className="text-body-sm text-on-surface-variant/70 text-center py-2">Memuat...</p>
      ) : latest ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-label-sm font-bold text-on-surface truncate">
                  {latest.customer?.name ?? 'Tanpa pelanggan'}
                </span>
                <span className="text-[12px] font-normal leading-[1.2] font-body text-secondary">
                  {latest.cannedQuestion?.category ?? 'GENERAL'}
                </span>
              </div>
              <p className="text-[12px] font-normal leading-[1.8] font-body text-on-surface mt-1 line-clamp-2">
                {latest.questionText}
              </p>
            </div>
            <span className="text-body-sm text-outline shrink-0">{timeAgo(latest.createdAt)}</span>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onLihatSemua}
              className="rounded-lg bg-primary-container/30 text-[12px] font-normal leading-[1.8] font-body text-primary cursor-pointer hover:bg-primary-container/45 transition-colors"
              style={{ width: 66, height: 28, padding: '3px 15px' }}
            >
              Buka
            </button>
          </div>
        </div>
      ) : (
        <p className="text-body-sm text-on-surface-variant/70 text-center py-2">Belum ada pencarian jawaban.</p>
      )}
    </div>
  )
}
