import { useState, useRef, useEffect } from 'react'
import Icon from '../../../components/ui/Icon'
import Sidebar from '../../../components/ui/Sidebar'
import StatusBadge from '../../../components/ui/StatusBadge'
import Stepper from '../../../components/ui/Stepper'
import QuantityInput from '../../../components/ui/QuantityInput'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'

// 1. Ilustrasi SVG Kustom untuk Halaman Kosong Utama (Belum Ada Pesanan)
const EmptyOrdersIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    xmlns="http://www.w3.org/2000/svg"
    className="w-48 h-40 mx-auto transition-transform duration-300 hover:scale-105"
  >
    <ellipse cx="100" cy="140" rx="60" ry="6" fill="#eff5f6" />
    <rect x="85" y="40" width="55" height="75" rx="4" fill="#ffffff" stroke="#171d1e" strokeWidth="2.5" />
    <path d="M93 50 L115 50" stroke="#eff5f6" strokeWidth="3" strokeLinecap="round" />
    <path d="M93 60 L132 60" stroke="#bfc8cc" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M93 70 L125 70" stroke="#bfc8cc" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M93 80 L132 80" stroke="#bfc8cc" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M93 90 L120 90" stroke="#bfc8cc" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M93 100 L128 100" stroke="#bfc8cc" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M102 40 L123 40 L120 34 L105 34 Z" fill="#171d1e" />
    <circle cx="132" cy="46" r="9" fill="#0a6780" />
    <path d="M132 42 L132 50 M128 46 L136 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <rect x="75" y="80" width="10" height="25" rx="3" fill="#004d62" />
    <rect x="68" y="98" width="6" height="12" fill="#ffdea4" />
    <rect x="79" y="98" width="6" height="12" fill="#ffdea4" />
    <rect x="65" y="110" width="10" height="4" rx="2" fill="#171d1e" />
    <rect x="78" y="110" width="10" height="4" rx="2" fill="#171d1e" />
    <path d="M60 80 C60 65, 80 65, 80 80 Z" fill="#0a6780" />
    <circle cx="70" cy="58" r="10" fill="#ffdea4" />
    <path d="M60 55 C60 48, 80 48, 80 55 C74 54, 66 54, 60 55 Z" fill="#171d1e" />
    <path d="M52 74 C56 78, 62 82, 68 83" stroke="#ffdea4" strokeWidth="3" strokeLinecap="round" />
    <path d="M84 76 C87 78, 92 78, 95 78" stroke="#ffdea4" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// 2. Ilustrasi SVG Kustom untuk Halaman Filter Kosong
const EmptyFilterIllustration = () => (
  <svg
    viewBox="0 0 200 160"
    xmlns="http://www.w3.org/2000/svg"
    className="w-48 h-40 mx-auto transition-transform duration-300 hover:scale-105"
  >
    <ellipse cx="100" cy="140" rx="60" ry="6" fill="#eff5f6" />
    <path
      d="M75 50 L135 50 C138 50, 140 52, 140 55 L140 120 C140 123, 138 125, 135 125 L75 125 C72 125, 70 123, 70 120 L70 55 C70 52, 72 50, 75 50 Z"
      fill="#ffffff"
      stroke="#bfc8cc"
      strokeWidth="1.5"
    />
    <path d="M78 65 L110 65" stroke="#eff5f6" strokeWidth="3" strokeLinecap="round" />
    <path d="M78 75 L130 75" stroke="#bfc8cc" strokeWidth="2" strokeLinecap="round" />
    <path d="M78 85 L125 85" stroke="#bfc8cc" strokeWidth="2" strokeLinecap="round" />
    <path d="M78 95 L130 95" stroke="#bfc8cc" strokeWidth="2" strokeLinecap="round" />
    <path d="M78 105 L120 105" stroke="#bfc8cc" strokeWidth="2" strokeLinecap="round" />
    <circle cx="128" cy="62" r="8" fill="#004d62" />
    <path d="M128 58 L128 66 M124 62 L132 62" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="95" cy="45" r="9" fill="#ffdea4" />
    <path d="M85 40 C85 34, 105 34, 105 40 C98 38, 92 38, 85 40 Z" fill="#171d1e" />
    <circle cx="95" cy="34" r="3.5" fill="#171d1e" />
    <path d="M82 60 C82 50, 108 50, 108 60 Z" fill="#0a6780" />
    <circle cx="80" cy="62" r="3.5" fill="#ffdea4" />
    <circle cx="110" cy="62" r="3.5" fill="#ffdea4" />
    <path d="M52 95 C45 90, 48 75, 55 80 C52 70, 60 72, 60 83" fill="#70787c" opacity="0.2" />
    <path d="M148 95 C155 90, 152 75, 145 80 C148 70, 140 72, 140 83" fill="#70787c" opacity="0.2" />
  </svg>
)

