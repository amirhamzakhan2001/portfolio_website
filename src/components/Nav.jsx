import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollSmoother, ScrollTrigger } from '../lib/motion'

const LINKS = [
  ['signal', 'Signal'],
  ['work', 'Work'],
  ['stack', 'Stack'],
  ['path', 'Path'],
  ['contact', 'Contact'],
]

/* Same destinations as the Contact channel list and the JSON-LD sameAs in
   index.html — keep all three in sync if a handle ever changes. */
const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/amirhamzakhan2001',
    viewBox: '0 0 16 16',
    path: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/amirhamzakhan032001',
    viewBox: '0 0 24 24',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z',
  },
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

        <div className="flex shrink-0 items-center gap-1">
          {SOCIALS.map(({ label, href, viewBox, path }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="rounded-ctl p-2 text-ink3 transition-colors duration-q hover:text-brand"
            >
              <svg viewBox={viewBox} className="h-[1.05rem] w-[1.05rem] fill-current" aria-hidden="true">
                <path d={path} />
              </svg>
            </a>
          ))}

          <a
            href="/Amir_Hamza_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1.5 hidden rounded-ctl border border-line2 px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-wide text-ink transition-colors duration-q hover:border-ink sm:block"
          >
            Resume
          </a>
        </div>
      </div>
      <div className="h-px w-full bg-line/60">
        <div ref={barRef} className="h-px origin-left scale-x-0 bg-brand" />
      </div>
    </header>
  )
}
