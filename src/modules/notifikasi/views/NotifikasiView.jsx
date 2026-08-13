import { useMemo, useState } from 'react'
import Checkbox from '../../../components/ui/Checkbox'
import Icon from '../../../components/ui/Icon'
import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import NotificationItem from '../component/NotificationItem'
import NotifikasiEmptyState from '../component/NotifikasiEmptyState'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'ntf-1',
    date: '2026-06-22',
    dateLabel: '22 Juni 2026',
    title: 'Pesan Baru',
    description:
      'Rani Puspita: Selamat sore ka, izin tanya, kira kira baju saya kapan ya siapnya? saya butuh cepat banget. Soalnya ada kegiatan di kampus',
    time: '15:30',
    isRead: false,
  },
  {
    id: 'ntf-2',
    date: '2026-06-22',
    dateLabel: '22 Juni 2026',
    title: 'Pembayaran baru telah diterima',
    description: 'Rani Puspita telah melakukan pembayaran sebesar Rp. 74.600,00',
    time: '15:30',
    isRead: false,
  },
  {
    id: 'ntf-3',
    date: '2026-06-22',
    dateLabel: '22 Juni 2026',
    title: 'Pesanan sampai Laundry',
    description: 'Pesanan dengan ID - TRX/0023400302 telah sampai laundry dan menunggu untuk diproses',
    time: '15:30',
    isRead: true,
  },
  {
    id: 'ntf-4',
    date: '2026-06-22',
    dateLabel: '22 Juni 2026',
    title: 'Pesanan Baru telah diterima',
    description: 'Terdapat pesanan baru dengan ID - TRX/0023400302 yang menunggu pickup',
    time: '15:30',
    isRead: true,
  },
]

export default function NotifikasiView({ initialNotifications = INITIAL_NOTIFICATIONS }) {
  const handleSidebarNavigate = useSidebarNavigate()

  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const allIds = useMemo(() => notifications.map((n) => n.id), [notifications])
  const isAllSelected = allIds.length > 0 && selectedIds.size === allIds.length

  const groups = useMemo(() => {
    const map = new Map()
    for (const item of notifications) {
      if (!map.has(item.date)) map.set(item.date, { dateLabel: item.dateLabel, items: [] })
      map.get(item.date).items.push(item)
    }
    return Array.from(map.values())
  }, [notifications])

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? new Set(allIds) : new Set())
  }

  const toggleSelectOne = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleMarkAsRead = () => {
    if (selectedIds.size === 0) return
    setNotifications((prev) => prev.map((n) => (selectedIds.has(n.id) ? { ...n, isRead: true } : n)))
    setSelectedIds(new Set())
  }

  const handleDelete = () => {
    if (selectedIds.size === 0) return
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)))
    setSelectedIds(new Set())
  }

  const handleOpenNotification = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  return (
    <PageShell
      activeItemId="notifikasi"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
        <div>
          <h2 className="font-sans font-bold text-[32px] leading-[40px] tracking-[-0.01em] text-black">
            Notifikasi
          </h2>
          <p className="font-sans font-medium text-[20px] leading-[28px] tracking-normal text-on-surface-variant mt-1">
            Pantau semua aktivitas pesanan dan transaksi terbaru di sini.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} />
            <span className="font-body font-medium text-base leading-[2.4] tracking-normal text-[#171C1F]">
              Pilih Semua
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMarkAsRead}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="mark_email_read" size={22} className="text-primary" />
              <span className="font-body font-medium text-sm leading-[2] tracking-normal text-primary">
                Tandai Baca
              </span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={selectedIds.size === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-error-container px-5 py-3 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="delete" size={22} className="text-on-error-container" />
              <span className="font-body font-medium text-sm leading-[2] tracking-normal text-on-error-container">
                Hapus
              </span>
            </button>
          </div>
        </div>

        <div className="min-h-[708px] rounded-2xl bg-white p-6">
          {notifications.length === 0 ? (
            <NotifikasiEmptyState />
          ) : (
            <div className="flex flex-col gap-[18px]">
              {groups.map((group) => (
                <div key={group.dateLabel} className="flex flex-col gap-3">
                  <h3 className="font-sans font-bold text-[24px] leading-[32px] tracking-[-0.005em] text-[#171C1F]">
                    {group.dateLabel}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {group.items.map((item) => (
                      <NotificationItem
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        time={item.time}
                        isRead={item.isRead}
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={(checked) => toggleSelectOne(item.id, checked)}
                        onOpen={() => handleOpenNotification(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </PageShell>
  )
}