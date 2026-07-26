import { useEffect, useRef, useState } from 'react'
import Icon from '../../../components/ui/Icon'
import Sidebar from '../../../components/ui/Sidebar'

// Data koordinat grafik statis SVG berdasarkan tab waktu (Hari ini, Minggu ini, Bulan ini)
const CHART_DATA = {
  hariIni: {
    labels: ['9.00', '12.00', '15.00', '18.00', '22.00'],
    pemasukan: [
      { x: 60, y: 160.6, value: 'Rp 650k' },
      { x: 190, y: 137.8, value: 'Rp 950k' },
      { x: 320, y: 149.2, value: 'Rp 800k' },
      { x: 450, y: 73.2, value: 'Rp 1.8M' },
      { x: 580, y: 50.4, value: 'Rp 2.1M' },
    ],
    pengeluaran: [
      { x: 60, y: 134, value: 'Rp 1.0M' },
      { x: 190, y: 130.2, value: 'Rp 1.05M' },
      { x: 320, y: 118.8, value: 'Rp 1.2M' },
      { x: 450, y: 103.6, value: 'Rp 1.4M' },
      { x: 580, y: 134, value: 'Rp 1.0M' },
    ],
  },
  mingguIni: {
    labels: ['Sen', 'Rab', 'Kam', 'Sab', 'Min'],
    pemasukan: [
      { x: 60, y: 180, value: 'Rp 400k' },
      { x: 190, y: 110, value: 'Rp 1.3M' },
      { x: 320, y: 130, value: 'Rp 1.1M' },
      { x: 450, y: 60, value: 'Rp 2.0M' },
      { x: 580, y: 40, value: 'Rp 2.3M' },
    ],
    pengeluaran: [
      { x: 60, y: 150, value: 'Rp 800k' },
      { x: 190, y: 140, value: 'Rp 900k' },
      { x: 320, y: 120, value: 'Rp 1.2M' },
      { x: 450, y: 100, value: 'Rp 1.5M' },
      { x: 580, y: 110, value: 'Rp 1.3M' },
    ],
  },
  bulanIni: {
    labels: ['Mng 1', 'Mng 2', 'Mng 3', 'Mng 4'],
    pemasukan: [
      { x: 60, y: 170, value: 'Rp 5.2M' },
      { x: 233, y: 120, value: 'Rp 11.2M' },
      { x: 406, y: 140, value: 'Rp 9.0M' },
      { x: 580, y: 45, value: 'Rp 22.0M' },
    ],
    pengeluaran: [
      { x: 60, y: 140, value: 'Rp 8.5M' },
      { x: 233, y: 130, value: 'Rp 10.0M' },
      { x: 406, y: 110, value: 'Rp 12.5M' },
      { x: 580, y: 100, value: 'Rp 14.0M' },
    ],
  },
}

