import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon'

const TRANSITION_MS = 200

// Generic right-side sliding drawer — same controlled `open`/`onClose` shape
// as Modal, but anchored to the viewport edge with a slide + fade transition
// instead of a centered dialog. Rounded only on the left edge (rounded-l-lg)
// since the right edge sits flush against the screen, matching the mockups.
export default function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = 382,
  className = '',
  closeIcon = 'close',
}) {
  const [rendered, setRendered] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setRendered(true)
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
    const timeout = setTimeout(() => setRendered(false), TRANSITION_MS)
    return () => clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!rendered) return null

  return createPortal(
    <div
      role="presentation"
      className={['fixed inset-0 z-30 bg-on-surface/40 transition-opacity duration-200', visible ? 'opacity-100' : 'opacity-0']
        .filter(Boolean)
        .join(' ')}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        style={{ width }}
        className={[
          'fixed inset-y-0 right-0 flex flex-col rounded-l-lg bg-surface-container-lowest shadow-lg transition-transform duration-200 ease-out',
          visible ? 'translate-x-0' : 'translate-x-full',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex items-center gap-2.5 border-b border-outline-variant px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label={closeIcon === 'close' ? 'Tutup' : 'Kembali'}
            className="flex items-center"
          >
            <Icon name={closeIcon} size={24} className="text-on-surface" />
          </button>
          <span className="text-button text-on-surface">{title}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">{children}</div>

        {footer && <div className="border-t border-outline-variant px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
