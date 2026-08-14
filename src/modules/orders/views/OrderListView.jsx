import { useState, useRef, useEffect } from 'react'
import Icon from '../../../components/ui/Icon'
import PageShell from '../../../components/ui/PageShell'
import StatusBadge from '../../../components/ui/StatusBadge'
import Stepper from '../../../components/ui/Stepper'
import QuantityInput from '../../../components/ui/QuantityInput'
import Drawer from '../../../components/ui/Drawer'
import FilterDrawer from '../../../components/ui/FilterDrawer'
import EditStatusDrawer from '../../../components/ui/EditStatusDrawer'
import TeleportPanel from '../../../components/ui/TeleportPanel'
import OrderDetailModal from '../components/OrderDetailModal'
import QuickChatModal from '../../chat/components/QuickChatModal'
import PesanCepatCard from '../../chat/components/PesanCepatCard'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as orderService from '../services/orderService'
import * as customerService from '../../customers/services/customerService'
import * as serviceService from '../../products/services/productService'
import { BE_TO_FE } from '../utils/orderStatus'
import { PAYMENT_METHOD_LABEL } from '../../../constants/paymentMethod'
import { getConversations, replyToConversation } from '../../chat/services/chatService'

// Ilustrasi halaman kosong — sekarang pakai aset SVG asli, bukan inline SVG.
import emptyPesananIllustration from '../../../assets/illustrations/empty-pesanan.svg'
import emptyPesananFilterIllustration from '../../../assets/illustrations/empty-pesanan-filter.svg'

const ORDERS_PER_PAGE = 3
const ORDERS_FETCH_LIMIT = 200

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

function formatOrderDate(iso) {
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
  const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  return `${datePart} ${timePart}`
}

// Each backend Order carries exactly one Service (no line-item cart), so a
// "Tambah Pesanan" submission with several lines becomes several backend
// orders that share the same customer — this adapter renders one of them.
function mapOrderToDisplay(order) {
  const unit = order.service?.type === 'SATUAN' ? 'Pcs' : 'Kg'
  const qty = order.service?.type === 'SATUAN' ? order.itemCount : order.weight
  return {
    beId: order.id,
    beStatus: order.status,
    id: order.orderNumber,
    customer: order.customer?.name ?? '',
    customerId: order.customerId,
    date: formatOrderDate(order.createdAt),
    createdAt: new Date(order.createdAt),
    status: BE_TO_FE[order.status] ?? 'menunggu',
    services: [{ name: `${order.service?.name ?? 'Layanan'}${qty ? ` - ${qty} ${unit}` : ''}`, price: order.totalPrice }],
    total: order.totalPrice,
  }
}

