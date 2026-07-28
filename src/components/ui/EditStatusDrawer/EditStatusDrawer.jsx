import Drawer from '../Drawer'
import Icon from '../Icon'
import { ORDER_STEPS, TONE_CLASSES } from '../Stepper'

// Order statuses run in a fixed sequence; everything up to and including the
// order's current status counts as "done" (checkmark + timestamp), the rest
// is "Belum proses". "dibatalkan" is a terminal branch, not a rung on that
// ladder, so it never marks earlier steps done and is only "done" itself.
function isStepDone(step, stepIndex, order, steps) {
  if (order.status === 'dibatalkan') return step.key === 'dibatalkan'
  const currentIndex = steps.findIndex((s) => s.key === order.status)
  return stepIndex <= currentIndex
}

export default function EditStatusDrawer({ open, onClose, order, onUpdateStatus, steps = ORDER_STEPS }) {
  return (
    <Drawer open={open} onClose={onClose} title="Edit Status Pesanan" closeIcon="close">
      {order && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/50">
              <Icon name="description" size={20} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-label-md font-bold text-on-surface">{order.id}</span>
              <span className="text-label-sm text-on-surface-variant">{order.customer}</span>
              <span className="text-label-sm text-on-surface-variant">{order.date}</span>
            </div>
          </div>

          <div className="rounded-xl bg-primary-container/20 p-4">
            <div className="flex items-center justify-between text-label-sm font-bold text-on-surface-variant">
              <span>Layanan</span>
              <span>Total</span>
            </div>
            <div className="mt-2 flex flex-col gap-1.5">
              {order.services.map((srv, index) => (
                <div key={index} className="flex items-center justify-between text-body-md text-on-surface">
                  <span>{srv.name}</span>
                  <span className="font-mono">{srv.price.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-outline-variant/30 pt-2 text-label-md font-bold text-on-surface">
              <span>Total</span>
              <span className="font-mono text-primary">{order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div>
            <span className="text-label-md font-bold text-on-surface">Progress Pesanan</span>
            <div className="mt-3 flex flex-col">
              {steps.map((step, index) => {
                const tone = TONE_CLASSES[step.tone] ?? TONE_CLASSES.neutral
                const done = isStepDone(step, index, order, steps)
                const isLast = index === steps.length - 1
                const timestamp = order.statusHistory?.[step.key]

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => onUpdateStatus?.(step.key)}
                        aria-label={`Set status ke ${step.label}`}
                        className={[
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 cursor-pointer',
                          tone.bg,
                        ].join(' ')}
                      >
                        <Icon name={done ? 'check' : step.icon} size={20} className={done ? 'text-primary' : tone.icon} />
                      </button>
                      {!isLast && (
                        <span aria-hidden="true" className="mt-1 min-h-8 w-px flex-1 border-l border-dashed border-outline" />
                      )}
                    </div>
                    <div className={['flex flex-col', !isLast && 'pb-6'].filter(Boolean).join(' ')}>
                      <span className="text-label-md font-bold text-on-surface pt-2">{step.label}</span>
                      <span className={done ? 'text-label-sm text-primary' : 'text-label-sm text-on-surface-variant'}>
                        {timestamp ?? 'Belum proses'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
