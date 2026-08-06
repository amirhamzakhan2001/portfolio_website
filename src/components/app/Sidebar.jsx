import { useEffect, useState } from 'react'
import { scrollToId } from '../../lib/useLenis'

export const VIEWS = [
  { id: 'overview', label: 'Overview', glyph: '▤' },
  { id: 'projects', label: 'Projects', glyph: '◱' },
  { id: 'foundations', label: 'Foundations', glyph: '▟' },
  { id: 'skills', label: 'Capabilities', glyph: '▚' },
  { id: 'timeline', label: 'History', glyph: '↗' },
  { id: 'contact', label: 'Contact', glyph: '✉' },
]

export default function Sidebar() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const els = VIEWS.map((v) => document.getElementById(v.id)).filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (vis) setActive(vis.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.4, 1] }
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* ── desktop rail ── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-w)] flex-col border-r border-line bg-rail lg:flex">
        {/* identity */}
        <div className="border-b border-line p-4">
          <div className="flex items-center gap-3">
            <img
              src="/ahk_profile_pic.png"
              alt=""
              width="80"
              height="80"
              className="h-10 w-10 shrink-0 rounded-ctl border border-line object-cover object-top"
            />
            <div className="min-w-0">
              <p className="truncate text-sm2 font-semibold leading-tight text-ink">
                Amir Hamza Khan
              </p>
              <p className="truncate font-mono text-[0.66rem] uppercase tracking-wide text-ink3">
                AI / ML Engineer
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 rounded-ctl border border-ok/25 bg-okWash px-2 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" />
            <span className="font-mono text-[0.62rem] uppercase tracking-wide text-ok">
              Available for hire
            </span>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto p-2.5" aria-label="Sections">
          <p className="lab px-2 pb-2 pt-1">Workspace</p>
          <div className="flex flex-col gap-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => scrollToId(v.id)}
                aria-current={active === v.id ? 'true' : undefined}
                className={`nav-i ${active === v.id ? 'nav-i-on' : ''}`}
              >
                <span className="w-4 shrink-0 text-center text-[0.8rem] opacity-70" aria-hidden="true">
                  {v.glyph}
                </span>
                {v.label}
              </button>
            ))}
          </div>

          <p className="lab px-2 pb-2 pt-5">Environment</p>
          <dl className="flex flex-col gap-1.5 px-2">
            {[
              ['Location', 'New Delhi, IN'],
              ['Focus', 'Voice · RAG · Agents'],
              ['Education', 'M.Sc. AI/ML · 9.49'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-2">
                <dt className="font-mono text-[0.62rem] uppercase tracking-wide text-ink3">{k}</dt>
                <dd className="truncate text-[0.72rem] font-medium text-ink2">{v}</dd>
              </div>
            ))}
          </dl>
        </nav>

        {/* rail footer */}
        <div className="border-t border-line p-2.5">
          <a href="/Amir_Hamza_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn w-full">
            Download résumé
          </a>
          <div className="mt-2 flex items-center justify-between px-1">
            {[
              ['GH', 'https://github.com/amirhamzakhan2001'],
              ['IN', 'https://www.linkedin.com/in/amirhamzakhan032001'],
              ['@', 'mailto:amirhamzakhan2001@gmail.com'],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[0.66rem] uppercase tracking-wide text-ink3 transition-colors duration-q hover:text-brand"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* ── mobile: horizontal view switcher pinned under the top bar ── */}
      <nav
        className="no-bar fixed inset-x-0 top-[var(--top-h)] z-30 flex gap-1 overflow-x-auto border-b border-line bg-app/95 px-3 py-2 backdrop-blur lg:hidden"
        aria-label="Sections"
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => scrollToId(v.id)}
            className={`shrink-0 rounded-ctl px-3 py-1.5 text-[0.78rem] font-medium transition-colors duration-q ${
              active === v.id ? 'bg-brand-wash text-brand' : 'text-ink2'
            }`}
          >
            {v.label}
          </button>
        ))}
      </nav>
    </>
  )
}