export default function OrderListView() {
  const handleSidebarNavigate = useSidebarNavigate()
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const loadOrders = async () => {
    try {
      setOrdersLoading(true)
      const { data } = await orderService.listOrders({ limit: ORDERS_FETCH_LIMIT })
      setOrders(data.map(mapOrderToDisplay))
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // 2. States untuk Pencarian, Filter Stepper, & Filter Panel
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const searchContainerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [activeFilters, setActiveFilters] = useState({
    dateRange: { from: null, to: null },
    statuses: [],
    services: [],
    sortOrder: null,
  })

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, activeFilters])

  // 4. States Tambah Pesanan Drawer samping
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
  const [kiloanWeight, setKiloanWeight] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Katalog layanan real dari backend: layanan utama per-Kg (dipakai untuk
  // baris "Cuci Kiloan") dan layanan tambahan per-satuan (menggantikan daftar
  // 12 item hardcoded sebelumnya, biar sinkron dengan halaman Layanan).
  const [mainServices, setMainServices] = useState([])
  const [additionalServices, setAdditionalServices] = useState([])
  const [additionalQty, setAdditionalQty] = useState({})
  const [selectedMainServiceId, setSelectedMainServiceId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CASH')

  useEffect(() => {
    serviceService
      .listServices()
      .then((data) => {
        const mains = data.filter((s) => s.type !== 'SATUAN')
        const adds = data.filter((s) => s.type === 'SATUAN')
        setMainServices(mains)
        setAdditionalServices(adds)
        setSelectedMainServiceId((prev) => prev ?? mains[0]?.id ?? null)
      })
      .catch((err) => console.error('Failed to load service catalog', err))
  }, [])

  const mainService =
    mainServices.find((s) => s.id === selectedMainServiceId) ?? mainServices[0] ?? null

  // Pelanggan & pencarian/tambah pelanggan pada drawer Tambah Pesanan — dicari
  // langsung ke backend, bukan dari array lokal.
  const [customerResults, setCustomerResults] = useState([])
  const [customerQuery, setCustomerQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerSuggestOpen, setCustomerSuggestOpen] = useState(false)
  const [customerPanelMode, setCustomerPanelMode] = useState('list') // 'list' | 'add'
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [customerAddError, setCustomerAddError] = useState('')
  const customerFieldRef = useRef(null)

  const trimmedCustomerQuery = customerQuery.trim()

  useEffect(() => {
    if (!customerSuggestOpen || customerPanelMode !== 'list') return undefined
    const timeout = setTimeout(() => {
      customerService
        .listCustomers({ search: trimmedCustomerQuery || undefined, limit: 8 })
        .then(({ data }) => setCustomerResults(data))
        .catch((err) => console.error('Failed to search customers', err))
    }, 250)
    return () => clearTimeout(timeout)
  }, [trimmedCustomerQuery, customerSuggestOpen, customerPanelMode])

  const [editStatusOrderId, setEditStatusOrderId] = useState(null)
  const [editStatusOrderDetail, setEditStatusOrderDetail] = useState(null)

  useEffect(() => {
    if (editStatusOrderId === null) {
      setEditStatusOrderDetail(null)
      return
    }
    orderService
      .getOrder(editStatusOrderId)
      .then((order) => {
        const statusHistory = {}
        // Multiple backend statuses can map to the same FE step (e.g. PENDING
        // and PICKUP both show as "menunggu") — keep the earliest timestamp.
        ;[...order.statusHistories].forEach((entry) => {
          const feKey = BE_TO_FE[entry.status]
          if (feKey && !statusHistory[feKey]) {
            statusHistory[feKey] = new Date(entry.createdAt).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          }
        })
        setEditStatusOrderDetail({ ...mapOrderToDisplay(order), statusHistory })
      })
      .catch((err) => console.error('Failed to load order detail', err))
  }, [editStatusOrderId])

  // QuickChat: daftar percakapan + overlay — data dari GET /chat/conversations.
  const [conversations, setConversations] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false)

  useEffect(() => {
    getConversations()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setConversations(list)
        setActiveChatId((prev) => prev ?? list[0]?.id ?? null)
      })
      .catch((err) => console.error('Gagal memuat chat', err))
  }, [])

  const activeConversation = conversations.find((c) => c.id === activeChatId) ?? null
  // Widget "Pesan Cepat" cuma nampilin satu preview — prioritaskan yang
  // belum dibalas, fallback ke yang pertama.
  const featuredConversation = conversations.find((c) => !c.replied) ?? conversations[0] ?? null

  const openQuickChat = (conversationId) => {
    setActiveChatId(conversationId)
    setIsQuickChatOpen(true)
  }

  const handleSendReply = async (conversationId, replyText) => {
    try {
      await replyToConversation(conversationId, replyText)
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, replied: true, lastMessage: replyText } : c))
      )
    } catch (error) {
      console.error('Gagal mengirim balasan', error)
    }
  }

  const isPanelFilterActive =
    activeFilters.statuses.length > 0 ||
    activeFilters.services.length > 0 ||
    activeFilters.sortOrder !== null ||
    activeFilters.dateRange.from !== null ||
    activeFilters.dateRange.to !== null

  // "Jenis Layanan" filter options come from the real, admin-editable
  // service catalog instead of a fixed category list.
  const serviceFilterOptions = [...mainServices, ...additionalServices].map((s) => s.name)

  const selectCustomer = (customer) => {
    setCustomerQuery(customer.name)
    setSelectedCustomer(customer)
    setCustomerSuggestOpen(false)
    setCustomerPanelMode('list')
  }

  const openAddCustomerPanel = () => {
    setNewCustomerPhone('')
    setCustomerAddError('')
    setCustomerPanelMode('add')
  }

  const handleAddCustomer = async () => {
    const name = customerQuery.trim()
    const phone = newCustomerPhone.trim()
    if (!name || !phone) return
    setCustomerAddError('')
    try {
      const created = await customerService.createCustomer({ name, phone })
      setSelectedCustomer(created)
      setCustomerQuery(created.name)
      setCustomerSuggestOpen(false)
      setCustomerPanelMode('list')
    } catch (err) {
      setCustomerAddError(err.message)
    }
  }

  const closeCustomerPanel = () => {
    setCustomerSuggestOpen(false)
    setCustomerPanelMode('list')
  }

  const handleUpdateStatus = async (orderId, nextStatus) => {
    const target = orders.find((ord) => ord.beId === orderId) ?? editStatusOrderDetail
    if (!target) return
    try {
      await orderService.advanceStatus(orderId, target.beStatus, nextStatus)
      await loadOrders()
      setEditStatusOrderId(null)
    } catch (err) {
      window.alert(err.message)
    }
  }

  // Hitung baris layanan yang sedang dipilih di drawer Tambah Pesanan —
  // satu baris per layanan (Kiloan + tiap layanan tambahan dengan qty > 0).
  const calculateCurrentServices = () => {
    const selected = []
    let totalSum = 0

    const weightVal = parseFloat(kiloanWeight)
    if (weightVal > 0 && mainService) {
      const price = Math.round(weightVal * (mainService.pricePerKg ?? 0))
      selected.push({
        name: mainService.name,
        detail: `${mainService.name} - ${weightVal} Kg`,
        price,
        serviceId: mainService.id,
        weight: weightVal,
      })
      totalSum += price
    }

    additionalServices.forEach((service) => {
      const qty = additionalQty[service.id] ?? 0
      if (qty > 0) {
        const itemPrice = (service.priceUnit ?? 0) * qty
        selected.push({
          name: service.name,
          detail: `${service.name} - ${qty}`,
          price: itemPrice,
          serviceId: service.id,
          itemCount: qty,
        })
        totalSum += itemPrice
      }
    })

    return { selected, totalSum }
  }

  const resetAddDrawer = () => {
    setCustomerQuery('')
    setSelectedCustomer(null)
    setNewCustomerPhone('')
    setCustomerSuggestOpen(false)
    setCustomerPanelMode('list')
    setKiloanWeight('')
    setAdditionalQty({})
    setSubmitError('')
    setPaymentMethod('CASH')
  }

  // Satu order backend hanya boleh punya satu serviceId, jadi tiap baris
  // layanan yang dipilih di drawer dikirim sebagai order terpisah, semuanya
  // atas nama pelanggan yang sama.
  const handleSaveNewOrder = async () => {
    if (!selectedCustomer) {
      setSubmitError('Pilih atau tambahkan pelanggan terlebih dahulu.')
      return
    }

    const { selected } = calculateCurrentServices()
    if (selected.length === 0) {
      setSubmitError('Pilih minimal satu layanan.')
      return
    }

    setSubmitError('')
    setSubmitting(true)
    try {
      for (const line of selected) {
        await orderService.createOrder({
          customerId: selectedCustomer.id,
          serviceId: line.serviceId,
          weight: line.weight,
          itemCount: line.itemCount,
          paymentMethod,
        })
      }
      setIsAddDrawerOpen(false)
      resetAddDrawer()
      await loadOrders()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusCount = (statusKey) => orders.filter((ord) => ord.status === statusKey).length

  const filteredOrders = orders.filter((ord) => {
    const matchesStepper = statusFilter ? ord.status === statusFilter : true

    const matchesPanelStatus =
      activeFilters.statuses.length > 0 ? activeFilters.statuses.includes(ord.status) : true

    // Order line names are built as "<service name> - <qty> Kg/Pcs", so a
    // real service name always appears as a prefix.
    const matchesPanelService = (() => {
      if (activeFilters.services.length === 0) return true
      return ord.services.some((srv) =>
        activeFilters.services.some((label) => srv.name.startsWith(label))
      )
    })()

    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDateRange = (() => {
      const { from, to } = activeFilters.dateRange
      if (!from && !to) return true
      if (from) {
        const start = new Date(from)
        start.setHours(0, 0, 0, 0)
        if (ord.createdAt < start) return false
      }
      if (to) {
        const end = new Date(to)
        end.setHours(23, 59, 59, 999)
        if (ord.createdAt > end) return false
      }
      return true
    })()

    return matchesStepper && matchesPanelStatus && matchesPanelService && matchesSearch && matchesDateRange
  })

  const displayOrders = [...filteredOrders]
  if (activeFilters.sortOrder === 'asc') {
    displayOrders.sort((a, b) => a.customer.localeCompare(b.customer))
  } else if (activeFilters.sortOrder === 'desc') {
    displayOrders.sort((a, b) => b.customer.localeCompare(a.customer))
  }

  const totalPages = Math.max(1, Math.ceil(displayOrders.length / ORDERS_PER_PAGE))
  const paginatedOrders = displayOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  )

  const recentSearches = orders.slice(0, 4).map((ord) => ord.id)
  const recentSearchOrders = orders.slice(0, 4).map((ord) => {
    const iconByStatus = {
      menunggu: { icon: 'hourglass_empty', bg: 'bg-surface-container text-outline' },
      dicuci: { icon: 'local_laundry_service', bg: 'bg-info-container/30 text-info' },
      diantar: { icon: 'local_shipping', bg: 'bg-warning-container/30 text-warning' },
      selesai: { icon: 'check_circle', bg: 'bg-secondary-container text-secondary' },
    }
    const { icon, bg } = iconByStatus[ord.status] ?? { icon: 'description', bg: 'bg-surface-container text-outline' }
    return { id: ord.id, weight: ord.services[0]?.name ?? '', status: ord.status, icon, bg }
  })

  return (
    <PageShell
      activeItemId="pesanan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
        {/* 1. Bagian Atas: Stepper / Filter Status (Horizontal) */}
        <section className="shrink-0 bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm overflow-x-auto custom-scrollbar">
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

              <div className="relative">
                {isPanelFilterActive || statusFilter ? (
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-1.5 text-label-sm font-bold text-primary bg-primary-container/45 px-3 py-1.5 rounded-xl border border-primary/25 cursor-pointer hover:bg-primary-container/60 transition-colors"
                  >
                    <Icon name="filter_alt" size={16} />
                    <span>Filter Aktif</span>
                    <Icon name="close" size={16} className="text-primary/70" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-1.5 text-label-sm font-bold text-primary bg-transparent border-0 outline-none cursor-pointer hover:underline"
                  >
                    <Icon name="filter_list" size={16} />
                    <span>Filter</span>
                  </button>
                )}

                <FilterDrawer
                  open={isFilterDrawerOpen}
                  onClose={() => setIsFilterDrawerOpen(false)}
                  serviceOptions={serviceFilterOptions}
                  onApply={setActiveFilters}
                />
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
                <span className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
                <p className="text-body-md text-on-surface-variant/70 font-semibold">Memuat pesanan...</p>
              </div>
            ) : displayOrders.length > 0 ? (
              <div className="flex flex-col gap-6 divide-y divide-outline-variant/25">
                {paginatedOrders.map((order) => (
                  <div key={order.beId} className="pt-5 first:pt-0 flex flex-col gap-3.5 relative animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-label-md font-mono font-extrabold text-on-surface">{order.id}</span>
                        <span className="text-label-sm text-on-surface-variant/80 font-semibold">{order.customer}</span>
                      </div>

                      <StatusBadge status={order.status} />
                    </div>

                    <span className="text-xs text-on-surface-variant/70 font-bold -mt-2.5">{order.date}</span>

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

                    <div className="flex items-center justify-between mt-1">
                      <button
                        onClick={() => setSelectedOrderId(order.beId)}
                        className="text-label-sm font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 outline-none"
                      >
                        Lihat Detail
                      </button>

                      <button
                        onClick={() => setEditStatusOrderId(order.beId)}
                        className="border border-primary/20 bg-primary-container/45 hover:bg-primary-container/60 text-primary font-sans font-bold py-1.5 px-4 rounded-xl text-label-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] flex items-center gap-1"
                      >
                        <span>Edit Status</span>
                        <Icon name="arrow_drop_down" size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                <img
                  src={statusFilter || isPanelFilterActive ? emptyPesananFilterIllustration : emptyPesananIllustration}
                  alt={statusFilter || isPanelFilterActive ? 'Tidak ada pesanan yang cocok dengan filter' : 'Belum ada pesanan'}
                  className="w-48 h-40 mx-auto transition-transform duration-300 hover:scale-105"
                />
                <div className="flex flex-col items-center gap-2">
                  <h4
                    className="font-sans font-bold text-[28px] leading-none tracking-[-0.02em] text-center text-primary max-w-[342px]"
                  >
                    {statusFilter || isPanelFilterActive
                      ? `Belum Ada Pesanan Yang Cocok`
                      : 'Belum Ada Pesanan'}
                  </h4>
                  <p
                    className="font-sans font-medium text-[24px] leading-none tracking-normal text-center text-outline max-w-[298px]"
                  >
                    {statusFilter || isPanelFilterActive
                      ? 'Silahkan cek status pesanan atau filter yang lain dulu...'
                      : 'Silahkan tambah pesanan terlebih dahulu...'}
                  </p>
                </div>
              </div>
            )}

            {displayOrders.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-label-sm font-bold text-primary disabled:text-outline disabled:cursor-not-allowed cursor-pointer"
                >
                  <Icon name="chevron_left" size={18} />
                  Sebelumnya
                </button>
                <span className="text-label-sm font-semibold text-on-surface-variant">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-label-sm font-bold text-primary disabled:text-outline disabled:cursor-not-allowed cursor-pointer"
                >
                  Selanjutnya
                  <Icon name="chevron_right" size={18} />
                </button>
              </div>
            )}
          </div>

          {/* B. KOLOM KANAN: Widgets */}
          <div className="flex flex-col gap-6">

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

              {isSearchFocused && recentSearchOrders.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl p-4.5 flex flex-col gap-4 animate-scale-in">
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

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-outline-variant/40"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-extrabold text-on-surface-variant/50 uppercase tracking-wider">
                      Pesanan Terbaru
                    </span>
                    <div className="flex-grow border-t border-outline-variant/40"></div>
                  </div>

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
                        <span className="text-label-sm font-semibold text-on-surface-variant/70 font-mono truncate max-w-[140px]">
                          {ord.weight}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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

            {/* Pesan Cepat — sesuai spek Figma, cuma nampilin satu percakapan
                unggulan + tombol Jawab, bukan list scroll */}
            <PesanCepatCard
              conversation={featuredConversation}
              onLihatSemua={() => openQuickChat(conversations[0]?.id)}
              onJawab={() => openQuickChat(featuredConversation?.id)}
            />

            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-primary-container hover:bg-[#a6e2fc] active:bg-[#8dd8f9] text-on-primary-container font-sans font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98]"
            >
              <Icon name="add" size={20} />
              <span>Tambah Pesanan</span>
            </button>
          </div>

        </div>

      {/* ========================================================================= */}
      {/* 3. DRAWER: Tambah Pesanan Baru */}
      {/* ========================================================================= */}
      <Drawer
        open={isAddDrawerOpen}
        onClose={() => {
          setIsAddDrawerOpen(false)
          resetAddDrawer()
        }}
        title="Tambah Pesanan"
        closeIcon="chevron_left"
        footer={
          <button
            type="button"
            onClick={handleSaveNewOrder}
            disabled={submitting}
            className="w-full bg-primary-container hover:bg-[#a6e2fc] active:bg-[#8dd8f9] text-on-primary-container font-sans font-extrabold py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98] text-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Menyimpan...' : 'Tambahkan Pesanan'}
          </button>
        }
      >
        <div className="flex flex-col gap-6">

          <div className="relative" ref={customerFieldRef}>
            <span className="text-body-md font-sans font-bold text-on-surface">Nama Pelanggan</span>
            <input
              type="text"
              value={customerQuery}
              onChange={(e) => {
                setCustomerQuery(e.target.value)
                setSelectedCustomer(null)
                setCustomerPanelMode('list')
                setCustomerSuggestOpen(true)
              }}
              onFocus={() => setCustomerSuggestOpen(true)}
              placeholder="Cari atau masukkan nama pelanggan"
              className="mt-2 w-full bg-transparent border border-[#cbdff7] focus:border-primary rounded-xl px-4 py-2 text-body-md text-on-surface focus:outline-none placeholder:text-outline/40 shadow-sm"
            />

            <TeleportPanel
              anchorRef={customerFieldRef}
              open={
                customerSuggestOpen &&
                (customerPanelMode === 'add' || customerResults.length > 0 || Boolean(trimmedCustomerQuery))
              }
              onClose={closeCustomerPanel}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg"
            >
                {customerPanelMode === 'list' ? (
                  customerResults.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto custom-scrollbar">
                      {customerResults.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => selectCustomer(customer)}
                          className="block w-full px-4 py-2.5 text-left text-body-md text-on-surface hover:bg-surface-container-low"
                        >
                          {customer.name}
                        </button>
                      ))}
                    </div>
                  ) : trimmedCustomerQuery ? (
                    <button
                      type="button"
                      onClick={openAddCustomerPanel}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-body-md text-primary hover:bg-surface-container-low"
                    >
                      <Icon name="add" size={18} />
                      Tambah pelanggan baru
                    </button>
                  ) : null
                ) : (
                  <div className="flex flex-col gap-3 p-4">
                    <div>
                      <span className="text-label-sm font-bold text-on-surface">Nama Pelanggan</span>
                      <input
                        type="text"
                        value={customerQuery}
                        onChange={(e) => setCustomerQuery(e.target.value)}
                        placeholder="Masukkan nama pelanggan"
                        className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <span className="text-label-sm font-bold text-on-surface">No. Handphone</span>
                      <input
                        type="tel"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        placeholder="Masukkan nomor HP"
                        className="mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary"
                      />
                    </div>
                    {customerAddError && <p className="text-body-sm text-error">{customerAddError}</p>}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomerPanelMode('list')}
                        className="flex-1 rounded-lg border border-outline-variant py-2 text-label-sm text-outline"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCustomer}
                        disabled={!trimmedCustomerQuery || !newCustomerPhone.trim()}
                        className="flex-1 rounded-lg bg-primary py-2 text-label-sm text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                )}
            </TeleportPanel>
          </div>

              {/* Field 1: Layanan Utama */}
              {mainServices.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-body-md font-sans font-bold text-on-surface">Layanan utama</h4>
                  <div className="flex items-center justify-between gap-3 py-1">
                    <select
                      value={mainService?.id ?? ''}
                      onChange={(e) => setSelectedMainServiceId(Number(e.target.value))}
                      className="flex-1 bg-transparent border border-[#cbdff7] focus:border-primary rounded-xl px-3 py-2 text-body-md text-on-surface font-medium focus:outline-none shadow-sm"
                    >
                      {mainServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.pricePerKg ? `— Rp ${s.pricePerKg.toLocaleString('id-ID')}/kg` : ''}
                        </option>
                      ))}
                    </select>
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
              )}

              {/* Field 2: Layanan Tambahan — daftar flat dari katalog Layanan Tambahan real */}
              {additionalServices.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-4">
                  <h4 className="text-body-md font-sans font-bold text-on-surface">Layanan Tambahan</h4>
                  <div className="flex flex-col gap-2.5">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-body-md text-on-surface-variant font-medium pl-1">
                        <span>{service.name}</span>
                        <QuantityInput
                          value={additionalQty[service.id] ?? 0}
                          onChange={(newVal) =>
                            setAdditionalQty((prev) => ({ ...prev, [service.id]: newVal }))
                          }
                          className="bg-[#eaf5f8] border-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field 3: Metode Pembayaran */}
              <div className="flex flex-col gap-3 border-t border-outline-variant/20 pt-4">
                <h4 className="text-body-md font-sans font-bold text-on-surface">Metode Pembayaran</h4>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-transparent border border-[#cbdff7] focus:border-primary rounded-xl px-3 py-2 text-body-md text-on-surface font-medium focus:outline-none shadow-sm"
                >
                  {Object.entries(PAYMENT_METHOD_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Harga Breakdown */}
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

              {submitError && <p className="text-body-sm text-error">{submitError}</p>}

        </div>
      </Drawer>

      <EditStatusDrawer
        open={editStatusOrderId !== null}
        onClose={() => setEditStatusOrderId(null)}
        order={editStatusOrderDetail}
        onUpdateStatus={(statusKey) => handleUpdateStatus(editStatusOrderId, statusKey)}
      />

      <OrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />

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