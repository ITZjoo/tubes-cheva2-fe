import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const GAP = 8

// Shared anchored-dropdown primitive: renders `trigger` inline and, once
// open, portals `children` to `document.body` at `position: fixed`
// coordinates computed from the trigger's bounding rect. Portaling avoids
// clipping by `overflow:hidden` ancestors and z-index stacking issues that a
// nested `position: absolute` panel would run into.
export default function Popover({ trigger, children, align = 'start', matchTriggerWidth = false, className = '' }) {
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

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return undefined

    const reposition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const panelRect = panelRef.current?.getBoundingClientRect()
      const panelHeight = panelRect?.height ?? 0

      const spaceBelow = window.innerHeight - triggerRect.bottom
      const vertical = spaceBelow >= panelHeight || spaceBelow >= triggerRect.top ? 'bottom' : 'top'

      setStyle({
        position: 'fixed',
        top: vertical === 'bottom' ? triggerRect.bottom + GAP : undefined,
        bottom: vertical === 'top' ? window.innerHeight - triggerRect.top + GAP : undefined,
        left: align === 'start' ? triggerRect.left : undefined,
        right: align === 'end' ? window.innerWidth - triggerRect.right : undefined,
        width: matchTriggerWidth ? triggerRect.width : undefined,
      })
    }

    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, align, matchTriggerWidth])

  const toggle = () => setOpen((prev) => !prev)
  const show = () => setOpen(true)
  const hide = () => setOpen(false)

  return (
    <div ref={triggerRef} className={['relative inline-block', className].filter(Boolean).join(' ')}>
      {trigger({ open, toggle, show })}

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="z-20"
            style={style ?? { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }}
          >
            {children({ close: hide })}
          </div>,
          document.body
        )}
    </div>
  )
}
