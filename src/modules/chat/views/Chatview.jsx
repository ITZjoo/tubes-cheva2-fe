import { useEffect, useState } from 'react'
import PageShell from '../../../components/ui/PageShell'
import Typography from '../../../components/ui/Typography'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import ChatList from '../components/ChatList'
import ChatDetailPanel from '../components/ChatDetailPanel'
import { getConversations, replyToConversation } from '../services/chatService'

// Halaman penuh untuk "Lihat semua" chat — dipanggil dari widget "Pesan
// Terbaru" di Dashboard/Pesanan. Data diambil dari GET /chat/conversations.
export default function ChatView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const loadConversations = async () => {
    try {
      const data = await getConversations()
      setConversations(Array.isArray(data) ? data : [])
      setActiveId((prev) => prev ?? data[0]?.id ?? null)
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat percakapan')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null

  const handleSendReply = async (conversationId, replyText) => {
    try {
      await replyToConversation(conversationId, replyText)
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, replied: true, lastMessage: replyText } : c))
      )
    } catch (error) {
      setErrorMessage(error.message || 'Gagal mengirim balasan')
    }
  }

  return (
    <PageShell
      activeItemId="pesanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <div>
        <Typography variant="h2" className="text-on-surface">
          Chat
        </Typography>
        <Typography variant="body-lg" className="text-on-surface-variant">
          Balas pertanyaan pelanggan dengan cepat.
        </Typography>
      </div>

      {errorMessage && (
        <Typography variant="body-md" className="py-4 text-center text-error">
          {errorMessage}
        </Typography>
      )}

      <div className="flex bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-160px)] min-h-[500px]">
        <ChatList
          conversations={isLoading ? [] : conversations}
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
