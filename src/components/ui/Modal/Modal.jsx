import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon'

// Generic centered modal shell — a controlled `open`/`onClose` primitive so
// any form (Tambah/Edit Layanan, confirmations, etc.) can compose its own
// fields as `children` instead of every screen hand-rolling its own
// `fixed inset-0` overlay. Chrome matches AddOrderPopover/FilterPopover's
// existing conventions (rounded-lg bg-surface-container-lowest shadow-lg,
// border-b/border-t outline-variant, bg-on-surface/40 backdrop) so it drops
// into the same visual language.
export default function Modal({ open, onClose, title, children, footer, className = '' }) {
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
        aria-label={typeof title === 'string' ? title : undefined}
        className={['flex max-h-[85vh] w-[382px] flex-col rounded-lg bg-surface-container-lowest shadow-lg', className]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex items-center justify-between gap-2.5 border-b border-outline-variant px-5 py-4">
          <span className="text-button text-on-surface">{title}</span>
          <button type="button" onClick={onClose} aria-label="Tutup" className="flex items-center">
            <Icon name="close" size={24} className="text-on-surface" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">{children}</div>

        {footer && <div className="border-t border-outline-variant px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
