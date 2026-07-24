import Icon from '../Icon'

// The 8 order statuses from the laundry status-tracking spec, in flow order.
// `tone` maps to TONE_CLASSES below.
export const ORDER_STEPS = [
  { key: 'menunggu', label: 'Menunggu', icon: 'hourglass_top', tone: 'neutral' },
  { key: 'dicuci', label: 'Dicuci', icon: 'wash', tone: 'primary' },
  { key: 'dikeringkan', label: 'Dikeringkan', icon: 'dry_cleaning', tone: 'secondary' },
  { key: 'disetrika', label: 'Disetrika', icon: 'iron', tone: 'tertiary' },
  { key: 'siap_diambil', label: 'Siap Diambil', icon: 'shopping_basket', tone: 'success' },
  { key: 'diantar', label: 'Diantar', icon: 'moped', tone: 'accent' },
  { key: 'selesai', label: 'Selesai', icon: 'check_circle', tone: 'done' },
  { key: 'dibatalkan', label: 'Dibatalkan', icon: 'cancel', tone: 'error' },
]

const TONE_CLASSES = {
  neutral: { bg: 'bg-outline-variant', icon: 'text-outline', border: 'border-outline', pulse: 'bg-outline' },
  primary: { bg: 'bg-primary-container', icon: 'text-primary', border: 'border-primary', pulse: 'bg-primary' },
  secondary: {
    bg: 'bg-secondary-container',
    icon: 'text-secondary',
    border: 'border-secondary',
    pulse: 'bg-secondary',
  },
  tertiary: { bg: 'bg-tertiary-container', icon: 'text-tertiary', border: 'border-tertiary', pulse: 'bg-tertiary' },
  success: { bg: 'bg-success-container', icon: 'text-success', border: 'border-success', pulse: 'bg-success' },
  accent: { bg: 'bg-accent-container', icon: 'text-accent', border: 'border-accent', pulse: 'bg-accent' },
  done: { bg: 'bg-secondary-fixed-dim', icon: 'text-secondary', border: 'border-secondary', pulse: 'bg-secondary' },
  error: { bg: 'bg-error-container', icon: 'text-error', border: 'border-error', pulse: 'bg-error' },
}

export default function Stepper({ steps = ORDER_STEPS, current, onStepClick, className = '' }) {
  const currentIndex = steps.findIndex((step) => step.key === current)
  const interactive = typeof onStepClick === 'function'
  const Circle = interactive ? 'button' : 'span'

  return (
    <div
      role="list"
      aria-label="Status pesanan"
      className={['flex items-start', className].filter(Boolean).join(' ')}
    >
      {steps.map((step, index) => {
        const tone = TONE_CLASSES[step.tone] ?? TONE_CLASSES.neutral
        const isCurrent = index === currentIndex

        return (
          <div key={step.key} className="flex items-start">
            <div role="listitem" className="flex shrink-0 flex-col items-center gap-2">
              <span className="relative flex h-12 w-12 items-center justify-center">
                {isCurrent && (
                  <span aria-hidden="true" className={`absolute inset-0 animate-step-pulse rounded-full ${tone.pulse}`} />
                )}
                <Circle
                  type={interactive ? 'button' : undefined}
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={interactive ? () => onStepClick(step.key) : undefined}
                  className={[
                    'flex h-12 w-12 items-center justify-center rounded-full',
                    tone.bg,
                    interactive &&
                      'cursor-pointer transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Icon name={step.icon} size={24} className={tone.icon} />
                </Circle>
                {isCurrent && (
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-[2.25px] rounded-full border-[1.5px] ${tone.border}`}
                  />
                )}
              </span>
              <span className="text-label-sm whitespace-nowrap text-on-surface">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="mt-6 h-px w-16 shrink-0 border-t border-dashed border-outline"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
