import { useMemo, useState } from 'react'
import Typography from '../../../components/ui/Typography'
import { DatePickerPopover } from '../../../components/ui/DatePicker'
import SearchMenuPopover from '../../../components/ui/SearchMenuPopover'
import FilterPopover from '../../../components/ui/FilterPopover'
import Sidebar from '../../../components/ui/Sidebar'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import HistoryListItem from '../component/HistoryListItem'
import HistoryEmptyState from '../component/HistoryEmptyState'

// TODO: replace with real data from historyService once the API/Supabase
// query is ready. Shape mirrors what HistoryListItem + HistoryDetailCard need.
const MOCK_HISTORY_ITEMS = [
  {
    id: 'trx-0501-1',
    code: 'TRX/0023400501',
    name: 'Rani Puspita',
    date: '22 Juni 2026',
    time: '15.30',
    changeFrom: 'Dikeringkan',
    changeTo: 'Disetrika',
    detail: {
      code: 'TRX/0023400501',
      customerName: 'Rani Puspita',
      changedAt: '22 Juni 2026 15:30',
      fromStatus: 'dikeringkan',
      toStatus: 'disetrika',
      orderInfo: [
        { label: 'No. Pesanan', value: 'TRX/0023400501' },
        { label: 'Pelanggan', value: 'Rani Puspita' },
        { label: 'No. Telp', value: '0812 3456 7891' },
        { label: 'Layanan', value: 'Cuci Kiloan + Selimut' },
        { label: 'Berat', value: '7.8 kg' },
        { label: 'Total', value: 'Rp. 74.600' },
      ],
      statusHistory: [
        { date: '22 Juni 2026', time: '15:30', status: 'Disetrika' },
        { date: '22 Juni 2026', time: '14:30', status: 'Dikeringkan' },
      ],
      paymentInfo: [
        { label: 'Metode Pembayaran', value: 'Tunai' },
        { label: 'Dibuat Pada', value: 'Rani Puspita' },
        { label: 'Terakhir Diubah', value: '0812 3456 7891' },
      ],
    },
  },
  {
    id: 'trx-0502-1',
    code: 'TRX/0023400502',
    name: 'Alberto',
    date: '22 Juni 2026',
    time: '18.00',
    changeFrom: 'Menunggu',
    changeTo: 'Dicuci',
  },
  {
    id: 'trx-0501-2',
    code: 'TRX/0023400501',
    name: 'Azzam',
    date: '22 Juni 2026',
    time: '20.00',
    changeFrom: 'Menunggu',
    changeTo: 'Dibatalkan',
  },
  {
    id: 'layanan-utama-1',
    code: 'Layanan Utama',
    name: 'Cuci Sepatu',
    date: '23 Juni 2026',
    time: '15.30',
    changeFrom: '25.000',
    changeTo: '20.000',
  },
  {
    id: 'layanan-tambahan-1',
    code: 'Layanan Tambahan',
    name: 'Selimut',
    date: '24 Juni 2026',
    time: '12.30',
    changeFrom: 'Menambahkan Selimut Sedang',
  },
  {
    id: 'trx-0504-1',
    code: 'TRX/0023400504',
    name: 'Abam',
    date: '23 Juni 2026',
    time: '15.30',
    changeFrom: 'Dicuci',
    changeTo: 'Dikeringkan',
  },
]

export default function HistoryView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [filters, setFilters] = useState({ statuses: [], services: [] })

  // TODO: move to a hook (useHistoryData) once this reads from the real
  // service instead of MOCK_HISTORY_ITEMS.
  const filteredItems = useMemo(() => {
    return MOCK_HISTORY_ITEMS.filter((item) => {
      const matchesQuery =
        !searchQuery ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.some((status) => [item.changeFrom, item.changeTo].join(' ').toLowerCase().includes(status))

      return matchesQuery && matchesStatus
    })
  }, [searchQuery, filters])

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar kiri, konsisten dengan DashboardView & OrderListView */}
      <Sidebar activeItemId="history" onItemClick={handleSidebarNavigate} />

      {/* Konten History di sisi kanan */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6">
        <div>
          <Typography variant="h2" className="text-on-surface">
            History
          </Typography>
          <Typography variant="body-lg" className="text-on-surface-variant">
            Riwayat aktivitas dan perubahan pada data pesanan.
          </Typography>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <SearchMenuPopover
              value={searchQuery}
              onChange={setSearchQuery}
              onSelectOrder={(order) => setSearchQuery(order.id)}
            />
            <DatePickerPopover value={selectedDate} onChange={setSelectedDate} placeholder="Pilih periode" />
          </div>

          <FilterPopover onApply={setFilters} />
        </div>

        <div className="min-h-[708px] rounded-2xl bg-surface-container-lowest border border-outline-variant p-6 shadow-sm">
          {filteredItems.length === 0 ? (
            <HistoryEmptyState />
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant">
              {filteredItems.map((item) => (
                <HistoryListItem key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}