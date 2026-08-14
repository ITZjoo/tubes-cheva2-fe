import { useEffect, useRef, useState } from 'react'
import Icon from '../../../components/ui/Icon'
import PageShell from '../../../components/ui/PageShell'
import TeleportPanel from '../../../components/ui/TeleportPanel'
import DatePicker from '../../../components/ui/DatePicker'
import RevenueChart from '../../../components/ui/Chart/RevenueChart'
import QuickChatModal from '../../chat/components/QuickChatModal'
import PesanCepatCard from '../../chat/components/PesanCepatCard'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as dashboardService from '../services/dashboardService'
import * as orderService from '../../orders/services/orderService'
import { BE_TO_FE } from '../../orders/utils/orderStatus'

const STATUS_LIST = [
  { key: 'menunggu', label: 'Menunggu', icon: 'hourglass_empty', colorClass: 'text-outline bg-surface-container' },
  { key: 'dicuci', label: 'Dicuci', icon: 'local_laundry_service', colorClass: 'text-info bg-info-container/30' },
  { key: 'dikeringkan', label: 'Dikeringkan', icon: 'air', colorClass: 'text-success bg-success-container/30' },
  { key: 'disetrika', label: 'Disetrika', icon: 'iron', colorClass: 'text-tertiary bg-tertiary-container/30' },
  { key: 'siap_diambil', label: 'Siap Diambil', icon: 'shopping_bag', colorClass: 'text-success bg-success-container/40' },
  { key: 'diantar', label: 'Diantar', icon: 'local_shipping', colorClass: 'text-warning bg-warning-container/30' },
  { key: 'selesai', label: 'Selesai', icon: 'check_circle', colorClass: 'text-secondary bg-secondary-container/35' },
  { key: 'dibatalkan', label: 'Dibatalkan', icon: 'cancel', colorClass: 'text-error bg-error-container/30' },
]

const STATUS_BADGE_CLASS = {
  menunggu: 'bg-surface-container text-on-surface-variant border-outline-variant/40',
  dicuci: 'bg-info-container/45 text-on-info-container border-info/10',
  dikeringkan: 'bg-success-container/30 text-on-success-container border-success/10',
  disetrika: 'bg-tertiary-container/40 text-on-tertiary-container border-tertiary/10',
  siap_diambil: 'bg-success-container/50 text-on-success-container border-success/20',
  diantar: 'bg-warning-container/40 text-on-warning-container border-warning/10',
  selesai: 'bg-secondary-container/40 text-on-secondary-container border-secondary/10',
  dibatalkan: 'bg-error-container/40 text-on-error-container border-error/10',
}

// TODO: ganti dengan chatService begitu backend punya endpoint/model Message.
// Bentuk data ini yang dipakai bareng oleh QuickChatModal (lihat
// src/modules/chat/components).
const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    name: 'Rani Puspita',
    role: 'Pelanggan',
    time: '10 menit lalu',
    lastMessage: 'Kapan pesanan saya selesai ?',
    replied: false,
    trxId: 'TRX/0023400501',
    date: '22 Juni 2026',
    question: 'Kapan pesanan saya selesai ?',
    questionTime: '10 menit lalu',
  },
  {
    id: 2,
    name: 'Alberto',
    role: 'Pelanggan',
    time: '15 menit lalu',
    lastMessage: 'Apakah sudah bisa diambil ?',
    replied: false,
    trxId: 'TRX/0023300502',
    date: '22 Juni 2026',
    question: 'Apakah sudah bisa diambil ?',
    questionTime: '15 menit lalu',
  },
]

function formatRupiah(amount) {
  return `Rp. ${(amount ?? 0).toLocaleString('id-ID')}`
}

// Format Date -> 'YYYY-MM-DD' pakai komponen tanggal LOKAL (bukan UTC).
// Backend revenue-chart mengembalikan entry.date dalam tanggal lokal, jadi
// kalau kita bandingkan pakai now.toISOString() (yang UTC), antara jam
// 00.00–06.59 WIB "hari ini" versi UTC masih menunjuk ke tanggal kemarin —
// akibatnya todayEntry gagal ketemu dan pemasukan hari ini muncul sebagai 0.
function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Backend revenue-chart only returns one month's worth of {date, revenue}
// (no expense tracking exists at all, and no hourly granularity) — build the
// closest approximation of the today/week/month tabs RevenueChart expects.
function buildChartData(dailyRevenue, todayRevenue) {
  const today = [
    { label: '00.00', income: 0, expense: 0 },
    { label: 'Sekarang', income: todayRevenue, expense: 0 },
  ]

  const last7 = dailyRevenue.slice(-7)
  const week = last7.map((entry) => ({
    label: new Date(entry.date).toLocaleDateString('id-ID', { weekday: 'short' }),
    income: entry.revenue,
    expense: 0,
  }))

  const weekBuckets = [0, 0, 0, 0]
  dailyRevenue.forEach((entry, idx) => {
    const bucket = Math.min(3, Math.floor(idx / 7))
    weekBuckets[bucket] += entry.revenue
  })
  const month = weekBuckets.map((sum, idx) => ({ label: `Week ${idx + 1}`, income: sum, expense: 0 }))

  return { today, week, month }
}

