import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollSmoother, ScrollTrigger } from '../lib/motion'

const LINKS = [
  ['signal', 'Signal'],
  ['work', 'Work'],
  ['stack', 'Stack'],
  ['path', 'Path'],
  ['contact', 'Contact'],
]

/**
 * Lives outside #smooth-wrapper — ScrollSmoother transforms its content, so
 * anything position:fixed has to sit outside it or it drifts with the page.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')
  const barRef = useRef(null)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 'top -60',
      end: 99999,
      onToggle: (self) => setSolid(self.isActive),
    })
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(id),
      })
    })
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
  })

  const go = (id) => {
    const smoother = ScrollSmoother.get()
    const el = document.getElementById(id)
    if (!el) return
    if (smoother) smoother.scrollTo(el, true, 'top 80px')
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-m ${
        solid ? 'border-b border-line bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <button
          onClick={() => ScrollSmoother.get()?.scrollTo(0, true) ?? window.scrollTo(0, 0)}
          className="font-display text-[0.95rem] font-bold tracking-tight text-ink"
        >
          AHK<span className="text-brand">.</span>
        </button>

        <nav className="no-bar -mx-1 flex flex-1 items-center justify-end gap-0.5 overflow-x-auto px-1 md:justify-center" aria-label="Sections">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`shrink-0 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors duration-q ${
                active === id ? 'text-brand' : 'text-ink3 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <a
          href="/Amir_Hamza_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-ctl border border-line2 px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wide text-ink transition-colors duration-q hover:border-ink sm:block"
        >
          Résumé
        </a>
      </div>
      <div className="h-px w-full bg-line/60">
        <div ref={barRef} className="h-px origin-left scale-x-0 bg-brand" />
      </div>
    </header>
  )
}
