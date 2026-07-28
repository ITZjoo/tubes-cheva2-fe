import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const GAP = 4

// Portals `children` to `document.body` at `position: fixed` coordinates
// anchored to `anchorRef`, flipping above the anchor when there isn't room
// below. Unlike Popover, `open` is externally controlled (e.g. driven by an
// input's focus/typing state rather than a toggle button), so this only
// tracks positioning and (optionally) outside-click/Escape dismissal, not
// open/close state itself.
export default function TeleportPanel({ anchorRef, open, onClose, children, className = '' }) {
  const panelRef = useRef(null)
  const [style, setStyle] = useState(null)

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return undefined

    const reposition = () => {
      if (!anchorRef.current) return
      const anchorRect = anchorRef.current.getBoundingClientRect()
      const panelHeight = panelRef.current?.getBoundingClientRect().height ?? 0
      const spaceBelow = window.innerHeight - anchorRect.bottom
      const openUp = spaceBelow < panelHeight && anchorRect.top > spaceBelow

      setStyle({
        position: 'fixed',
        left: anchorRect.left,
        width: anchorRect.width,
        top: openUp ? undefined : anchorRect.bottom + GAP,
        bottom: openUp ? window.innerHeight - anchorRect.top + GAP : undefined,
      })
    }

    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)

    // `open` alone doesn't change when the panel swaps to taller content
    // (e.g. a short suggestion list turning into an add-new-item form), so
    // without this the stale up/down decision from the first, shorter
    // render can leave the panel positioned off-screen.
    const resizeObserver = new ResizeObserver(reposition)
    if (panelRef.current) resizeObserver.observe(panelRef.current)

    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
      resizeObserver.disconnect()
    }
  }, [open, anchorRef])

  // Outside-click/Escape dismissal, checked against both the anchor AND the
  // panel itself. The panel is portaled to document.body, so it's no longer
  // a DOM descendant of the anchor — an anchor-only contains() check would
  // treat clicks inside the panel (e.g. its own buttons) as "outside".
  useEffect(() => {
    if (!open || !onClose) return undefined
    const handlePointerDown = (event) => {
      const insideAnchor = anchorRef.current?.contains(event.target)
      const insidePanel = panelRef.current?.contains(event.target)
      if (!insideAnchor && !insidePanel) onClose()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return createPortal(
    <div
      ref={panelRef}
      className={['z-50', className].filter(Boolean).join(' ')}
      style={style ?? { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }}
    >
      {children}
    </div>,
    document.body
  )
}