export default function DashboardView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [isShopOpen, setIsShopOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const dateButtonRef = useRef(null)

  const [stats, setStats] = useState(null)
  const [statusCounts, setStatusCounts] = useState({})
  const [recentOrders, setRecentOrders] = useState([])
  const [chartData, setChartData] = useState({ today: [], week: [], month: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const now = new Date()
        const [statsRes, recentRes, chartRes, ordersRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentOrders(5),
          dashboardService.getRevenueChart({ year: now.getFullYear(), month: now.getMonth() + 1 }),
          orderService.listOrders({ limit: 200 }),
        ])
        if (cancelled) return

        // dashboardService.getRecentOrders / getRevenueChart bisa jadi
        // mengembalikan response yang dibungkus (mis. { data: [...] })
        // alih-alih array langsung — sama seperti listOrders. Unwrap dulu
        // biar .find()/.map() di bawah nggak meledak.
        const recentOrdersArr = Array.isArray(recentRes) ? recentRes : (recentRes?.data ?? [])
        const chartResArr = Array.isArray(chartRes) ? chartRes : (chartRes?.data ?? [])

        setStats(statsRes)
        setRecentOrders(recentOrdersArr)

        const todayStr = toLocalDateString(now)
        const todayEntry = chartResArr.find((entry) => entry.date === todayStr)
        setChartData(buildChartData(chartResArr, todayEntry?.revenue ?? 0))

        const ordersArr = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data ?? [])
        const counts = {}
        ordersArr.forEach((order) => {
        const feStatus = BE_TO_FE[order.status]
        counts[feStatus] = (counts[feStatus] ?? 0) + 1
        })
setStatusCounts(counts)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  // QuickChat: daftar percakapan + overlay. Sama seperti chartData/orders,
  // ini idealnya ditarik dari service begitu backend punya model Message —
  // untuk sekarang pakai data contoh (INITIAL_CONVERSATIONS di atas).
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [activeChatId, setActiveChatId] = useState(INITIAL_CONVERSATIONS[0]?.id ?? null)
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false)

  const activeConversation = conversations.find((c) => c.id === activeChatId) ?? null
  // Widget "Pesan Cepat" cuma nampilin satu preview — prioritaskan yang
  // belum dibalas, fallback ke yang pertama.
  const featuredConversation = conversations.find((c) => !c.replied) ?? conversations[0] ?? null

  const openQuickChat = (conversationId) => {
    setActiveChatId(conversationId)
    setIsQuickChatOpen(true)
  }

  const handleSendReply = (conversationId, replyText) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, replied: true } : c))
    )
    // TODO: kirim ke backend begitu endpoint chat tersedia.
    console.log('Kirim balasan ke', conversationId, ':', replyText)
  }

  const toggleShopStatus = () => {
    setIsShopOpen((prev) => !prev)
  }

  return (
    <PageShell activeItemId="dashboard" onItemClick={handleSidebarNavigate}>
        <div className="bg-surface p-6 md:p-8 font-body flex flex-col gap-6 max-w-[1400px] mx-auto">
          {/* 1. Header Area: Welcome Text & Search & Notification */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-3xl font-extrabold text-on-surface font-sans tracking-tight flex items-center gap-2">
              Selamat Pagi, Utama Laundry! <span className="animate-bounce">👋</span>
            </h2>

            {/* Pencarian dan Notifikasi */}
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Cari pesanan, pelanggan, transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-4 pr-11 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all shadow-sm"
                />
                <Icon
                  name="search"
                  size={20}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80"
                />
              </div>

              <button className="w-11 h-11 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-center relative hover:bg-surface-container transition-all shadow-sm hover:scale-[1.03] cursor-pointer">
                <Icon name="notifications" size={20} className="text-on-surface" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest"></span>
              </button>
            </div>
          </header>

          {/* 2. Subheader Area: Subtitle (Left) & Actions: Date Picker + Shop Status (Right) */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/35 pb-4">
            <p className="text-body-md text-on-surface-variant font-medium">
              Berikut ringkasan operasional laundry hari ini.
            </p>

            <div className="flex items-center gap-3">
              <button
                ref={dateButtonRef}
                type="button"
                onClick={() => setDatePickerOpen((prev) => !prev)}
                className="bg-surface-container-lowest border border-outline-variant px-4 py-2.5 rounded-xl text-label-sm font-bold flex items-center gap-2.5 hover:bg-surface-container transition-all shadow-sm text-on-surface hover:scale-[1.02] cursor-pointer"
              >
                <Icon name="calendar_today" size={18} className="text-primary" />
                <span>{selectedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span className="text-outline/45">|</span>
                <Icon name="event" size={18} className="text-on-surface-variant" />
              </button>

              <TeleportPanel anchorRef={dateButtonRef} open={datePickerOpen} onClose={() => setDatePickerOpen(false)}>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date)
                    setDatePickerOpen(false)
                  }}
                />
              </TeleportPanel>

              <button
                onClick={toggleShopStatus}
                className={[
                  'font-sans font-bold py-2.5 px-5 rounded-xl text-label-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] border',
                  isShopOpen
                    ? 'border-error/20 bg-error-container/30 hover:bg-error-container/50 text-error'
                    : 'border-success/20 bg-success-container/30 hover:bg-success-container/50 text-success',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {isShopOpen ? 'Tutup Toko' : 'Buka Toko'}
              </button>
            </div>
          </section>

          {/* 3. Stat Cards Area (4 Grid) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/45 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                <Icon name="assignment" size={28} className="text-primary" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Pesanan Hari Ini</span>
                <h3 className="text-3xl font-extrabold text-on-surface font-sans mt-0.5">
                  {loading ? '—' : stats?.todayOrders ?? 0}
                </h3>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container/45 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300">
                <Icon name="shopping_bag" size={28} className="text-secondary" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Siap Diambil</span>
                <h3 className="text-3xl font-extrabold text-on-surface font-sans mt-0.5">
                  {loading ? '—' : stats?.readyForPickup?.value ?? stats?.readyForPickup ?? 0}
                </h3>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container/45 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform duration-300">
                <Icon name="dry_cleaning" size={28} className="text-tertiary" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Sedang Diproses</span>
                <h3 className="text-3xl font-extrabold text-on-surface font-sans mt-0.5">
                  {loading ? '—' : stats?.inProgress?.value ?? stats?.inProgress ?? 0}
                </h3>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-accent-container/35 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                <Icon name="payments" size={28} className="text-accent" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Pendapatan Bulan Ini</span>
                <h3 className="text-2xl font-extrabold text-on-surface font-sans mt-0.5">
                  {loading ? '—' : formatRupiah(stats?.monthlyRevenue)}
                </h3>
              </div>
            </div>
          </section>

          {/* 4. Middle Layout: Chart (Left) & Order Status List (Right) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RevenueChart
              data={chartData}
              period={activeTab}
              onPeriodChange={setActiveTab}
              className="lg:col-span-2"
            />

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-subtitle font-sans font-bold text-on-surface">
                  Status Pesanan
                </h3>
              </div>

              <div className="flex flex-col divide-y divide-outline-variant/20 overflow-y-auto max-h-[295px] pr-1.5 custom-scrollbar">
                {STATUS_LIST.map((stat) => (
                  <div key={stat.key} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${stat.colorClass}`}>
                        <Icon name={stat.icon} size={18} />
                      </span>
                      <span className="text-label-md text-on-surface font-semibold">{stat.label}</span>
                    </div>
                    <span className="text-label-md font-extrabold text-on-surface">
                      {loading ? '—' : statusCounts[stat.key] ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Bottom Layout: Recent Orders Table (Left) & Recent Chat Card (Right) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-subtitle font-sans font-bold text-on-surface">
                  Pesanan Terbaru
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">ID Pesanan</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Pelanggan</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Layanan</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Jumlah</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Status</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Dibuat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {!loading && recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-body-sm text-on-surface-variant/70">
                          Belum ada pesanan.
                        </td>
                      </tr>
                    )}
                    {recentOrders.map((row) => {
                      const feStatus = BE_TO_FE[row.status] ?? 'menunggu'
                      const statusLabel = STATUS_LIST.find((s) => s.key === feStatus)?.label ?? row.status
                      // /dashboard/recent-orders only selects service.name (not type), so
                      // derive the unit from whichever quantity field is actually set.
                      const unit = row.itemCount != null ? 'Pcs' : 'Kg'
                      const qty = row.itemCount ?? row.weight
                      return (
                        <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="text-body-md text-on-surface font-mono font-medium py-3.5 pr-2">{row.orderNumber}</td>
                          <td className="py-3.5 pr-2">
                            <div className="flex items-center gap-3">
                              <span className="w-8.5 h-8.5 rounded-full bg-primary-container flex items-center justify-center text-label-sm font-bold text-on-primary-container shrink-0">
                                {row.customer?.name?.[0]?.toUpperCase() ?? '?'}
                              </span>
                              <span className="text-label-md font-bold text-on-surface">{row.customer?.name}</span>
                            </div>
                          </td>
                          <td className="text-body-md text-on-surface font-medium py-3.5 pr-2">{row.service?.name}</td>
                          <td className="text-body-md text-on-surface font-semibold py-3.5 pr-2">{qty ? `${qty} ${unit}` : '-'}</td>
                          <td className="py-3.5 pr-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border inline-block ${STATUS_BADGE_CLASS[feStatus]}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="text-body-md text-on-surface-variant font-medium py-3.5 pr-2">
                            {new Date(row.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <PesanCepatCard
              conversation={featuredConversation}
              onLihatSemua={() => openQuickChat(conversations[0]?.id)}
              onJawab={() => openQuickChat(featuredConversation?.id)}
            />
          </section>
        </div>

        <QuickChatModal
          open={isQuickChatOpen}
          onClose={() => setIsQuickChatOpen(false)}
          conversations={conversations}
          activeConversationId={activeChatId}
          onSelectConversation={setActiveChatId}
          activeConversation={activeConversation}
          onSendReply={handleSendReply}
        />
    </PageShell>
  )
}