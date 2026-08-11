import Checkbox from '../../../components/ui/Checkbox'
import Icon from '../../../components/ui/Icon'
import Typography from '../../../components/ui/Typography'

export default function NotificationItem({
  title,
  description,
  time,
  isRead = false,
  checked = false,
  onCheckedChange,
  onOpen,
  className = '',
}) {
  return (
    <div
      onClick={() => onOpen?.()}
      className={[
        'flex items-start gap-3 rounded-xl p-4 transition-colors duration-200',
        !isRead && 'cursor-pointer',
        isRead ? 'bg-white hover:bg-surface-container' : 'bg-primary-container/50 hover:bg-primary-container/60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* stopPropagation biar klik checkbox gak ikut kepencet sebagai "buka notifikasi" */}
      <div onClick={(e) => e.stopPropagation()} className="-mt-1 -ml-2 shrink-0">
        <Checkbox checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-body font-semibold text-sm leading-[1.2] tracking-normal text-on-surface">{title}</p>
        <Typography variant="body-sm" className="text-on-surface-variant truncate">
          {description}
        </Typography>
      </div>

      <div className="mt-1 flex shrink-0 items-center gap-1">
        <Icon name="schedule" size={16} className="text-outline" />
        <Typography variant="body-sm" as="span" className="text-outline">
          {time}
        </Typography>
      </div>
    </div>
  )
}