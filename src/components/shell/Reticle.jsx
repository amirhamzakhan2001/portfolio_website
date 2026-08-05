import { useEffect, useRef } from 'react'

/**
 * The cursor has exactly one job: framing.
 *
 * It is a measurement reticle, not a glowing blob. At rest it is a small
 * crosshair. Over anything marked [data-reticle] it expands to frame that
 * element's bounding box — the way a selection marquee works on an
 * instrument. Pointer-device only; touch gets nothing, because touch has no
 * hover and a fake cursor on a phone is a bug.
 */
export default function Reticle() {
  const boxRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const box = boxRef.current
    const dot = dotRef.current
    if (!box || !dot) return

    // current + target geometry, lerped every frame
    const cur = { x: 0, y: 0, w: 0, h: 0, o: 0 }
    const tgt = { x: 0, y: 0, w: 0, h: 0, o: 0 }
    let mouse = { x: -100, y: -100 }
    let framed = null
    let frame

    const onMove = (e) => {
      mouse = { x: e.clientX, y: e.clientY }
      const el = e.target.closest?.('[data-reticle]')
      framed = el || null
    }

    const tick = () => {
      if (framed) {
        const r = framed.getBoundingClientRect()
        const pad = 8
        tgt.x = r.left - pad
        tgt.y = r.top - pad
        tgt.w = r.width + pad * 2
        tgt.h = r.height + pad * 2
        tgt.o = 1
      } else {
        tgt.x = mouse.x - 9
        tgt.y = mouse.y - 9
        tgt.w = 18
        tgt.h = 18
        tgt.o = 0.55
      }

      const k = framed ? 0.22 : 0.34
      cur.x += (tgt.x - cur.x) * k
      cur.y += (tgt.y - cur.y) * k
      cur.w += (tgt.w - cur.w) * k
      cur.h += (tgt.h - cur.h) * k
      cur.o += (tgt.o - cur.o) * 0.2

      box.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      box.style.width = `${cur.w}px`
      box.style.height = `${cur.h}px`
      box.style.opacity = cur.o

      dot.style.transform = `translate3d(${mouse.x - 1.5}px, ${mouse.y - 1.5}px, 0)`
      dot.style.opacity = framed ? 0 : 1

      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden [@media(pointer:fine)]:block">
      <div
        ref={boxRef}
        className="absolute left-0 top-0 opacity-0"
        style={{ willChange: 'transform, width, height' }}
      >
        {/* four corner ticks — a frame, never a filled shape */}
        <span className="absolute left-0 top-0 h-2 w-px bg-signal" />
        <span className="absolute left-0 top-0 h-px w-2 bg-signal" />
        <span className="absolute right-0 top-0 h-2 w-px bg-signal" />
        <span className="absolute right-0 top-0 h-px w-2 bg-signal" />
        <span className="absolute bottom-0 left-0 h-2 w-px bg-signal" />
        <span className="absolute bottom-0 left-0 h-px w-2 bg-signal" />
        <span className="absolute bottom-0 right-0 h-2 w-px bg-signal" />
        <span className="absolute bottom-0 right-0 h-px w-2 bg-signal" />
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-signal" />
    </div>
  )
}
