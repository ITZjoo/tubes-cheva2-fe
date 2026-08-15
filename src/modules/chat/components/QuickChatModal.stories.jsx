import { useState } from 'react'
import QuickChatModal from './QuickChatModal'

const MOCK_QUESTIONS = [
  { id: 1, category: 'PESANAN', question: 'Kapan pesanan saya selesai?', answer: 'Estimasi selesai 1x24 jam sejak pesanan diterima.' },
  { id: 2, category: 'PESANAN', question: 'Apakah sudah bisa diambil?', answer: 'Pesanan bisa diambil setelah status "Siap Diambil".' },
  { id: 3, category: 'PEMBAYARAN', question: 'Berapa total pesanan saya?', answer: 'Silakan cek nomor pesanan Anda di halaman riwayat transaksi.' },
]

const MOCK_HISTORY = [
  {
    id: 1,
    questionText: 'Kapan pesanan saya selesai?',
    answerText: 'Estimasi selesai 1x24 jam sejak pesanan diterima.',
    createdAt: new Date().toISOString(),
    cannedQuestion: { category: 'PESANAN' },
    customer: { name: 'Rani Puspita' },
  },
]

// Bikin mock `center` (bentuknya sama kayak return value useCannedQuestionCenter())
// biar story ini nggak butuh backend beneran buat dijalanin di Storybook.
function useMockCenter() {
  const [tab, setTab] = useState('lookup')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuestionId, setActiveQuestionId] = useState(MOCK_QUESTIONS[0].id)
  const [askState, setAskState] = useState('idle')

  const filtered = MOCK_QUESTIONS.filter((q) =>
    searchQuery ? q.question.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return {
    tab,
    setTab,
    questions: filtered,
    loadingQuestions: false,
    searchQuery,
    setSearchQuery,
    activeQuestionId,
    selectQuestion: (id) => {
      setActiveQuestionId(id)
      setAskState('idle')
    },
    activeQuestion: MOCK_QUESTIONS.find((q) => q.id === activeQuestionId) ?? null,
    askState,
    lastAskedAt: new Date().toISOString(),
    askActiveQuestion: () => setAskState('saved'),
    history: MOCK_HISTORY,
    loadingHistory: false,
    historyError: null,
  }
}

export default {
  title: 'Modules/Chat/QuickChatModal',
  component: QuickChatModal,
}

function InteractiveTemplate() {
  const [open, setOpen] = useState(true)
  const center = useMockCenter()

  return (
    <div>
      {!open && (
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-primary text-on-primary rounded-lg">
          Buka Pesan Cepat
        </button>
      )}
      <QuickChatModal open={open} onClose={() => setOpen(false)} center={center} />
    </div>
  )
}

export const Default = {
  render: () => <InteractiveTemplate />,
}

// State kosong — pastiin fallback text "Tidak ada pertanyaan ditemukan" &
// "Pilih pertanyaan di sebelah kiri" beneran muncul, bukan blank/error.
export const EmptyState = {
  render: () => (
    <QuickChatModal
      open={true}
      onClose={() => {}}
      center={{
        tab: 'lookup',
        setTab: () => {},
        questions: [],
        loadingQuestions: false,
        searchQuery: '',
        setSearchQuery: () => {},
        activeQuestionId: null,
        selectQuestion: () => {},
        activeQuestion: null,
        askState: 'idle',
        lastAskedAt: null,
        askActiveQuestion: () => {},
        history: [],
        loadingHistory: false,
        historyError: null,
      }}
    />
  ),
}
