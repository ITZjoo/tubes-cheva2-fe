import { useState } from 'react'
import QuickChatModal from './QuickChatModal'

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Rani Puspita',
    role: 'Pelanggan',
    time: '10 menit lalu',
    lastMessage: 'Kapan pesanan saya selesai ?',
    replied: false,
    trxId: 'TRX/0023400501',
    date: '22 Juni 2026',
    question: 'Kapan pesanan saya selesai ?',
    questionTime: '10 menit lalu',
  },
  {
    id: 2,
    name: 'Alberto',
    role: 'Pelanggan',
    time: '15 menit lalu',
    lastMessage: 'Apakah sudah bisa diambil ?',
    replied: false,
    trxId: 'TRX/0023300502',
    date: '22 Juni 2026',
    question: 'Apakah sudah bisa diambil ?',
    questionTime: '15 menit lalu',
  },
  {
    id: 3,
    name: 'Azzam',
    role: 'Pelanggan',
    time: '31 menit lalu',
    lastMessage: 'Berapa total pesanan saya ?',
    replied: true,
    trxId: 'TRX/0023200503',
    date: '22 Juni 2026',
    question: 'Berapa total pesanan saya ?',
    questionTime: '31 menit lalu',
  },
]

export default {
  title: 'Modules/Chat/QuickChatModal',
  component: QuickChatModal,
}

// Wrapper interaktif — Storybook butuh state hidup buat nyobain klik list,
// pilih jawaban cepat, dan lihat dot merah toggle beneran.
function InteractiveTemplate() {
  const [open, setOpen] = useState(true)
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0].id)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null

  const handleSendReply = (conversationId, replyText) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, replied: true } : c))
    )
    console.log('Kirim balasan ke', conversationId, ':', replyText)
  }

  return (
    <div>
      {!open && (
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-primary text-on-primary rounded-lg">
          Buka Quick Chat
        </button>
      )}
      <QuickChatModal
        open={open}
        onClose={() => setOpen(false)}
        conversations={conversations}
        activeConversationId={activeId}
        onSelectConversation={setActiveId}
        activeConversation={activeConversation}
        onSendReply={handleSendReply}
      />
    </div>
  )
}

export const Default = {
  render: () => <InteractiveTemplate />,
}

// State kosong — pastiin fallback text "Belum ada percakapan" & "Pilih
// percakapan di sebelah kiri" beneran muncul, bukan blank/error.
export const EmptyState = {
  render: () => (
    <QuickChatModal
      open={true}
      onClose={() => {}}
      conversations={[]}
      activeConversationId={null}
      onSelectConversation={() => {}}
      activeConversation={null}
      onSendReply={() => {}}
    />
  ),
}