import { useEffect, useMemo, useState } from 'react'
import emptyTransactionsIllustration from '../../../assets/illustrations/empty-history.svg'
import PageShell from '../../../components/ui/PageShell'
import Icon from '../../../components/ui/Icon'
import RevenueChart from '../../../components/ui/Chart/RevenueChart'
import CatatPengeluaranDrawer from '../components/CatatPengeluaranDrawer'
import ExpenseDetailModal from '../components/ExpenseDetailModal'
import PendapatanFilterPopover, { EMPTY_PENDAPATAN_FILTERS } from '../components/PendapatanFilterPopover'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import * as pendapatanService from '../services/pendapatanService'
import { PAYMENT_METHOD_LABEL } from '../../../constants/paymentMethod'
import { EXPENSE_CATEGORY_LABEL, FUNDING_SOURCE_LABEL } from '../../../constants/expenseOptions'
import {
  getPeriodRange,
  getPreviousPeriodRange,
  sumAmount,
  percentChange,
  buildChartBucket,
} from '../utils/revenuePeriods'
import OrderDetailModal from '../../orders/components/OrderDetailModal'

const PERIODS = [
  { key: 'today', label: 'Hari ini' },
  { key: 'week', label: 'Minggu ini' },
  { key: 'month', label: 'Bulan ini' },
]

const PERIOD_COMPARISON_LABEL = {
  today: 'dari kemarin',
  week: 'dari minggu kemarin',
  month: 'dari bulan kemarin',
}

function formatRupiah(amount) {
  return `Rp. ${(amount ?? 0).toLocaleString('id-ID')}`
}

function formatDateTime(iso) {
  if (!iso) return '-'
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  return `${datePart}, ${timePart}`
}

// api.js's response interceptor unwraps the backend's { success, data,
// pagination? } envelope: when there's no `pagination`, it resolves straight
// to `data.data` (the raw array); when there IS pagination, it resolves to
// `{ data: data.data, pagination }`. listTransactions/listExpenses may hit
// either shape depending on whether that endpoint returns pagination, so
// normalize both here instead of assuming `.data` always exists.
function extractList(res) {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  return []
}

