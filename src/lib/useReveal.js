import { useEffect, useRef } from 'react'

/**
 * Reveal-on-enter, shared by every movement.
 *
 * One observer per mount point rather than one per element, and it
 * disconnects after the last child has fired — a portfolio is read top to
 * bottom, so there is no reason to keep watching content already seen.
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  // Fire as soon as an element edges into view. A strict threshold leaves a
  // band of invisible content just below the fold, which on a light ground
  // reads as a broken page rather than as content waiting to animate.
  const { selector = '.rv', stagger = 60, threshold = 0.02 } = options

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll(selector))
    if (!targets.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-on'))
      return
    }

    let remaining = targets.length
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = targets.indexOf(entry.target)
          const group = entry.target.closest('[data-reveal-group]')
          // stagger within a group only; standalone elements arrive immediately
          const delay = group ? (index % 8) * stagger : 0
          setTimeout(() => entry.target.classList.add('is-on'), delay)
          io.unobserve(entry.target)
          if (--remaining === 0) io.disconnect()
        })
      },
      { threshold, rootMargin: '0px 0px -48px 0px' }
    )

    targets.forEach((el) => io.observe(el))

    // Safety net: if anything prevents the observer from ever firing, the page
    // must not stay blank. Reveal whatever is still hidden after 2.5s.
    const failsafe = setTimeout(() => {
      targets.forEach((el) => el.classList.add('is-on'))
    }, 2500)

    return () => {
      clearTimeout(failsafe)
      io.disconnect()
    }
  }, [selector, stagger, threshold])

  return ref
}
