import { useState } from 'react'
import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import ChatList from '../components/ChatList'
import ChatDetailPanel from '../components/ChatDetailPanel'

// TODO: ganti dengan chatService begitu backend punya endpoint/model Message.
// Untuk sekarang data contoh, sama polanya kayak chatMessages lokal di
// DashboardView.jsx / OrderListView.jsx yang sudah ada.
const INITIAL_CONVERSATIONS = [
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
    replied: true,
    trxId: 'TRX/0023300502',
    date: '22 Juni 2026',
    question: 'Apakah sudah bisa diambil ?',
    questionTime: '15 menit lalu',
  },
]

// Halaman penuh untuk "Lihat semua" chat — dipanggil dari widget "Pesan
// Terbaru" di Dashboard/Pesanan. Daftarkan route-nya sendiri di
// src/routes/AppRoutes.jsx, misal:
//   <Route path="/chat" element={<ChatView />} />
export default function ChatView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0]?.id ?? null)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null

  const handleSendReply = (conversationId, replyText) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, replied: true } : c))
    )
    // TODO: kirim ke backend begitu endpoint chat tersedia.
    console.log('Kirim balasan ke', conversationId, ':', replyText)
  }

  return (
    <PageShell
      activeItemId="pesanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <div className="flex bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-160px)] min-h-[500px]">
        <ChatList
          conversations={conversations}
          activeConversationId={activeId}
          onSelectConversation={setActiveId}
          className="w-[280px] shrink-0 border-r border-outline-variant py-6 px-[18px]"
        />

        <ChatDetailPanel
          conversation={activeConversation}
          onSendReply={handleSendReply}
          className="flex-1 overflow-y-auto custom-scrollbar p-6"
        />
      </div>
    </PageShell>
  )
}