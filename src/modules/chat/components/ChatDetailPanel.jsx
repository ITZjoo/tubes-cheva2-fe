import { useState, useEffect } from 'react'
import Icon from '../../../components/ui/Icon'
import QuickReplyChips from './QuickReplyChips'

/**
 * ChatDetailPanel — sisi kanan: detail pelanggan + pertanyaan + jawaban cepat.
 * Dipakai bareng-bareng oleh QuickChatModal (overlay) dan ChatView (halaman penuh),
 * jadi behavior single-select & kirim-jawaban cuma ditulis sekali.
 *
 * Props:
 * - conversation: { id, name, role, trxId, date, question, questionTime } | null
 * - quickReplies?: string[]
 * - onSendReply: (conversationId, replyText) => void
 * - onClose?: () => void — kalau diisi, tombol close (X) muncul (dipakai di modal)
 * - className?: string
 */
export default function ChatDetailPanel({ conversation, quickReplies, onSendReply, onClose, className = '' }) {
  const [selectedReply, setSelectedReply] = useState(null)

  // Reset pilihan tiap ganti percakapan biar nggak kekirim ke customer yang salah.
  useEffect(() => {
    setSelectedReply(null)
  }, [conversation?.id])

  if (!conversation) {
    return (
      <div className={['flex-1 flex items-center justify-center text-body-md text-on-surface-variant', className].join(' ')}>
        Pilih percakapan di sebelah kiri
      </div>
    )
  }

  const handleSend = () => {
    if (!selectedReply) return
    onSendReply?.(conversation.id, selectedReply)
    setSelectedReply(null)
  }

  return (
    <div className={['flex flex-col gap-[18px]', className].join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-medium leading-[2.2] font-body text-black">{conversation.name}</span>
          <span className="text-[12px] font-medium leading-[1.8] font-body text-secondary bg-secondary-container/30 rounded-lg px-2.5 py-1">
            {conversation.role ?? 'Pelanggan'}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-full bg-primary-container/30 shrink-0 cursor-pointer"
            style={{ width: 30, height: 30 }}
            aria-label="Tutup"
          >
            <Icon name="close" size={10} className="text-primary" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-body-sm text-outline">{conversation.trxId}</span>
        <span className="w-[5px] h-[5px] rounded-full bg-outline shrink-0" />
        <span className="text-body-sm text-outline">{conversation.date}</span>
        <span className="w-[5px] h-[5px] rounded-full bg-outline shrink-0" />
        <span className="text-body-sm text-outline">{conversation.questionTime}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-on-surface">Pertanyaan Pelanggan</span>
        <div className="rounded-2xl bg-primary-container/30 px-[15px] py-[10px] flex flex-col gap-1">
          <p className="text-body-md font-semibold text-on-surface">{conversation.question}</p>
          <span className="text-body-sm text-outline">{conversation.questionTime}</span>
        </div>
      </div>

      <QuickReplyChips
        options={quickReplies}
        selected={selectedReply}
        onSelect={setSelectedReply}
        onSend={handleSend}
        disabled={!selectedReply}
      />
    </div>
  )
}