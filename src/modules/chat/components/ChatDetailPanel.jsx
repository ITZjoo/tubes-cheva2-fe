import Icon from '../../../components/ui/Icon'

/**
 * ChatDetailPanel — right panel: the selected canned question's fixed answer,
 * plus a "Catat Jawaban" action that logs the lookup (POST /canned-questions/ask).
 * Shared by QuickChatModal (overlay) and ChatView (full page).
 *
 * Props:
 * - question: { id, category, question, answer } | null
 * - askState?: 'idle' | 'saving' | 'saved' | 'error'
 * - lastAskedAt?: string | null — ISO timestamp of the last successful log
 * - onAsk: () => void
 * - onClose?: () => void — kalau diisi, tombol close (X) muncul (dipakai di modal)
 * - className?: string
 */
export default function ChatDetailPanel({ question, askState = 'idle', lastAskedAt, onAsk, onClose, className = '' }) {
  if (!question) {
    return (
      <div className={['flex-1 flex items-center justify-center text-body-md text-on-surface-variant', className].join(' ')}>
        Pilih pertanyaan di sebelah kiri
      </div>
    )
  }

  return (
    <div className={['flex flex-col gap-[18px]', className].join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] font-medium leading-[1.8] font-body text-secondary bg-secondary-container/30 rounded-lg px-2.5 py-1">
            {question.category}
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

      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-on-surface">Pertanyaan</span>
        <div className="rounded-2xl bg-primary-container/30 px-[15px] py-[10px]">
          <p className="text-body-md font-semibold text-on-surface">{question.question}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-on-surface">Jawaban</span>
        <div className="rounded-2xl bg-surface-container-low px-[15px] py-[10px]">
          <p className="text-body-md text-on-surface whitespace-pre-line">{question.answer}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {askState === 'saved' && lastAskedAt ? (
          <span className="flex items-center gap-1.5 text-body-sm font-semibold text-success">
            <Icon name="check_circle" size={16} />
            Tercatat{' '}
            {new Date(lastAskedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
        ) : askState === 'error' ? (
          <span className="flex items-center gap-1.5 text-body-sm font-semibold text-error">
            <Icon name="error" size={16} />
            Gagal mencatat, coba lagi
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onAsk}
          disabled={askState === 'saving'}
          className="shrink-0 rounded-lg text-body-sm font-semibold text-on-primary-container bg-primary-container/30 transition-colors cursor-pointer hover:bg-primary-container/50 disabled:cursor-not-allowed disabled:opacity-50 px-[25px] py-[10px]"
        >
          {askState === 'saving' ? 'Mencatat...' : 'Catat Jawaban'}
        </button>
      </div>
    </div>
  )
}
