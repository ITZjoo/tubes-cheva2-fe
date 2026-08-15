import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import ChatList from '../components/ChatList'
import ChatDetailPanel from '../components/ChatDetailPanel'
import HistoryList from '../components/HistoryList'
import useCannedQuestionCenter from '../hooks/useCannedQuestionCenter'

const TABS = [
  { key: 'lookup', label: 'Cari Jawaban' },
  { key: 'history', label: 'Riwayat' },
]

// Halaman penuh "Pesan Cepat" — cari & catat jawaban FAQ, atau lihat riwayat
// pencarian sebelumnya. Dipanggil dari "Lihat semua" di widget Dashboard.
// Daftarkan route-nya sendiri di src/routes/AppRoutes.jsx, misal:
//   <Route path="/chat" element={<ChatView />} />
export default function ChatView() {
  const handleSidebarNavigate = useSidebarNavigate()
  const center = useCannedQuestionCenter()
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
    <PageShell
      activeItemId="pesanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <div className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-160px)] min-h-[500px]">
        <div role="tablist" aria-label="Pesan Cepat" className="flex items-center gap-1 border-b border-outline-variant px-6 pt-4 shrink-0">
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
              className="w-[280px] shrink-0 border-r border-outline-variant py-6 px-[18px]"
            />

            <ChatDetailPanel
              question={activeQuestion}
              askState={askState}
              lastAskedAt={lastAskedAt}
              onAsk={askActiveQuestion}
              className="flex-1 overflow-y-auto custom-scrollbar p-6"
            />
          </div>
        ) : (
          <HistoryList entries={history} loading={loadingHistory} error={historyError} className="flex-1 min-h-0 p-6" />
        )}
      </div>
    </PageShell>
  )
}