const STATUS_STEPS = [
  { id: 'menunggu', label: 'Menunggu', icon: 'hourglass_empty' },
  { id: 'dicuci', label: 'Dicuci', icon: 'local_laundry_service' },
  { id: 'dikeringkan', label: 'Dikeringkan', icon: 'air' },
  { id: 'disetrika', label: 'Disetrika', icon: 'iron' },
  { id: 'siap_diambil', label: 'Siap Diambil', icon: 'shopping_bag' },
  { id: 'diantar', label: 'Diantar', icon: 'local_shipping' },
  { id: 'selesai', label: 'Selesai', icon: 'check_circle' },
  { id: 'dibatalkan', label: 'Dibatalkan', icon: 'cancel' },
]
// Helper untuk parsing format tanggal "22 Juni 15:30" atau "Baru saja" ke Date object
const parseOrderDate = (dateStr) => {
  if (!dateStr || dateStr === 'Baru saja') {
    return new Date() // default ke hari ini
  }
  
  const indonesianMonths = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
  }

  const cleanStr = dateStr.toLowerCase().trim()
  const parts = cleanStr.split(/\s+/) // split by space
  
  const day = parseInt(parts[0], 10) || 1
  const monthStr = parts[1]
  const month = indonesianMonths[monthStr] !== undefined ? indonesianMonths[monthStr] : 5 // default ke Juni

  // Sesuai mockup, rentang tanggal disetel ke tahun 2026
  const dateObj = new Date(2026, month, day)
  
  if (parts[2]) {
    const timeParts = parts[2].split(':')
    const hours = parseInt(timeParts[0], 10) || 0
    const minutes = parseInt(timeParts[1], 10) || 0
    dateObj.setHours(hours, minutes, 0, 0)
  } else {
    dateObj.setHours(12, 0, 0, 0)
  }

  return dateObj
}

