import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon'
import StatusBadge from '../StatusBadge'

// Reusable "Lihat Detail" popup — same 3-column layout (Informasi Pesanan /
// Riwayat Perubahan Status / Informasi Pembayaran) used by both History
// (data already in hand from the list) and Orders (fetched by id when the
// modal opens), so the layout only lives in one place. `fromStatus`/
// `toStatus` are FE status keys (StatusBadge tone keys), `orderInfo` /
// `paymentInfo` are [{ label, value }], `statusHistory` is
// [{ date, time, status }] sorted newest-first.
export default function OrderDetailModal({
  open,
  onClose,
  loading = false,
  error = null,
  code,
  customerName,
  changedAt,
  fromStatus,
  toStatus,
  orderInfo = [],
  statusHistory = [],
  paymentInfo = [],
}) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-30 flex items-center justify-center bg-on-surface/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Lihat Detail"
        className="flex max-h-[85vh] w-full max-w-[880px] flex-col rounded-2xl bg-surface-container-lowest shadow-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-6 py-4.5 shrink-0">
          {!loading && !error ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-label-lg font-mono font-extrabold text-on-surface">{code}</span>
                <span className="text-label-md text-on-surface-variant font-semibold">{customerName}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {changedAt && (
                  <span className="flex items-center gap-1 text-label-sm text-on-surface-variant/80 font-semibold">
                    <Icon name="schedule" size={14} />
                    {changedAt}
                  </span>
                )}
                {fromStatus && toStatus && (
                  <span className="flex items-center gap-1.5 text-label-sm font-semibold text-on-surface-variant">
                    <span>Status berubah:</span>
                    <StatusBadge status={fromStatus} />
                    <Icon name="arrow_forward" size={14} className="text-on-surface-variant/50" />
                    <StatusBadge status={toStatus} />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-button text-on-surface">Detail Pesanan</span>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors cursor-pointer shrink-0"
          >
            <Icon name="close" size={22} className="text-on-surface" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <span className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
              <p className="text-body-md text-on-surface-variant/70 font-semibold">Memuat detail pesanan...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Icon name="error" size={36} className="text-error" />
              <p className="text-body-md text-error font-semibold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="text-label-md font-extrabold text-on-surface uppercase tracking-wide">
                  Informasi Pesanan
                </h4>
                <dl className="flex flex-col gap-2.5">
                  {orderInfo.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <dt className="text-label-sm text-on-surface-variant/70 font-semibold">{row.label}</dt>
                      <dd className="text-body-sm text-on-surface font-semibold">{row.value ?? '-'}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-label-md font-extrabold text-on-surface uppercase tracking-wide">
                  Riwayat Perubahan Status
                </h4>
                {statusHistory.length > 0 ? (
                  <ul className="flex flex-col gap-4">
                    {statusHistory.map((item, idx) => (
                      <li key={idx} className="relative pl-5">
                        <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary" />
                        {idx < statusHistory.length - 1 && (
                          <span className="absolute left-[3px] top-3.5 bottom-[-16px] w-px bg-outline-variant" />
                        )}
                        <p className="text-body-sm font-bold text-on-surface">{item.status}</p>
                        <p className="text-label-sm text-on-surface-variant/70 font-semibold">
                          {item.date} {item.time}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body-sm text-on-surface-variant/70">Belum ada riwayat status.</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-label-md font-extrabold text-on-surface uppercase tracking-wide">
                  Informasi Pembayaran
                </h4>
                <dl className="flex flex-col gap-2.5">
                  {paymentInfo.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5">
                      <dt className="text-label-sm text-on-surface-variant/70 font-semibold">{row.label}</dt>
                      <dd className="text-body-sm text-on-surface font-semibold">{row.value ?? '-'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