export default function PendapatanView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [period, setPeriod] = useState('today')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [transactions, setTransactions] = useState([])
  const [expenses, setExpenses] = useState([])
  const [prevTotals, setPrevTotals] = useState({ revenue: 0, expense: 0 })
  const [chartData, setChartData] = useState({ today: [], week: [], month: [] })

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState(EMPTY_PENDAPATAN_FILTERS)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedExpenseId, setSelectedExpenseId] = useState(null)

  const loadPeriod = async (activePeriod) => {
    setLoading(true)
    setError(null)
    try {
      const range = getPeriodRange(activePeriod)
      const prevRange = getPreviousPeriodRange(activePeriod)

      const [txRes, expRes, prevTxRes, prevExpRes] = await Promise.all([
        pendapatanService.listTransactions(range),
        pendapatanService.listExpenses(range),
        pendapatanService.listTransactions(prevRange),
        pendapatanService.listExpenses(prevRange),
      ])

      setTransactions(extractList(txRes))
      setExpenses(extractList(expRes))
      setPrevTotals({ revenue: sumAmount(extractList(prevTxRes)), expense: sumAmount(extractList(prevExpRes)) })
      setChartData((prev) => ({
        ...prev,
        [activePeriod]: buildChartBucket(activePeriod, extractList(txRes), extractList(expRes), range),
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPeriod(period)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const totalRevenue = useMemo(() => sumAmount(transactions), [transactions])
  const totalExpense = useMemo(() => sumAmount(expenses), [expenses])
  const totalNet = totalRevenue - totalExpense
  const prevNet = prevTotals.revenue - prevTotals.expense

  // Gabungkan transaksi (pemasukan) & pengeluaran jadi satu list riwayat,
  // diurutkan dari yang terbaru — sesuai tampilan panel kanan pada mockup.
  const entries = useMemo(() => {
    const incomeEntries = transactions.map((t) => ({ type: 'INCOME', date: t.paidAt ?? t.createdAt, data: t }))
    const expenseEntries = expenses.map((e) => ({ type: 'EXPENSE', date: e.spentAt ?? e.createdAt, data: e }))
    return [...incomeEntries, ...expenseEntries].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, expenses])

  const filteredEntries = entries.filter((entry) => {
    if (!filters.budgetTypes.includes(entry.type === 'INCOME' ? 'PEMASUKAN' : 'PENGELUARAN')) return false

    if (filters.dateRange?.from) {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      const from = new Date(filters.dateRange.from)
      from.setHours(0, 0, 0, 0)
      const to = new Date(filters.dateRange.to ?? filters.dateRange.from)
      to.setHours(23, 59, 59, 999)
      if (entryDate < from || entryDate > to) return false
    }

    if (entry.type === 'INCOME') {
      const t = entry.data
      const matchesSearch =
        !searchQuery ||
        t.order?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.order?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
      if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(t.paymentMethod)) return false
      if (
        filters.serviceTypes.length > 0 &&
        !filters.serviceTypes.some((service) => t.order?.serviceType === service || t.order?.items?.some((i) => i.serviceType === service))
      ) {
        return false
      }
      return true
    }

    // EXPENSE
    const e = entry.data
    const matchesSearch =
      !searchQuery ||
      e.expenseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (filters.expenseCategories.length > 0 && !filters.expenseCategories.includes(e.category)) return false
    return true
  })

  const handleDownloadReport = () => {
    const periodLabel = PERIODS.find((p) => p.key === period)?.label ?? period
    const header = ['No.', 'Jenis', 'Detail', 'Jumlah', 'Tanggal']
    const rows = filteredEntries.map((entry) => {
      if (entry.type === 'INCOME') {
        const t = entry.data
        return [
          t.order?.orderNumber ?? '',
          'Pemasukan',
          t.order?.customer?.name ?? '',
          t.amount,
          formatDateTime(t.paidAt ?? t.createdAt),
        ]
      }
      const e = entry.data
      return [
        e.expenseNumber ?? '',
        'Pengeluaran',
        EXPENSE_CATEGORY_LABEL[e.category] ?? e.category,
        -e.amount,
        formatDateTime(e.spentAt ?? e.createdAt),
      ]
    })
    const summary = [
      [],
      ['Total Pendapatan', totalRevenue],
      ['Total Pengeluaran', totalExpense],
      ['Total Bersih', totalNet],
    ]
    const csv = [header, ...rows, ...summary]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `laporan-pendapatan-${periodLabel.toLowerCase().replace(' ', '-')}-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const statCards = [
  {
    key: 'net',
    label: 'Total Bersih',
    value: totalNet,
    change: percentChange(totalNet, prevNet),
    icon: 'payments',
    bg: 'bg-[#FFDEA4]',
    iconColor: 'text-[#5D4200]',
  },
  {
    key: 'revenue',
    label: 'Total Pendapatan',
    value: totalRevenue,
    change: percentChange(totalRevenue, prevTotals.revenue),
    icon: 'payments',
    bg: 'bg-[#2D6A44]',
    iconColor: 'text-white',
  },
  {
    key: 'expense',
    label: 'Total Pengeluaran',
    value: totalExpense,
    change: percentChange(totalExpense, prevTotals.expense),
    icon: 'payments',
    bg: 'bg-[#930006]',
    iconColor: 'text-white',
  },
]

  return (
    <PageShell
      activeItemId="pendapatan"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
      <section className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Pendapatan</h2>
          <p className="text-body-md text-on-surface-variant">Kelola pendapatan laundry dan unduh laporan</p>
        </div>
        <button
          type="button"
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-primary text-on-primary font-sans font-bold py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow hover:brightness-95 active:scale-[0.98] shrink-0"
        >
          <Icon name="download" size={18} />
          <span className="text-label-md">Unduh Laporan</span>
        </button>
      </section>

      <section className="flex items-center rounded-xl border border-outline-variant bg-surface-container-lowest p-1 w-fit shadow-sm">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPeriod(key)}
            className={`px-4 py-2 rounded-lg text-label-sm font-bold transition-colors cursor-pointer ${
              period === key
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {label}
          </button>
        ))}
      </section>

      {error && <p className="text-body-sm text-error">{error}</p>}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <span className={`w-[70px] h-[70px] rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.iconColor}`}>
              <Icon name={card.icon} size={44} />
            </span>
            <div className="min-w-0">
              <p className="text-label-sm text-on-surface-variant font-semibold">{card.label}</p>
              <p className="text-lg font-extrabold text-on-surface font-mono truncate">{formatRupiah(card.value)}</p>
              {card.change !== null && (
                <p className={`text-xs font-bold ${card.change >= 0 ? 'text-success' : 'text-error'}`}>
                  {card.change >= 0 ? '+' : ''}
                  {card.change}% {PERIOD_COMPARISON_LABEL[period]}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <RevenueChart
            data={chartData}
            period={period}
            onPeriodChange={setPeriod}
            title="Grafik Pendapatan"
            showTabs={false}
            incomeLabel="Pemasukan"
            expenseLabel="Pengeluaran"
          />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4 min-h-[500px]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari pendapatan"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-4 pr-10 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all"
              />
              <Icon
                name="search"
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/85"
              />
            </div>

            <PendapatanFilterPopover value={filters} onApply={setFilters} />
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
              <span className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
              <p className="text-body-md text-on-surface-variant/70 font-semibold">Memuat transaksi...</p>
            </div>
          ) : filteredEntries.length > 0 ? (
            <div className="flex-1 flex flex-col gap-4 divide-y divide-outline-variant/25 overflow-y-auto custom-scrollbar">
              {filteredEntries.map((entry) =>
                entry.type === 'INCOME' ? (
                  <div key={`tx-${entry.data.id}`} className="pt-4 first:pt-0 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-label-md font-mono font-extrabold text-on-surface">
                          {entry.data.order?.orderNumber}
                        </span>
                        <span className="text-label-sm text-on-surface-variant/80 font-semibold">
                          {entry.data.order?.customer?.name}
                        </span>
                      </div>
                      <span className="text-label-sm font-bold text-primary font-mono shrink-0">
                        + {formatRupiah(entry.data.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-on-surface-variant/70 font-bold">
                        {formatDateTime(entry.data.paidAt ?? entry.data.createdAt)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-primary-container/45 px-2 py-0.5 text-[11px] font-bold text-primary">
                          {PAYMENT_METHOD_LABEL[entry.data.paymentMethod] ?? entry.data.paymentMethod}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(entry.data.orderId)}
                          className="text-label-sm font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 outline-none"
                        >
                          Lihat Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={`exp-${entry.data.id}`} className="pt-4 first:pt-0 flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-label-md font-mono font-extrabold text-on-surface">
                          {entry.data.expenseNumber ?? entry.data.id}
                        </span>
                        <span className="text-label-sm text-on-surface-variant/80 font-semibold">
                          {EXPENSE_CATEGORY_LABEL[entry.data.category] ?? entry.data.category}
                          {entry.data.description ? ` - ${entry.data.description}` : ''}
                        </span>
                      </div>
                      <span className="text-label-sm font-bold text-error font-mono shrink-0">
                        - {formatRupiah(entry.data.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-on-surface-variant/70 font-bold">
                        {formatDateTime(entry.data.spentAt ?? entry.data.createdAt)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-error/10 px-2 py-0.5 text-[11px] font-bold text-error">
                          {FUNDING_SOURCE_LABEL[entry.data.fundingSource] ?? entry.data.fundingSource}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedExpenseId(entry.data.id)}
                          className="text-label-sm font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 outline-none"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
              <img
                src={emptyTransactionsIllustration}
                alt="Belum ada transaksi"
                className="h-auto w-40 object-contain"
              />
              <div className="max-w-[220px]">
                <h4 className="text-subtitle font-sans font-extrabold text-primary">Belum ada transaksi...</h4>
                <p className="text-body-sm text-on-surface-variant/80 mt-1 font-medium leading-relaxed">
                  Belum ada pendapatan atau pengeluaran baru
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary font-sans font-bold py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow hover:brightness-95 active:scale-[0.98] shrink-0"
          >
            <Icon name="add" size={18} />
            <span className="text-label-sm">Catat Pengeluaran</span>
          </button>
        </div>
      </section>

      <CatatPengeluaranDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSaved={() => loadPeriod(period)}
      />

      <OrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      <ExpenseDetailModal expenseId={selectedExpenseId} onClose={() => setSelectedExpenseId(null)} />
    </PageShell>
  )
} 