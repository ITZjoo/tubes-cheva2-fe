import Typography from '../../../components/ui/Typography'
import Divider from '../../../components/ui/Divider'
import StatusBadge from '../../../components/ui/StatusBadge'

// `orderInfo` / `paymentInfo` are arrays of { label, value } rows so callers
// can control field order/labels without touching this component.
// `statusHistory` is an array of { date, time, status } sorted newest-first.
export default function HistoryDetailCard({
  code,
  customerName,
  changedAt,
  fromStatus,
  toStatus,
  orderInfo = [],
  statusHistory = [],
  paymentInfo = [],
  className = '',
}) {
  return (
    <div
      className={[
        'flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-[18px] shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header: kode transaksi + status berubah */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="label-md" className="block font-semibold text-on-surface">
            {code}
          </Typography>
          <Typography variant="label-sm" className="text-on-surface-variant">
            {customerName}
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <Typography variant="label-sm" className="text-on-surface-variant">
            {changedAt}
          </Typography>
          <span className="flex items-center gap-1.5 text-label-sm">
            <StatusBadge status={fromStatus} />
            <span className="text-on-surface-variant">→</span>
            <StatusBadge status={toStatus} />
          </span>
        </div>
      </div>

      <Divider />

      {/* 3 kolom: Informasi Pesanan / Riwayat Perubahan Status / Informasi Pesanan */}
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <Typography variant="label-md" className="font-semibold text-on-surface">
            Informasi Pesanan
          </Typography>
          {orderInfo.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <Typography variant="label-sm" className="text-on-surface-variant">
                {row.label}
              </Typography>
              <Typography variant="label-sm" className="text-right text-on-surface">
                {row.value}
              </Typography>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Typography variant="label-md" className="font-semibold text-on-surface">
            Riwayat Perubahan Status
          </Typography>
          <ul className="flex flex-col gap-2">
            {statusHistory.map((item, index) => (
              <li key={`${item.status}-${index}`} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <Typography variant="label-sm" className="block text-on-surface-variant">
                    {item.date} {item.time}
                  </Typography>
                  <Typography variant="label-sm" className="text-on-surface">
                    {item.status}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Typography variant="label-md" className="font-semibold text-on-surface">
            Informasi Pesanan
          </Typography>
          {paymentInfo.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2">
              <Typography variant="label-sm" className="text-on-surface-variant">
                {row.label}
              </Typography>
              <Typography variant="label-sm" className="text-right text-on-surface">
                {row.value}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}