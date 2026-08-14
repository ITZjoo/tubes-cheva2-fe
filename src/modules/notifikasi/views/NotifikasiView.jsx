import { useEffect, useMemo, useState } from 'react'
import Checkbox from '../../../components/ui/Checkbox'
import Icon from '../../../components/ui/Icon'
import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import NotificationItem from '../component/NotificationItem'
import NotifikasiEmptyState from '../component/NotifikasiEmptyState'
import {
  getNotifications,
  markNotificationsAsRead,
  deleteNotifications,
} from '../services/notifikasiService'

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function mapNotification(n) {
  const created = new Date(n.createdAt)
  const day = String(created.getDate()).padStart(2, '0')
  const month = String(created.getMonth() + 1).padStart(2, '0')
  const hours = String(created.getHours()).padStart(2, '0')
  const minutes = String(created.getMinutes()).padStart(2, '0')

  return {
    id: n.id,
    date: `${created.getFullYear()}-${month}-${day}`,
    dateLabel: `${created.getDate()} ${MONTHS_ID[created.getMonth()]} ${created.getFullYear()}`,
    title: n.title,
    description: n.message,
    time: `${hours}:${minutes}`,
    isRead: n.isRead,
  }
}

export default function NotifikasiView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [notifications, setNotifications] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const loadNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(Array.isArray(data) ? data.map(mapNotification) : [])
    } catch (error) {
      setErrorMessage(error.message || 'Gagal memuat notifikasi')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

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

  const handleMarkAsRead = async () => {
    if (selectedIds.size === 0) return
    try {
      await markNotificationsAsRead([...selectedIds])
      setNotifications((prev) => prev.map((n) => (selectedIds.has(n.id) ? { ...n, isRead: true } : n)))
      setSelectedIds(new Set())
    } catch (error) {
      setErrorMessage(error.message || 'Gagal menandai dibaca')
    }
  }

  const handleDelete = async () => {
    if (selectedIds.size === 0) return
    try {
      await deleteNotifications([...selectedIds])
      setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)))
      setSelectedIds(new Set())
    } catch (error) {
      setErrorMessage(error.message || 'Gagal menghapus notifikasi')
    }
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
          {errorMessage ? (
            <p className="text-body-md text-error text-center py-16">{errorMessage}</p>
          ) : isLoading ? (
            <p className="text-body-md text-on-surface-variant text-center py-16">Memuat notifikasi...</p>
          ) : notifications.length === 0 ? (
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
