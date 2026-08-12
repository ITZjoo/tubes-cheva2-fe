function ChatListItem({ conversation, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex flex-col gap-1 text-left rounded-2xl px-[15px] py-[10px] transition-colors cursor-pointer',
        active ? 'bg-primary-container/30' : 'hover:bg-surface-container-low',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-label-md font-bold text-on-surface truncate">{conversation.name}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-body-sm text-outline">{conversation.time}</span>
          {/* Dot merah = belum dibalas (bukan penanda read/unread).
              Parent yang bertanggung jawab set replied: true setelah kirim balasan. */}
          {!conversation.replied && (
            <span className="w-2 h-2 rounded-full bg-error shrink-0" aria-label="Belum dibalas" />
          )}
        </div>
      </div>
      <span className="text-body-sm text-on-surface-variant truncate">{conversation.lastMessage}</span>
    </button>
  )
}

/**
 * ChatList — sisi kiri: daftar percakapan pelanggan.
 *
 * Props:
 * - conversations: Array<{ id, name, time, lastMessage, replied }>
 * - activeConversationId: string | number
 * - onSelectConversation: (id) => void
 * - className?: string — dipakai buat beda sizing antara di dalam modal vs full page
 */
export default function ChatList({ conversations = [], activeConversationId, onSelectConversation, className = '' }) {
  return (
    <div className={['flex flex-col gap-2.5 overflow-y-auto custom-scrollbar', className].join(' ')}>
      {conversations.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant/70 text-center py-6">Belum ada percakapan.</p>
      ) : (
        conversations.map((conv) => (
          <ChatListItem
            key={conv.id}
            conversation={conv}
            active={conv.id === activeConversationId}
            onClick={() => onSelectConversation?.(conv.id)}
          />
        ))
      )}
    </div>
  )
}