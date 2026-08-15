import { useEffect, useState } from 'react'
import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import ChatList from '../components/ChatList'
import ChatDetailPanel from '../components/ChatDetailPanel'
import * as chatService from '../services/chatService'

// Halaman penuh untuk "Lihat semua" chat — dipanggil dari widget "Pesan
// Terbaru" di Dashboard/Pesanan. Daftarkan route-nya sendiri di
// src/routes/AppRoutes.jsx, misal:
//   <Route path="/chat" element={<ChatView />} />
export default function ChatView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await chatService.listConversations()
      setConversations(data)
      setActiveId((prev) => prev ?? data[0]?.id ?? null)
    } catch (err) {
      console.error('Gagal memuat percakapan', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null

  const handleSendReply = async (conversationId, replyText) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, replied: true } : c))
    )
    try {
      await chatService.replyToConversation(conversationId, replyText)
      await loadConversations()
    } catch (err) {
      console.error('Gagal mengirim balasan', err)
      // Roll back the optimistic "replied" flag if the request actually failed.
      await loadConversations()
    }
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