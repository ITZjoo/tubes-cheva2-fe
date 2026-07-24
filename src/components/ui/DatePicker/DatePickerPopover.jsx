import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import DatePicker from './DatePicker'
import Icon from '../Icon'

function formatDate(date) {
  return date ? date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''
}

const GAP = 8

export default function DatePickerPopover({
  value = null,
  onChange,
  placeholder = 'Pilih tanggal',
  placement,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      const target = event.target
      const insideTrigger = triggerRef.current && triggerRef.current.contains(target)
      const insidePanel = panelRef.current && panelRef.current.contains(target)
      if (!insideTrigger && !insidePanel) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  // Renders the panel through a portal at `position: fixed` viewport
  // coordinates instead of nesting it in normal document flow, so it floats
  // above the page rather than overlapping whatever sits below the trigger.
  // Auto-flips to whichever side of the trigger actually has room, unless
  // `placement` forces a specific side.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return undefined

    const reposition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const panelRect = panelRef.current?.getBoundingClientRect()
      const panelHeight = panelRect?.height ?? 400
      const panelWidth = panelRect?.width ?? 369

      let vertical = placement ? (placement.startsWith('top') ? 'top' : 'bottom') : null
      let horizontal = placement ? (placement.endsWith('end') ? 'end' : 'start') : null

      if (!vertical) {
        const spaceBelow = window.innerHeight - triggerRect.bottom
        const spaceAbove = triggerRect.top
        vertical = spaceBelow >= panelHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top'
      }
      if (!horizontal) {
        const spaceRight = window.innerWidth - triggerRect.left
        horizontal = spaceRight >= panelWidth ? 'start' : 'end'
      }

      setStyle({
        position: 'fixed',
        top: vertical === 'bottom' ? triggerRect.bottom + GAP : undefined,
        bottom: vertical === 'top' ? window.innerHeight - triggerRect.top + GAP : undefined,
        left: horizontal === 'start' ? triggerRect.left : undefined,
        right: horizontal === 'end' ? window.innerWidth - triggerRect.right : undefined,
      })
    }

    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, placement])

  const handleChange = (date) => {
    onChange?.(date)
    setOpen(false)
  }

  return (
    <div ref={triggerRef} className={['inline-block', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-[41px] w-[149px] items-center gap-2 rounded-lg bg-surface-container-lowest px-3 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      >
        <span className="flex-1 truncate text-left text-body-md text-outline">
          {value ? formatDate(value) : placeholder}
        </span>
        <span className="h-3.5 w-px shrink-0 bg-outline-variant" aria-hidden="true" />
        <Icon name="calendar_add_on" size={20} className="shrink-0 text-outline" />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Pilih tanggal"
            className="z-20"
            style={style ?? { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }}
          >
            <DatePicker value={value} onChange={handleChange} defaultMonth={value ?? undefined} />
          </div>,
          document.body
        )}
    </div>
  )
}
