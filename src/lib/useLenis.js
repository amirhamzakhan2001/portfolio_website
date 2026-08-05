import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scroll authority for the whole site.
 *
 * One instance, exposed on window so anchor links and the nav can drive it
 * without prop-drilling a ref through every movement. Disabled outright for
 * anyone who has asked for reduced motion — smoothing is motion.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      // long tail, no bounce — matches the `signal` easing used everywhere else
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    window.__lenis = lenis

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
}

/** Scroll to a section id, honouring Lenis when it is running. */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
