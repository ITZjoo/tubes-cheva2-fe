import ChatList from './ChatList'
import ChatDetailPanel from './ChatDetailPanel'

/**
 * QuickChatModal — overlay dua panel (list kiri + detail kanan) di atas backdrop gelap.
 * Buka/tutup instan (tanpa animasi) sesuai spek Figma.
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - conversations: Array<{ id, name, time, lastMessage, replied }>
 * - activeConversationId: string | number
 * - onSelectConversation: (id) => void
 * - activeConversation: { id, name, role, trxId, date, question, questionTime } | null
 * - quickReplies?: string[]
 * - onSendReply: (conversationId, replyText) => void
 */
export default function QuickChatModal({
  open,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  activeConversation,
  quickReplies,
  onSendReply,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex w-full max-w-[685px] h-[541px] bg-surface-container-lowest rounded-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          className="w-[258px] shrink-0 border-r border-outline py-6 px-[18px]"
        />

        <ChatDetailPanel
          conversation={activeConversation}
          quickReplies={quickReplies}
          onSendReply={onSendReply}
          onClose={onClose}
          className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6"
        />
      </div>
    </div>
  )
}