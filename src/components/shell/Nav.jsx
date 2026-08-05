import { useEffect, useState } from 'react'
import { scrollToId } from '../../lib/useLenis'

const LINKS = [
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'path', label: 'Path' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (vis) setActive(vis.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] }
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-mid ${
        solid ? 'border-b-2 border-ink bg-paper/95 backdrop-blur' : 'border-b-2 border-transparent'
      }`}
    >
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
        <button
          onClick={() => scrollToId('top')}
          className="mega shrink-0 text-[1.05rem] uppercase tracking-wide"
          aria-label="Back to top"
        >
          AHK<span className="text-blaze">.</span>
        </button>

        <nav
          className="-mx-1 flex flex-1 items-center justify-end gap-0.5 overflow-x-auto px-1 md:justify-center [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
          aria-label="Sections"
        >
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className={`shrink-0 px-3 py-1.5 font-ui text-[0.78rem] font-semibold uppercase tracking-wider transition-colors duration-fast ${
                active === l.id ? 'text-blaze' : 'text-ink2 hover:text-ink'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 border-2 border-ink px-3 py-1.5 font-ui text-[0.75rem] font-semibold uppercase tracking-wider transition-all duration-fast ease-snap hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard sm:block"
        >
          Résumé
        </a>
      </div>
    </header>
  )
}
