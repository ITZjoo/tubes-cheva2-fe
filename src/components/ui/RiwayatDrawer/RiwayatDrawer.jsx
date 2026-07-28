import Drawer from '../Drawer'
import Icon from '../Icon'
import { ORDER_STEPS, TONE_CLASSES } from '../Stepper'

function findStep(key) {
  return ORDER_STEPS.find((step) => step.key === key) ?? ORDER_STEPS[0]
}

function HistoryRow({ entry, isLast }) {
  const step = findStep(entry.statusKey)
  const tone = TONE_CLASSES[step.tone] ?? TONE_CLASSES.neutral

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.bg}`}>
          <Icon name={step.icon} size={20} className={tone.icon} />
        </span>
        {!isLast && <span aria-hidden="true" className="mt-1 w-px flex-1 border-l border-dashed border-outline" />}
      </div>
      <div className={['flex-1 rounded-lg bg-surface-container-lowest px-4 py-3', !isLast && 'mb-3'].filter(Boolean).join(' ')}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-label-md font-bold text-on-surface">{step.label}</span>
          <span className="shrink-0 text-label-sm text-on-surface-variant">{entry.timestamp}</span>
        </div>
        {entry.description && <p className="mt-1 text-body-sm text-on-surface-variant">{entry.description}</p>}
      </div>
    </div>
  )
}

// Order-status history timeline, shown as a Drawer. `history` is a list of
// { statusKey, timestamp, description } entries in the order the order
// actually moved through ORDER_STEPS — statusKey/icon/color come from
// Stepper's ORDER_STEPS + TONE_CLASSES so the coloring always matches the
// same status the Stepper component shows elsewhere.
export default function RiwayatDrawer({ open, onClose, orderCode, history = [] }) {
  return (
    <Drawer open={open} onClose={onClose} title="Riwayat Pesanan">
      {orderCode && (
        <div className="mb-5 flex items-center gap-3 rounded-lg bg-primary-fixed/30 p-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-fixed/40">
            <Icon name="receipt_long" size={28} className="text-primary" />
          </span>
          <div>
            <span className="block text-label-sm text-on-surface-variant">Kode Pesanan</span>
            <span className="text-label-md font-bold text-on-surface">{orderCode}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {history.map((entry, index) => (
          <HistoryRow key={`${entry.statusKey}-${index}`} entry={entry} isLast={index === history.length - 1} />
        ))}
      </div>
    </Drawer>
  )
}
