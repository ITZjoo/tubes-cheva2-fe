import Icon from '../../../components/ui/Icon'

function ChatListItem({ question, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full flex flex-col gap-1 text-left rounded-2xl px-[15px] py-[10px] transition-colors cursor-pointer',
        active ? 'bg-primary-container/30' : 'hover:bg-surface-container-low',
      ].join(' ')}
    >
      <span className="text-body-sm font-bold text-on-surface line-clamp-2">{question.question}</span>
      <span className="w-fit rounded-md bg-secondary-container/35 px-2 py-0.5 text-[11px] font-bold text-secondary">
        {question.category}
      </span>
    </button>
  )
}

/**
 * ChatList — left panel: search + browse the admin's canned FAQ questions.
 *
 * Props:
 * - questions: Array<{ id, category, question, answer }>
 * - activeQuestionId: string | number
 * - onSelectQuestion: (id) => void
 * - searchQuery: string
 * - onSearchChange: (value: string) => void
 * - loading?: boolean
 * - className?: string
 */
export default function ChatList({
  questions = [],
  activeQuestionId,
  onSelectQuestion,
  searchQuery = '',
  onSearchChange,
  loading = false,
  className = '',
}) {
  return (
    <div className={['flex flex-col gap-3', className].join(' ')}>
      <div className="relative shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Cari pertanyaan..."
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-3.5 pr-9 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all"
        />
        <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {loading ? (
          <p className="text-body-sm text-on-surface-variant/70 text-center py-6">Memuat pertanyaan...</p>
        ) : questions.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant/70 text-center py-6">Tidak ada pertanyaan ditemukan.</p>
        ) : (
          questions.map((q) => (
            <ChatListItem
              key={q.id}
              question={q}
              active={q.id === activeQuestionId}
              onClick={() => onSelectQuestion?.(q.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
