import { useEffect, useRef } from 'react'

/**
 * Counts a number up when it scrolls into view.
 *
 * Writes straight to the DOM node — a per-frame setState on six of these
 * would re-render the page sixty times a second for no reason.
 */
export function useCountUp(target, { duration = 1400, decimals = 0, suffix = '', prefix = '' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fmt = (v) =>
      prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = fmt(target)
      return
    }

    el.textContent = fmt(0)
    let raf
    let started = false

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return
        started = true
        io.disconnect()
        const t0 = performance.now()
        const step = (now) => {
          const p = Math.min(1, (now - t0) / duration)
          // ease-out cubic — fast off the line, settles
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = fmt(target * eased)
          if (p < 1) raf = requestAnimationFrame(step)
          else el.textContent = fmt(target)
        }
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.3 }
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration, decimals, suffix, prefix])

  return ref
}
