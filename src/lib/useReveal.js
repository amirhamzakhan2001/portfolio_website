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
  const { selector = '.reveal', stagger = 70, threshold = 0.18 } = options

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
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [selector, stagger, threshold])

  return ref
}
