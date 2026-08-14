import ChatList from './ChatList'
import ChatDetailPanel from './ChatDetailPanel'
import HistoryList from './HistoryList'

const TABS = [
  { key: 'lookup', label: 'Cari Jawaban' },
  { key: 'history', label: 'Riwayat' },
]

/**
 * QuickChatModal — overlay "Pesan Cepat": cari & catat jawaban FAQ (kiri:
 * daftar pertanyaan, kanan: jawaban), plus tab Riwayat buat lihat log
 * pencarian sebelumnya. Buka/tutup instan (tanpa animasi) sesuai spek Figma.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - center: return value dari useCannedQuestionCenter()
 */
export default function QuickChatModal({ open, onClose, center }) {
  if (!open) return null

  const {
    tab,
    setTab,
    questions,
    loadingQuestions,
    searchQuery,
    setSearchQuery,
    activeQuestionId,
    selectQuestion,
    activeQuestion,
    askState,
    lastAskedAt,
    askActiveQuestion,
    history,
    loadingHistory,
    historyError,
  } = center

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex w-full max-w-[685px] h-[541px] flex-col bg-surface-container-lowest rounded-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div role="tablist" aria-label="Pesan Cepat" className="flex items-center gap-1 border-b border-outline-variant px-[18px] pt-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={[
                'px-4 py-2.5 text-label-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer',
                tab === key ? 'text-primary border-primary' : 'text-on-surface-variant/60 border-transparent hover:text-on-surface',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'lookup' ? (
          <div className="flex flex-1 min-h-0">
            <ChatList
              questions={questions}
              activeQuestionId={activeQuestionId}
              onSelectQuestion={selectQuestion}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              loading={loadingQuestions}
              className="w-[258px] shrink-0 border-r border-outline py-4 px-[18px]"
            />

            <ChatDetailPanel
              question={activeQuestion}
              askState={askState}
              lastAskedAt={lastAskedAt}
              onAsk={askActiveQuestion}
              onClose={onClose}
              className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6"
            />
          </div>
        ) : (
          <HistoryList entries={history} loading={loadingHistory} error={historyError} className="flex-1 min-h-0 p-6" />
        )}
      </div>
    </div>
  )
}