export default function OrderListView() {
  const handleSidebarNavigate = useSidebarNavigate()

  // 1. Data Mockup Pesanan
  const [orders, setOrders] = useState([
    {
      id: 'TRX-0230045698',
      customer: 'Rani Puspita',
      date: '22 Juni 15:30',
      status: 'menunggu',
      services: [
        { name: 'Cuci Sekilo - 7.4 Kg', price: 37300 },
        { name: 'Selimut Kecil - 1', price: 37300 },
      ],
      total: 74600,
    },
    {
      id: 'TRX-0230015698',
      customer: 'Alberto',
      date: '22 Juni 15:30',
      status: 'dicuci',
      services: [
        { name: 'Cuci Sekilo - 7.4 Kg', price: 37300 },
        { name: 'Selimut Kecil - 1', price: 37300 },
      ],
      total: 74600,
    },
    {
      id: 'TRX-0230025698',
      customer: 'Azzam',
      date: '22 Juni 15:30',
      status: 'dikeringkan',
      services: [
        { name: 'Cuci Sekilo - 7.4 Kg', price: 37300 },
        { name: 'Selimut Kecil - 1', price: 37300 },
      ],
      total: 74600,
    },
    {
      id: 'TRX-0230035698',
      customer: 'Azzam',
      date: '22 Juni 15:30',
      status: 'menunggu',
      services: [
        { name: 'Cuci Sekilo - 7.4 Kg', price: 37300 },
        { name: 'Selimut Kecil - 1', price: 37300 },
      ],
      total: 74600,
    },
  ])

  // 2. States untuk Pencarian, Filter Stepper, & Filter Panel
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  
  // State Pencarian & Filter Popover Ref
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  
  const searchContainerRef = useRef(null)
  const filterContainerRef = useRef(null)

  // Klik di luar untuk menutup suggestion box dan filter popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
        setIsFilterDrawerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 3. States Filter Panel (`Filter.png`)
  const [filterStatuses, setFilterStatuses] = useState({
    menunggu: false,
    dicuci: false,
    dikeringkan: false,
    disetrika: false,
    siap_diambil: false,
    diantar: false,
    selesai: false,
    dibatalkan: false,
  })
  const [filterServices, setFilterServices] = useState({
    kiloan: false,
    selimut: false,
  })

  // States tambahan filter.png
  const [sortOrder, setSortOrder] = useState(null) // 'asc' atau 'desc' atau null
  const [startDate, setStartDate] = useState(null) // format YYYY-MM-DD
  const [endDate, setEndDate] = useState(null) // format YYYY-MM-DD

  // 4. States Tambah Pesanan Drawer samping (`Tambah Pesan.png`)
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [kiloanWeight, setKiloanWeight] = useState('')
  
  // Daftar kuantiti tambahan menggunakan komponen QuantityInput
  const [additionalQty, setAdditionalQty] = useState({
    selimutKecil: 0,
    selimutBesar: 0,
    spreiKecil: 0,
    spreiBesar: 0,
    bantalKecil: 0,
    bantalBesar: 0,
    bonekaKecil: 0,
    bonekaBesar: 0,
    bedCoverKecil: 0,
    bedCoverBesar: 0,
    karpetKecil: 0,
    karpetBesar: 0,
  })

  // 5. States Chat & Edit Status Row
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
  const [activeEditingOrderId, setActiveEditingOrderId] = useState(null)

  // Fungsi toggle checkbox filter status
  const handleStatusCheckboxChange = (statusKey) => {
    setFilterStatuses((prev) => ({ ...prev, [statusKey]: !prev[statusKey] }))
  }

  // Fungsi toggle checkbox filter layanan
  const handleServiceCheckboxChange = (serviceKey) => {
    setFilterServices((prev) => ({ ...prev, [serviceKey]: !prev[serviceKey] }))
  }

  // Apakah ada filter aktif dari Panel Drawer?
  const isPanelFilterActive =
    Object.values(filterStatuses).some(Boolean) ||
    Object.values(filterServices).some(Boolean) ||
    sortOrder !== null ||
    startDate !== null ||
    endDate !== null

  // Fungsi reset seluruh filter drawer
  const handleResetFilters = () => {
    setFilterStatuses({
      menunggu: false,
      dicuci: false,
      dikeringkan: false,
      disetrika: false,
      siap_diambil: false,
      diantar: false,
      selesai: false,
      dibatalkan: false,
    })
    setFilterServices({
      kiloan: false,
      selimut: false,
    })
    setSortOrder(null)
    setStartDate(null)
    setEndDate(null)
    setStatusFilter(null)
  }

  // Handle edit status pesanan
  const handleUpdateStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    )
    setActiveEditingOrderId(null)
  }

  // Kirim balasan chat
  const handleSendReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: 'Utama Laundry',
      role: 'Owner',
      text: replyText,
      time: 'Baru saja',
      isMe: true,
    }

    setChatMessages((prev) => [...prev, userMessage])
    setReplyText('')

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Rani Puspita',
          role: 'Pelanggan',
          text: 'Oke kak makasih infonya! 👍',
          time: 'Baru saja',
          isMe: false,
        },
      ])
    }, 1500)
  }

  // Helper to compute currently selected services and their prices dynamically
  const calculateCurrentServices = () => {
    const selected = []
    let totalSum = 0

    // Kiloan utama
    const weightVal = parseFloat(kiloanWeight)
    if (weightVal > 0) {
      const price = Math.round(weightVal * 5000)
      selected.push({ name: 'Cuci Kiloan', detail: `Cuci Kiloan - ${weightVal} Kg`, price })
      totalSum += price
    }

    // List harga kuantiti tambahan
    const priceList = {
      selimutKecil: { label: 'Selimut Kecil', p: 15000 },
      selimutBesar: { label: 'Selimut Besar', p: 25000 },
      spreiKecil: { label: 'Sprei Kecil', p: 10000 },
      spreiBesar: { label: 'Sprei Besar', p: 15000 },
      bantalKecil: { label: 'Bantal Kecil', p: 5000 },
      bantalBesar: { label: 'Bantal Besar', p: 8000 },
      bonekaKecil: { label: 'Bantal Kecil', p: 8000 }, // Matches mockup under "Boneka" section
      bonekaBesar: { label: 'Bantal Besar', p: 15000 },
      bedCoverKecil: { label: 'Bantal Kecil', p: 20000 }, // Matches mockup under "Bed Cover" section
      bedCoverBesar: { label: 'Bantal Besar', p: 30000 },
      karpetKecil: { label: 'Karpet Kecil', p: 25000 },
      karpetBesar: { label: 'Karpet Besar', p: 35000 },
    }

    Object.entries(additionalQty).forEach(([key, val]) => {
      if (val > 0 && priceList[key]) {
        const itemPrice = priceList[key].p * val
        selected.push({
          name: priceList[key].label,
          detail: `${priceList[key].label} - ${val}`,
          price: itemPrice
        })
        totalSum += itemPrice
      }
    })

    return { selected, totalSum }
  }

  // Menambahkan Pesanan Baru dari Drawer Samping
  const handleSaveNewOrder = (e) => {
    e.preventDefault()
    if (!newCustomerName.trim()) return

    const { selected, totalSum } = calculateCurrentServices()

    const builtServices = selected.map(item => ({
      name: item.detail,
      price: item.price
    }))

    // Jika tidak memilih apa pun, beri default
    if (builtServices.length === 0) {
      builtServices.push({ name: 'Cuci Kiloan - 5.0 Kg', price: 25000 })
    }

    const calculatedTotal = totalSum === 0 ? 25000 : totalSum

    const newOrderObj = {
      id: `TRX-02300${orders.length + 45698 + 1}`,
      customer: newCustomerName,
      date: 'Baru saja',
      status: 'menunggu',
      services: builtServices,
      total: calculatedTotal,
    }

    setOrders((prev) => [newOrderObj, ...prev])
    setIsAddDrawerOpen(false)
    
    // Reset inputs
    setNewCustomerName('')
    setKiloanWeight('')
    setAdditionalQty({
      selimutKecil: 0,
      selimutBesar: 0,
      spreiKecil: 0,
      spreiBesar: 0,
      bantalKecil: 0,
      bantalBesar: 0,
      bonekaKecil: 0,
      bonekaBesar: 0,
      bedCoverKecil: 0,
      bedCoverBesar: 0,
      karpetKecil: 0,
      karpetBesar: 0,
    })
  }

  // Hitung jumlah pesanan berdasarkan status secara dinamis
  const getStatusCount = (statusKey) => {
    return orders.filter((ord) => ord.status === statusKey).length
  }

  // Proses filter utama pada list pesanan
  const filteredOrders = orders.filter((ord) => {
    // 1. Filter dari stepper atas
    const matchesStepper = statusFilter ? ord.status === statusFilter : true

    // 2. Filter dari panel checkbox Drawer samping
    const activeStatuses = Object.keys(filterStatuses).filter((k) => filterStatuses[k])
    const matchesPanelStatus = activeStatuses.length > 0 ? activeStatuses.includes(ord.status) : true

    // Filter tipe layanan
    const matchesPanelService = (() => {
      const activeServices = Object.keys(filterServices).filter((k) => filterServices[k])
      if (activeServices.length === 0) return true
      return ord.services.some((srv) => {
        const nameLower = srv.name.toLowerCase()
        return activeServices.some((servKey) => {
          if (servKey === 'kiloan') return nameLower.includes('kilo')
          if (servKey === 'selimut') return nameLower.includes('selimut')
          return false
        })
      })
    })()

    // 3. Pencarian
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.toLowerCase().includes(searchQuery.toLowerCase())

    // 4. Filter Rentang Tanggal (Dari & Sampai)
    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true
      const orderDate = parseOrderDate(ord.date)
      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        if (orderDate < start) return false
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        if (orderDate > end) return false
      }
      return true
    })()

    return matchesStepper && matchesPanelStatus && matchesPanelService && matchesSearch && matchesDateRange
  })

  // Proses sorting berdasarkan sortOrder ('asc' untuk A-Z, 'desc' untuk Z-A)
  const displayOrders = [...filteredOrders]
  if (sortOrder === 'asc') {
    displayOrders.sort((a, b) => a.customer.localeCompare(b.customer))
  } else if (sortOrder === 'desc') {
    displayOrders.sort((a, b) => b.customer.localeCompare(a.customer))
  }

  // Dummy list untuk pencarian baru-baru ini & saran pencarian terbaru (Search Menu.png)
  const recentSearches = [
    'TRX-0230045698',
    'TRX-0230045698',
    'TRX-0230045698',
    'TRX-0230045698',
  ]

  const recentSearchOrders = [
    { id: 'TRX-0230045698', weight: '7.1 Kg', status: 'menunggu', icon: 'hourglass_empty', bg: 'bg-surface-container text-outline' },
    { id: 'TRX-0230015698', weight: '7.1 Kg', status: 'dicuci', icon: 'local_laundry_service', bg: 'bg-info-container/30 text-info' },
    { id: 'TRX-0230025698', weight: '7.1 Kg', status: 'diantar', icon: 'local_shipping', bg: 'bg-warning-container/30 text-warning' },
    { id: 'TRX-0230035698', weight: '7.1 Kg', status: 'selesai', icon: 'check_circle', bg: 'bg-secondary-container text-secondary' },
  ]

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar kiri */}
      <Sidebar activeItemId="pesanan" onItemClick={handleSidebarNavigate} />

      {/* Konten Utama */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6">
        
        {/* 1. Bagian Atas: Stepper / Filter Status (Horizontal) */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm overflow-x-auto custom-scrollbar">
          <Stepper
            current={statusFilter}
            onStepClick={(stepKey) => setStatusFilter(statusFilter === stepKey ? null : stepKey)}
            className="w-full justify-between py-2"
          />
        </section>

        {/* 2. Layout Tengah: Daftar Pesanan (Kiri) & Widgets Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* A. KOLOM KIRI: Daftar Pesanan */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-5 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <h3 className="text-subtitle font-sans font-bold text-on-surface">
                Daftar Pesan
              </h3>
              
              {/* Status Filter Indicator & Popover */}
              <div className="relative" ref={filterContainerRef}>
                {isPanelFilterActive || statusFilter ? (
                  <button
                    onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                    className="flex items-center gap-1.5 text-label-sm font-bold text-primary bg-primary-container/45 px-3 py-1.5 rounded-xl border border-primary/25 cursor-pointer hover:bg-primary-container/60 transition-colors"
                  >
                    <Icon name="filter_alt" size={16} />
                    <span>Filter Aktif</span>
                    <Icon name="close" size={16} className="text-primary/70" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                    className="flex items-center gap-1.5 text-label-sm font-bold text-primary bg-transparent border-0 outline-none cursor-pointer hover:underline"
                  >
                    <Icon name="filter_list" size={16} />
                    <span>Filter</span>
                  </button>
                )}

                {/* Dropdown Popover Filter (Filter.png) */}
                {isFilterDrawerOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl z-30 p-5 flex flex-col gap-5 animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
                      <button
                        onClick={() => setIsFilterDrawerOpen(false)}
                        className="p-1 hover:bg-surface-container rounded-lg cursor-pointer text-on-surface-variant flex items-center justify-center"
                        aria-label="Kembali"
                      >
                        <Icon name="arrow_back_ios" size={16} />
                      </button>
                      <h4 className="text-label-md font-sans font-extrabold text-on-surface">Filter</h4>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                      {/* Status */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Status</span>
                        <div className="flex flex-col gap-2">
                          {STATUS_STEPS.map((step) => (
                            <label key={step.id} className="flex items-center justify-between cursor-pointer select-none group py-0.5">
                              <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                                {step.label}
                              </span>
                              <input
                                type="checkbox"
                                checked={filterStatuses[step.id] || false}
                                onChange={() => handleStatusCheckboxChange(step.id)}
                                className="w-4.5 h-4.5 accent-primary cursor-pointer rounded border-outline-variant focus:ring-primary"
                              />
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Jenis Layanan */}
                      <div className="flex flex-col gap-2.5 border-t border-outline-variant/20 pt-3">
                        <span className="text-[10px] font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Jenis Layanan</span>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center justify-between cursor-pointer select-none group py-0.5">
                            <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                              Cuci Kiloan
                            </span>
                            <input
                              type="checkbox"
                              checked={filterServices.kiloan}
                              onChange={() => handleServiceCheckboxChange('kiloan')}
                              className="w-4.5 h-4.5 accent-primary cursor-pointer rounded border-outline-variant focus:ring-primary"
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer select-none group py-0.5">
                            <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                              Selimut
                            </span>
                            <input
                              type="checkbox"
                              checked={filterServices.selimut}
                              onChange={() => handleServiceCheckboxChange('selimut')}
                              className="w-4.5 h-4.5 accent-primary cursor-pointer rounded border-outline-variant focus:ring-primary"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Urutkan */}
                      <div className="flex flex-col gap-2.5 border-t border-outline-variant/20 pt-3">
                        <span className="text-[10px] font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Urutkan</span>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center justify-between cursor-pointer select-none group py-0.5">
                            <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                              A - Z
                            </span>
                            <input
                              type="checkbox"
                              checked={sortOrder === 'asc'}
                              onChange={() => setSortOrder(sortOrder === 'asc' ? null : 'asc')}
                              className="w-4.5 h-4.5 accent-primary cursor-pointer rounded border-outline-variant focus:ring-primary"
                            />
                          </label>
                          <label className="flex items-center justify-between cursor-pointer select-none group py-0.5">
                            <span className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                              Z - A
                            </span>
                            <input
                              type="checkbox"
                              checked={sortOrder === 'desc'}
                              onChange={() => setSortOrder(sortOrder === 'desc' ? null : 'desc')}
                              className="w-4.5 h-4.5 accent-primary cursor-pointer rounded border-outline-variant focus:ring-primary"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Rentang Tanggal */}
                      <div className="flex flex-col gap-2.5 border-t border-outline-variant/20 pt-3">
                        <span className="text-[10px] font-extrabold text-on-surface-variant/70 uppercase tracking-wider">Rentang Tanggal</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-label-sm font-semibold text-on-surface">Dari</span>
                            <div className="relative flex items-center bg-[#eaf6f9] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-primary w-44">
                              <input
                                type="date"
                                value={startDate || ''}
                                onChange={(e) => setStartDate(e.target.value || null)}
                                className="w-full bg-transparent text-label-sm font-bold text-[#004d62] outline-none cursor-pointer [color-scheme:light]"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-label-sm font-semibold text-on-surface">Sampai</span>
                            <div className="relative flex items-center bg-[#eaf6f9] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-primary w-44">
                              <input
                                type="date"
                                value={endDate || ''}
                                onChange={(e) => setEndDate(e.target.value || null)}
                                className="w-full bg-transparent text-label-sm font-bold text-[#004d62] outline-none cursor-pointer [color-scheme:light]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-outline-variant/30 pt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleResetFilters()
                        }}
                        className="flex-grow border border-outline py-2 rounded-xl text-label-sm font-bold text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setIsFilterDrawerOpen(false)}
                        className="flex-grow bg-[#b9eaff] hover:bg-[#a6e2fc] text-[#004d62] py-2 rounded-xl text-label-sm font-extrabold shadow-sm transition-all cursor-pointer text-center"
                      >
                        Tambahkan Pesanan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Konten List Pesanan */}
            {displayOrders.length > 0 ? (
              <div className="flex flex-col gap-6 divide-y divide-outline-variant/25">
                {displayOrders.map((order) => (
                  <div key={order.id} className="pt-5 first:pt-0 flex flex-col gap-3.5 relative animate-fade-in">
                    {/* Baris Pertama: ID, Nama, Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-label-md font-mono font-extrabold text-on-surface">{order.id}</span>
                        <span className="text-label-sm text-on-surface-variant/80 font-semibold">{order.customer}</span>
                      </div>
                      
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Baris Kedua: Tanggal */}
                    <span className="text-xs text-on-surface-variant/70 font-bold -mt-2.5">{order.date}</span>

                    {/* Baris Ketiga: Item Layanan */}
                    <div className="flex flex-col gap-2 bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/20">
                      <span className="text-label-sm text-on-surface-variant font-extrabold">Layanan</span>
                      {order.services.map((srv, sIdx) => (
                        <div key={sIdx} className="flex justify-between text-body-md text-on-surface font-medium">
                          <span>{srv.name}</span>
                          <span className="font-mono">Rp {srv.price.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-outline-variant/30 pt-2 mt-1 text-label-md font-bold text-on-surface">
                        <span>Total</span>
                        <span className="text-primary font-mono">Rp {order.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Baris Keempat: Aksi */}
                    <div className="flex items-center justify-between mt-1">
                      <button className="text-label-sm font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 outline-none">
                        Lihat Receipt
                      </button>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveEditingOrderId(
                              activeEditingOrderId === order.id ? null : order.id
                            )
                          }
                          className="border border-primary/20 bg-primary-container/45 hover:bg-primary-container/60 text-primary font-sans font-bold py-1.5 px-4 rounded-xl text-label-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] flex items-center gap-1"
                        >
                          <span>Edit Status</span>
                          <Icon name="arrow_drop_down" size={18} />
                        </button>

                        {/* Dropdown Popover Edit Status */}
                        {activeEditingOrderId === order.id && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-20 py-2 flex flex-col">
                            <span className="text-[10px] text-on-surface-variant font-extrabold uppercase tracking-wider px-3.5 py-1.5 border-b border-outline-variant/30">
                              Pilih Status Baru
                            </span>
                            {STATUS_STEPS.map((step) => (
                              <button
                                key={step.id}
                                onClick={() => handleUpdateStatus(order.id, step.id)}
                                className="w-full text-left px-3.5 py-2 text-label-sm font-semibold hover:bg-surface-container text-on-surface transition-colors"
                              >
                                {step.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* TAMPILAN KOSONG (EMPTY STATE) */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                {statusFilter || isPanelFilterActive ? <EmptyFilterIllustration /> : <EmptyOrdersIllustration />}
                <div className="max-w-xs">
                  <h4 className="text-subtitle font-sans font-extrabold text-primary">
                    {statusFilter || isPanelFilterActive
                      ? `Belum Ada Pesanan Yang Cocok`
                      : 'Belum Ada Pesanan'}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant/80 mt-1.5 font-medium leading-relaxed">
                    {statusFilter || isPanelFilterActive
                      ? 'Silahkan cek status pesanan atau filter yang lain dulu...'
                      : 'Silahkan tambah pesanan terlebih dahulu...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* B. KOLOM KANAN: Widgets */}
          <div className="flex flex-col gap-6">
            
            {/* Widget 1: Pencarian Interaktif dengan Menu Saran (Search Menu.png) */}
            <div ref={searchContainerRef} className="relative w-full">
              <input
                type="text"
                placeholder="Cari pesanan, pelanggan..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-4 pr-11 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
              <Icon
                name="search"
                size={20}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/85"
              />

              {/* Menu Suggestion Box (Search Menu.png) */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl p-4.5 flex flex-col gap-4 animate-scale-in">
                  {/* Bagian Pencarian Baru-baru Ini */}
                  <div className="flex flex-col gap-2">
                    <span className="text-label-sm font-bold text-on-surface-variant/60">Pencarian baru-baru ini</span>
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(term)
                          setIsSearchFocused(false)
                        }}
                        className="w-full flex items-center gap-3 py-1 text-label-md font-semibold text-on-surface hover:text-primary text-left bg-transparent border-0 outline-none cursor-pointer"
                      >
                        <Icon name="history" size={18} className="text-on-surface-variant/70" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>

                  {/* Pembatas Teks */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-outline-variant/40"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-wider">
                      Pesanan Terbaru
                    </span>
                    <div className="flex-grow border-t border-outline-variant/40"></div>
                  </div>

                  {/* Bagian Pesanan Terbaru di Suggestion */}
                  <div className="flex flex-col gap-2.5">
                    {recentSearchOrders.map((ord) => (
                      <button
                        key={ord.id}
                        onClick={() => {
                          setSearchQuery(ord.id)
                          setIsSearchFocused(false)
                        }}
                        className="w-full flex items-center justify-between py-1 bg-transparent border-0 outline-none cursor-pointer hover:bg-surface-container rounded-lg px-2 -mx-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ord.bg}`}>
                            <Icon name={ord.icon} size={16} />
                          </span>
                          <span className="text-label-sm font-bold text-on-surface">{ord.id}</span>
                        </div>
                        <span className="text-label-sm font-semibold text-on-surface-variant/70 font-mono">{ord.weight}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

             {/* Widget 2: Total Pesanan Status Card */}
             <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
               <h3 className="text-subtitle font-sans font-bold text-on-surface">
                 Total Pesanan
               </h3>
               <div className="flex flex-col divide-y divide-outline-variant/20 overflow-y-auto max-h-[300px] pr-1.5 custom-scrollbar">
                 {STATUS_STEPS.map((stat, idx) => {
                   const colors = {
                     menunggu: 'bg-outline-variant/50 text-outline',
                     dicuci: 'bg-primary-container text-primary',
                     dikeringkan: 'bg-secondary-container text-secondary',
                     disetrika: 'bg-tertiary-container text-tertiary',
                     siap_diambil: 'bg-success-container text-success',
                     diantar: 'bg-accent-container text-accent',
                     selesai: 'bg-secondary-fixed-dim text-secondary',
                     dibatalkan: 'bg-error-container text-error',
                   }
                   const colorClass = colors[stat.id] || 'bg-surface-container-low text-on-surface-variant/80'
                   
                   return (
                     <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                       <div className="flex items-center gap-3">
                         <span className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                           <Icon name={stat.icon} size={18} />
                         </span>
                         <span className="text-label-md text-on-surface font-semibold">{stat.label}</span>
                       </div>
                       <span className="text-label-md font-extrabold text-on-surface">{getStatusCount(stat.id)}</span>
                     </div>
                   )
                 })}
               </div>
             </div>

            {/* Widget 3: Pesan Terbaru Chat */}
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
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[190px] pr-1.5 custom-scrollbar">
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

            {/* Widget 4: Tombol Tambah Pesanan (Besar) */}
            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#b9eaff] hover:bg-[#a6e2fc] active:bg-[#8dd8f9] text-[#004d62] font-sans font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98]"
            >
              <Icon name="add" size={20} />
              <span>Tambah Pesanan</span>
            </button>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL DIALOG: Centered Tambah Pesanan Baru (Tambah Pesan.png) */}
      {/* ========================================================================= */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/40 backdrop-blur-xs">
          {/* Backdrop klik untuk tutup */}
          <div
            className="absolute inset-0"
            onClick={() => setIsAddDrawerOpen(false)}
          />

          {/* Konten Modal Box */}
          <div className="relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-scale-in max-h-[85vh] overflow-y-auto custom-scrollbar">
            {/* Header: Back arrow & Title */}
            <div className="flex items-center gap-3 pb-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddDrawerOpen(false)}
                className="hover:bg-surface-container rounded-lg cursor-pointer text-on-surface flex items-center justify-center p-1"
                aria-label="Kembali"
              >
                <Icon name="arrow_back_ios" size={16} />
              </button>
              <h3 className="text-title font-sans font-bold text-on-surface text-lg">Tambah Pesanan</h3>
            </div>

            <form onSubmit={handleSaveNewOrder} className="flex flex-col gap-6">
              
              {/* Field 0: Nama Pelanggan */}
              <div className="flex flex-col gap-2">
                <span className="text-body-md font-sans font-bold text-on-surface">Nama Pelanggan</span>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama pelanggan"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="bg-transparent border border-[#cbdff7] focus:border-primary rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none placeholder:text-outline/40 shadow-sm"
                />
              </div>

              {/* Field 1: Layanan Utama (tambah pesanan1 (2).png) */}
              <div className="flex flex-col gap-3">
                <h4 className="text-body-md font-sans font-bold text-on-surface">Layanan utama</h4>
                <div className="flex items-center justify-between py-1">
                  <span className="text-body-md text-on-surface font-medium">Cuci Kiloan</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Masukkan Kilogram"
                    value={kiloanWeight}
                    onChange={(e) => setKiloanWeight(e.target.value)}
                    className="w-44 bg-transparent border border-[#cbdff7] focus:border-primary rounded-xl px-4 py-2 text-right font-semibold text-primary placeholder:text-primary/45 focus:outline-none shadow-sm [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Field 2: Layanan Tambahan (tambah pesanan1 (2).png) */}
              <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-4">
                <h4 className="text-body-md font-sans font-bold text-on-surface">Layanan Tambahan</h4>
                
                <div className="flex flex-col gap-5">
                  {/* 1. Selimut */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-label-md font-bold text-on-surface">Selimut</span>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Selimut Kecil</span>
                      <QuantityInput
                        value={additionalQty.selimutKecil}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, selimutKecil: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Selimut Besar</span>
                      <QuantityInput
                        value={additionalQty.selimutBesar}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, selimutBesar: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                  </div>

                  {/* 2. Sprei */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-label-md font-bold text-on-surface">Sprei</span>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Sprei Kecil</span>
                      <QuantityInput
                        value={additionalQty.spreiKecil}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, spreiKecil: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Sprei Besar</span>
                      <QuantityInput
                        value={additionalQty.spreiBesar}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, spreiBesar: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                  </div>

                  {/* 3. Bantal */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-label-md font-bold text-on-surface">Bantal</span>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Bantal Kecil</span>
                      <QuantityInput
                        value={additionalQty.bantalKecil}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, bantalKecil: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Bantal Besar</span>
                      <QuantityInput
                        value={additionalQty.bantalBesar}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, bantalBesar: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                  </div>

                  {/* 4. Boneka */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-label-md font-bold text-on-surface">Boneka</span>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Bantal Kecil</span>
                      <QuantityInput
                        value={additionalQty.bonekaKecil}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, bonekaKecil: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Bantal Besar</span>
                      <QuantityInput
                        value={additionalQty.bonekaBesar}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, bonekaBesar: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                  </div>

                  {/* 5. Bed Cover */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-label-md font-bold text-on-surface">Bed Cover</span>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Bantal Kecil</span>
                      <QuantityInput
                        value={additionalQty.bedCoverKecil}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, bedCoverKecil: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Bantal Besar</span>
                      <QuantityInput
                        value={additionalQty.bedCoverBesar}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, bedCoverBesar: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                  </div>

                  {/* 6. Karpet */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-label-md font-bold text-on-surface">Karpet</span>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Karpet Kecil</span>
                      <QuantityInput
                        value={additionalQty.karpetKecil}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, karpetKecil: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                      <span>Karpet Besar</span>
                      <QuantityInput
                        value={additionalQty.karpetBesar}
                        onChange={(newVal) => setAdditionalQty((prev) => ({ ...prev, karpetBesar: newVal }))}
                        className="bg-[#eaf5f8] border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Harga Breakdown (tambah pesanan1 (1).png) */}
              {(() => {
                const { selected, totalSum } = calculateCurrentServices()
                if (selected.length === 0) return null

                return (
                  <div className="flex flex-col gap-3 border-t border-outline-variant/20 pt-4 animate-fade-in">
                    <h4 className="text-body-md font-sans font-bold text-on-surface">Total harga</h4>
                    <div className="flex flex-col gap-2 bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/20">
                      {selected.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-body-md text-on-surface font-medium">
                          <span>{item.name}</span>
                          <span className="font-mono">{item.price.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-outline-variant/30 pt-2 mt-1 text-body-md font-bold text-on-surface">
                        <span>Total</span>
                        <span className="text-primary font-mono">{totalSum.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Action Buttons (tambah pesanan1 (1).png) */}
              <div className="border-t border-outline-variant/20 pt-4 flex">
                <button
                  type="submit"
                  className="w-full bg-[#b9eaff] hover:bg-[#a6e2fc] active:bg-[#8dd8f9] text-[#004d62] font-sans font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] text-center"
                >
                  Tambahkan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
