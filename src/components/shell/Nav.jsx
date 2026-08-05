import { useEffect, useState } from 'react'
import { scrollToId } from '../../lib/useLenis'
import Mark from './Mark'

const CHANNELS = [
  { id: 'signal', label: 'Approach' },
  { id: 'voxa', label: 'Voxa' },
  { id: 'work', label: 'Work' },
  { id: 'instruments', label: 'Stack' },
  { id: 'trace', label: 'Path' },
]

export default function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setCondensed(y > 80)
      const max = document.body.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, y / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Which movement is on screen — drives the channel indicator
  useEffect(() => {
    const sections = CHANNELS.map((c) => document.getElementById(c.id)).filter(Boolean)
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-settle ease-signal ${
        condensed ? 'border-b border-edge bg-void/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
        <button
          onClick={() => scrollToId('top')}
          data-reticle
          className="flex items-center gap-2.5 text-left"
          aria-label="Back to top"
        >
          <Mark className="h-4 w-7 shrink-0 text-signal" />
          {/* the name yields to the channel list on narrow screens */}
          <span className="hidden font-mono text-micro uppercase tracking-[0.18em] text-ink sm:inline">
            Amir Hamza Khan
          </span>
        </button>

        {/* Scrollable on mobile rather than hidden — the page is long, and
            leaving phones with no way to jump is a usability failure. */}
        <nav
          className="-mx-1 flex flex-1 items-center gap-0.5 overflow-x-auto px-1 md:flex-none md:justify-center md:gap-1 md:overflow-visible [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
          aria-label="Sections"
        >
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollToId(c.id)}
              data-reticle
              className={`shrink-0 px-2.5 py-1.5 font-mono text-micro uppercase tracking-[0.1em] transition-colors duration-attack md:px-3 md:tracking-[0.12em] ${
                active === c.id ? 'text-signal' : 'text-mute hover:text-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </nav>

        {/* The eight-second visitor is real. Résumé is reachable from any scroll position. */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          data-reticle
          className="rounded-chip border border-edge px-3 py-1.5 font-mono text-micro uppercase tracking-[0.12em] text-dim transition-colors duration-attack hover:border-signal hover:text-signal"
        >
          Résumé
        </a>
      </div>

      {/* scroll position as a signal trace */}
      <div className="h-px w-full bg-edge/60">
        <div
          className="h-px bg-signal transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  )
}