// Fungsi helper matematika untuk menghitung bezier curve smooth di SVG
const getChartPaths = (points) => {
  if (!points || points.length === 0) return { lineD: '', areaD: '' }
  let lineD = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpX1 = prev.x + (curr.x - prev.x) / 2
    const cpY1 = prev.y
    const cpX2 = prev.x + (curr.x - prev.x) / 2
    const cpY2 = curr.y
    lineD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`
  }
  const areaD = `${lineD} L ${points[points.length - 1].x} 210 L ${points[0].x} 210 Z`
  return { lineD, areaD }
}

export default function DashboardView() {
  // State untuk melacak status toko (Buka / Tutup)
  const [isShopOpen, setIsShopOpen] = useState(true)

  // State untuk melacak tab filter ringkasan pendapatan
  const [activeTab, setActiveTab] = useState('hariIni')

  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState('')

  // State untuk chat interaktif di dashboard
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Rani Puspita',
      role: 'Pelanggan',
      text: 'Ka, kira kira kapan yah baju aku selesai ?...',
      time: 'Baru saja',
      isMe: false,
    },
  ])
  const [replyText, setReplyText] = useState('')
  const autoReplyTimeoutRef = useRef(null)

  // Batalin auto-reply yang masih pending kalau component unmount, biar
  // nggak manggil setState di component yang udah nggak ada.
  useEffect(() => {
    return () => clearTimeout(autoReplyTimeoutRef.current)
  }, [])

  const handleSendReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const userMessage = {
      id: crypto.randomUUID(),
      sender: 'Utama Laundry',
      role: 'Owner',
      text: replyText,
      time: 'Baru saja',
      isMe: true,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setReplyText('')

    // Simulasi jawaban otomatis (auto-reply) setelah 1.5 detik
    clearTimeout(autoReplyTimeoutRef.current)
    autoReplyTimeoutRef.current = setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'Rani Puspita',
          role: 'Pelanggan',
          text: 'Oke kak makasih infonya! 👍',
          time: 'Baru saja',
          isMe: false,
        },
      ])
    }, 1500)
  }

  const toggleShopStatus = () => {
    setIsShopOpen((prev) => !prev)
  }

  // Ambil data chart yang aktif berdasarkan tab yang dipilih
  const currentChartData = CHART_DATA[activeTab]
  const pemasukanPaths = getChartPaths(currentChartData.pemasukan)
  const pengeluaranPaths = getChartPaths(currentChartData.pengeluaran)

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar di sisi kiri */}
      <Sidebar activeItemId="dashboard" />

      {/* Konten Dashboard di sisi kanan */}
      <main className="flex-1 overflow-x-hidden">
        <div className="flex-1 min-h-screen bg-surface p-6 md:p-8 font-body flex flex-col gap-6 overflow-y-auto max-w-[1400px] mx-auto">
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
              Berikut rikasan operasional laundry hari ini.
            </p>

            {/* Grouping Date Picker and Shop Status together on the right */}
            <div className="flex items-center gap-3">
              {/* Date Picker Button */}
              <button className="bg-surface-container-lowest border border-outline-variant px-4 py-2.5 rounded-xl text-label-sm font-bold flex items-center gap-2.5 hover:bg-surface-container transition-all shadow-sm text-on-surface hover:scale-[1.02] cursor-pointer">
                <Icon name="calendar_today" size={18} className="text-primary" />
                <span>22 Juli 2026</span>
                <span className="text-outline/45">|</span>
                <Icon name="event" size={18} className="text-on-surface-variant" />
              </button>

              {/* Shop Status Toggle Button */}
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
            {/* Stat 1: Total Pesanan */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/45 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                <Icon name="assignment" size={28} className="text-primary" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Total Pesanan</span>
                <h3 className="text-3xl font-extrabold text-on-surface font-sans mt-0.5">37</h3>
                <span className="text-label-sm text-success font-bold flex items-center gap-1 mt-1">
                  <Icon name="trending_up" size={14} className="text-success" />
                  12% dari kemarin
                </span>
              </div>
            </div>

            {/* Stat 2: Siap Diambil */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container/45 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-300">
                <Icon name="shopping_bag" size={28} className="text-secondary" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Siap Diambil</span>
                <h3 className="text-3xl font-extrabold text-on-surface font-sans mt-0.5">21</h3>
                <span className="text-label-sm text-success font-bold flex items-center gap-1 mt-1">
                  <Icon name="trending_up" size={14} className="text-success" />
                  8% dari kemarin
                </span>
              </div>
            </div>

            {/* Stat 3: Sedang Diproses */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container/45 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform duration-300">
                <Icon name="dry_cleaning" size={28} className="text-tertiary" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Sedang Diproses</span>
                <h3 className="text-3xl font-extrabold text-on-surface font-sans mt-0.5">17</h3>
                <span className="text-label-sm text-success font-bold flex items-center gap-1 mt-1">
                  <Icon name="trending_up" size={14} className="text-success" />
                  10% dari kemarin
                </span>
              </div>
            </div>

            {/* Stat 4: Pendapatan Hari Ini */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-accent-container/35 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                <Icon name="payments" size={28} className="text-accent" />
              </div>
              <div>
                <span className="text-label-sm text-on-surface-variant font-bold">Pendapatan Hari Ini</span>
                <h3 className="text-2xl font-extrabold text-on-surface font-sans mt-0.5">Rp. 1.570.000</h3>
                <span className="text-label-sm text-success font-bold flex items-center gap-1 mt-1">
                  <Icon name="trending_up" size={14} className="text-success" />
                  10% dari kemarin
                </span>
              </div>
            </div>
          </section>

          {/* 4. Middle Layout: Chart (Left) & Order Status List (Right) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Income Chart */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h3 className="text-subtitle font-sans font-bold text-on-surface">
                  Ringkasan Pendapatan
                </h3>
                {/* Tab filter */}
                <div className="flex border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveTab('hariIni')}
                    className={`px-4 py-1.5 text-label-sm font-bold cursor-pointer transition-colors duration-200 ${
                      activeTab === 'hariIni'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container bg-surface-container-lowest'
                    }`}
                  >
                    Hari ini
                  </button>
                  <button
                    onClick={() => setActiveTab('mingguIni')}
                    className={`px-4 py-1.5 text-label-sm font-bold cursor-pointer transition-colors duration-200 ${
                      activeTab === 'mingguIni'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container bg-surface-container-lowest'
                    }`}
                  >
                    Minggu ini
                  </button>
                  <button
                    onClick={() => setActiveTab('bulanIni')}
                    className={`px-4 py-1.5 text-label-sm font-bold cursor-pointer transition-colors duration-200 ${
                      activeTab === 'bulanIni'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container bg-surface-container-lowest'
                    }`}
                  >
                    Bulan ini
                  </button>
                </div>
              </div>

              {/* SVG Line Chart */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox="0 0 620 250"
                  width="100%"
                  height="250"
                  className="min-w-[500px]"
                >
                  <defs>
                    <linearGradient id="pemasukanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a6780" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0a6780" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="pengeluaranGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#66558f" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#66558f" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="60" y1="58" x2="580" y2="58" stroke="#bfc8cc" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="60" y1="134" x2="580" y2="134" stroke="#bfc8cc" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="60" y1="172" x2="580" y2="172" stroke="#bfc8cc" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="60" y1="210" x2="580" y2="210" stroke="#bfc8cc" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="45" y="62" textAnchor="end" className="text-label-sm font-medium fill-on-surface-variant font-mono">2.000.000</text>
                  <text x="45" y="138" textAnchor="end" className="text-label-sm font-medium fill-on-surface-variant font-mono">1.000.000</text>
                  <text x="45" y="176" textAnchor="end" className="text-label-sm font-medium fill-on-surface-variant font-mono">500.000</text>
                  <text x="45" y="214" textAnchor="end" className="text-label-sm font-medium fill-on-surface-variant font-mono">0</text>

                  {/* Area Under Curves */}
                  <path d={pemasukanPaths.areaD} fill="url(#pemasukanGrad)" />
                  <path d={pengeluaranPaths.areaD} fill="url(#pengeluaranGrad)" />

                  {/* Line Curves */}
                  <path
                    d={pemasukanPaths.lineD}
                    fill="none"
                    stroke="#0a6780"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <path
                    d={pengeluaranPaths.lineD}
                    fill="none"
                    stroke="#bca7e2"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />

                  {/* Data Points */}
                  {currentChartData.pemasukan.map((pt, idx) => (
                    <g key={`pem-${idx}`}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#0a6780" strokeWidth="3" />
                      <text x={pt.x} y={pt.y - 12} textAnchor="middle" className="text-xs font-bold fill-primary font-mono bg-white">{pt.value}</text>
                    </g>
                  ))}
                  {currentChartData.pengeluaran.map((pt, idx) => (
                    <g key={`peng-${idx}`}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#bca7e2" strokeWidth="2.5" />
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {currentChartData.labels.map((lbl, idx) => {
                    const step = 520 / (currentChartData.labels.length - 1)
                    const xPos = 60 + idx * step
                    return (
                      <text key={idx} x={xPos} y="235" textAnchor="middle" className="text-label-sm font-semibold fill-on-surface-variant">
                        {lbl}
                      </text>
                    )
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-8 text-label-sm font-bold mt-2">
                <span className="flex items-center gap-2 text-on-surface">
                  <span className="w-4 h-1.5 bg-primary rounded-full inline-block"></span>
                  Pemasukan Hari Ini
                </span>
                <span className="flex items-center gap-2 text-on-surface-variant/80">
                  <span className="w-4 h-1.5 bg-tertiary-fixed-dim rounded-full inline-block"></span>
                  Pengeluaran Kemarin
                </span>
              </div>
            </div>

            {/* Right: Order Status List */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-subtitle font-sans font-bold text-on-surface">
                  Status Pesanan
                </h3>
                <button className="text-label-sm font-bold text-primary hover:underline cursor-pointer">
                  Lihat semua
                </button>
              </div>

              {/* List of Statuses */}
              <div className="flex flex-col divide-y divide-outline-variant/20 overflow-y-auto max-h-[295px] pr-1.5 custom-scrollbar">
                {[
                  { label: 'Menunggu', count: 18, icon: 'hourglass_empty', colorClass: 'text-outline bg-surface-container' },
                  { label: 'Dicuci', count: 8, icon: 'local_laundry_service', colorClass: 'text-info bg-info-container/30' },
                  { label: 'Dikeringkan', count: 9, icon: 'air', colorClass: 'text-success bg-success-container/30' },
                  { label: 'Disetrika', count: 10, icon: 'iron', colorClass: 'text-tertiary bg-tertiary-container/30' },
                  { label: 'Siap Diambil', count: 21, icon: 'shopping_bag', colorClass: 'text-success bg-success-container/40' },
                  { label: 'Diantar', count: 7, icon: 'local_shipping', colorClass: 'text-warning bg-warning-container/30' },
                  { label: 'Selesai', count: 5, icon: 'check_circle', colorClass: 'text-secondary bg-secondary-container/35' },
                  { label: 'Dibatalkan', count: 2, icon: 'cancel', colorClass: 'text-error bg-error-container/30' },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${stat.colorClass}`}>
                        <Icon name={stat.icon} size={18} />
                      </span>
                      <span className="text-label-md text-on-surface font-semibold">{stat.label}</span>
                    </div>
                    <span className="text-label-md font-extrabold text-on-surface">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Bottom Layout: Recent Orders Table (Left) & Recent Chat Card (Right) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Recent Orders Table */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-subtitle font-sans font-bold text-on-surface">
                  Pesanan Terbaru
                </h3>
                <button className="text-label-sm font-bold text-primary hover:underline cursor-pointer">
                  Lihat semua
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">ID Pesanan</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Pelanggan</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Layanan</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Berat</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Status</th>
                      <th className="text-label-sm text-on-surface-variant font-extrabold text-left pb-3 border-b border-outline-variant/30">Selesai</th>
                      <th className="pb-3 border-b border-outline-variant/30"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {[
                      {
                        id: 'TRX/0023400501',
                        name: 'Rani Puspita',
                        service: 'Cuci Kiloan',
                        weight: '7.8 Kg',
                        status: 'Dicuci',
                        statusClass: 'bg-info-container/45 text-on-info-container border-info/10',
                        eta: '22 Juni 15:30',
                        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                      },
                      {
                        id: 'TRX/0023300502',
                        name: 'Alberto',
                        service: 'Cuci + Selimut',
                        weight: '3.5 Kg',
                        status: 'Dikeringkan',
                        statusClass: 'bg-success-container/30 text-on-success-container border-success/10',
                        eta: '22 Juni 15:30',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                      },
                      {
                        id: 'TRX/0023200503',
                        name: 'Azzam',
                        service: 'Cuci Kiloan',
                        weight: '8.6 Kg',
                        status: 'Siap Diambil',
                        statusClass: 'bg-success-container/50 text-on-success-container border-success/20',
                        eta: '22 Juni 15:30',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="text-body-md text-on-surface font-mono font-medium py-3.5 pr-2">{row.id}</td>
                        <td className="py-3.5 pr-2">
                          <div className="flex items-center gap-3">
                            <img src={row.avatar} alt={row.name} className="w-8.5 h-8.5 rounded-full border border-outline-variant/30 object-cover shrink-0" />
                            <span className="text-label-md font-bold text-on-surface">{row.name}</span>
                          </div>
                        </td>
                        <td className="text-body-md text-on-surface font-medium py-3.5 pr-2">{row.service}</td>
                        <td className="text-body-md text-on-surface font-semibold py-3.5 pr-2">{row.weight}</td>
                        <td className="py-3.5 pr-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border inline-block ${row.statusClass}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="text-body-md text-on-surface-variant font-medium py-3.5 pr-2">{row.eta}</td>
                        <td className="py-3.5 text-right">
                          <button className="p-1.5 hover:bg-surface-container rounded-lg transition-colors cursor-pointer text-on-surface-variant">
                            <Icon name="more_vert" size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Recent Chat Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-subtitle font-sans font-bold text-on-surface">
                  Pesan Terbaru
                </h3>
                <button className="text-label-sm font-bold text-primary hover:underline cursor-pointer">
                  Lihat semua
                </button>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[190px] pr-1.5 custom-scrollbar">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1.5 max-w-[85%] ${
                      msg.isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    {!msg.isMe && (
                      <div className="flex items-center gap-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                          alt={msg.sender}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-label-sm font-bold text-on-surface">{msg.sender}</span>
                          <span className="text-[10px] text-on-surface-variant font-medium leading-none">{msg.role}</span>
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={[
                        'text-body-md p-3.5 rounded-2xl leading-relaxed',
                        msg.isMe
                          ? 'bg-primary text-on-primary rounded-tr-none text-right font-medium'
                          : 'bg-surface-container/60 text-on-surface rounded-tl-none font-medium',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-on-surface-variant/70 font-medium px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex items-center justify-between border border-outline-variant rounded-xl p-1.5 bg-surface-container-lowest focus-within:border-primary transition-all duration-200 shadow-inner">
                <input
                  type="text"
                  placeholder="Balas sekarang..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-transparent outline-none px-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60"
                />
                <button
                  type="submit"
                  className="text-primary hover:bg-primary-container p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                  aria-label="Kirim balasan"
                >
                  <Icon name="send" size={18} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
