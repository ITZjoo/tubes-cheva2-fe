import Popover from '../Popover'
import Icon from '../Icon'

export const SAMPLE_NOTIFICATIONS = [
  { id: 1, title: 'Pesan baru', time: '15:30', body: 'Selamat sore ka, izin tanya, kira kira baju saya kapan ya siapnya ? saya butuh cepat banget..' },
  { id: 2, title: 'Pesan baru', time: '15:30', body: 'Selamat sore ka, izin tanya, kira kira baju saya kapan ya siapnya ? saya butuh cepat banget..' },
  { id: 3, title: 'Pesan baru', time: '15:30', body: 'Selamat sore ka, izin tanya, kira kira baju saya kapan ya siapnya ? saya butuh cepat banget..' },
  { id: 4, title: 'Pesan baru', time: '15:30', body: 'Selamat sore ka, izin tanya, kira kira baju saya kapan ya siapnya ? saya butuh cepat banget..' },
]

export default function NotificationPopover({
  notifications = SAMPLE_NOTIFICATIONS,
  hasUnread = true,
  onSeeAll,
  onReply,
  className = '',
}) {
  return (
    <Popover
      align="end"
      className={className}
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label="Notifikasi"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-colors hover:bg-surface-container"
        >
          <Icon name="notifications" size={20} className="text-on-surface" />
          {hasUnread && (
            <span
              aria-hidden="true"
              className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-error"
            />
          )}
        </button>
      )}
    >
      {({ close }) => (
        <div className="w-[291px] rounded-lg bg-surface-container-lowest p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-subtitle text-on-surface">Notifikasi Terbaru</span>
            <button
              type="button"
              onClick={() => {
                onSeeAll?.()
                close()
              }}
              className="text-label-sm text-primary"
            >
              Lihat semua
            </button>
          </div>

          <ul className="flex max-h-[360px] flex-col divide-y divide-outline-variant overflow-y-auto custom-scrollbar">
            {notifications.map((item) => (
              <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-label-md font-bold text-on-surface">{item.title}</span>
                  <span className="shrink-0 text-label-sm text-outline">{item.time}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-body-md text-outline">{item.body}</p>
                <button
                  type="button"
                  onClick={() => onReply?.(item)}
                  className="mt-1 text-label-sm text-primary"
                >
                  Balas
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Popover>
  )
}
