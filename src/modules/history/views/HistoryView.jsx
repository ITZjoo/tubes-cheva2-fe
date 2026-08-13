import { useEffect, useRef, useState } from 'react'
import Typography from '../../../components/ui/Typography'
import Icon from '../../../components/ui/Icon'
import DatePicker from '../../../components/ui/DatePicker'
import TeleportPanel from '../../../components/ui/TeleportPanel'
import SearchMenuPopover from '../../../components/ui/SearchMenuPopover'
import FilterPopover from '../../../components/ui/FilterPopover'
import PageShell from '../../../components/ui/PageShell'
import useSidebarNavigate from '../../../routes/useSidebarNavigate'
import HistoryListItem from '../component/HistoryListItem'
import HistoryEmptyState from '../component/HistoryEmptyState'
import { getHistory } from '../services/historyService'

export default function HistoryView() {
  const handleSidebarNavigate = useSidebarNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [filters, setFilters] = useState({ statuses: [], services: [] })
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const dateButtonRef = useRef(null)

  const [historyItems, setHistoryItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  // Re-fetch whenever search, date, or filters change. Debounced so typing
  // in the search box doesn't fire a request on every keystroke.
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setErrorMessage(null)

    const timeoutId = setTimeout(() => {
      getHistory({
        search: searchQuery || undefined,
        startDate: selectedDate ? selectedDate.toISOString().slice(0, 10) : undefined,
        statuses: filters.statuses,
        services: filters.services,
      })
        .then((result) => {
          if (cancelled) return
          // `result` is either the array directly, or { data, pagination }
          // depending on whether the backend paginates this endpoint.
          setHistoryItems(Array.isArray(result) ? result : result?.data ?? [])
        })
        .catch((error) => {
          if (cancelled) return
          setErrorMessage(error.message || 'Gagal memuat riwayat')
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [searchQuery, selectedDate, filters])

  return (
    <PageShell
      activeItemId="history"
      onItemClick={handleSidebarNavigate}
      mainClassName="p-6 md:p-8 font-body max-w-[1400px] mx-auto flex flex-col gap-6"
    >
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

            <button
              ref={dateButtonRef}
              type="button"
              onClick={() => setDatePickerOpen((prev) => !prev)}
              className="bg-surface-container-lowest border border-outline-variant px-4 py-2.5 rounded-xl text-label-sm font-bold flex items-center gap-2.5 hover:bg-surface-container transition-all shadow-sm text-on-surface hover:scale-[1.02] cursor-pointer"
            >
              <Icon name="calendar_today" size={18} className="text-primary" />
              <span>
                {selectedDate
                  ? selectedDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                  : 'Pilih periode'}
              </span>
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
          </div>

          <FilterPopover onApply={setFilters} />
        </div>

        <div className="min-h-[708px] rounded-2xl bg-surface-container-lowest border border-outline-variant p-6 shadow-sm">
          {errorMessage ? (
            <Typography variant="body-md" className="py-16 text-center text-error">
              {errorMessage}
            </Typography>
          ) : isLoading ? (
            <Typography variant="body-md" className="py-16 text-center text-on-surface-variant">
              Memuat riwayat...
            </Typography>
          ) : historyItems.length === 0 ? (
            <HistoryEmptyState />
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant">
              {historyItems.map((item) => (
                <HistoryListItem key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
    </PageShell>
  )
}