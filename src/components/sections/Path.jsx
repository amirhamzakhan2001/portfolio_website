import { useRef } from 'react'
import { gsap, useGSAP, revealChars, riseIn, reduced } from '../../lib/motion'
import { FOUNDATIONS, PROGRESSION } from '../../data/projects'
import { CERTIFICATIONS } from '../../data/certifications'

const ROWS = [
  {
    from: 'Feb 2026', to: 'Jul 2026',
    title: 'AI Engineer Intern', org: 'Eyas Ventures · Noida', kind: 'Work',
    body: 'Built Voxa — a multi-tenant voice AI platform with configurable STT, LLM and TTS per tenant — plus a no-code workflow automation builder and an embeddable AI website widget.',
  },
  {
    from: 'Oct 2025', to: 'Feb 2026',
    title: 'AI Model Evaluation Researcher', org: 'Outlier AI · remote', kind: 'Work',
    body: 'Evaluated LLM output against structured rubrics for factual accuracy, hallucination detection, faithfulness, instruction-following and safety compliance.',
  },
  {
    from: '2024', to: '2026',
    title: 'M.Sc. Artificial Intelligence & Machine Learning', org: 'Jamia Millia Islamia',
    kind: 'Study', highlight: 'CGPA 9.49 · Ranked 1st in class',
    body: 'Graduate study in AI and machine learning.',
  },
  {
    from: '2019', to: '2022',
    title: 'B.Sc. (Hons.) Applied Mathematics', org: 'Jamia Millia Islamia',
    kind: 'Study', highlight: 'CGPA 9.53 · Ranked 2nd in class',
    body: 'The mathematical foundation under everything since.',
  },
]

export default function Path() {
  const root = useRef(null)
  const headRef = useRef(null)
  const lineRef = useRef(null)

  useGSAP(
    () => {
      const splits = []
      splits.push(revealChars(headRef.current, { trigger: root.current }))
      riseIn('.path-row', { trigger: '.path-list', start: 'top 84%', stagger: 0.08 })
      riseIn('.found-row', { trigger: '.found-list', start: 'top 86%', stagger: 0.05, y: 22 })

      // the spine draws itself as you scroll the timeline
      if (!reduced() && lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: '.path-list',
              start: 'top 75%',
              end: 'bottom 70%',
              scrub: 0.6,
            },
          }
        )
      }

      return () => splits.forEach((s) => s?.revert?.())
    },
    { scope: root }
  )

  return (
    <section ref={root} id="path" className="stage border-t border-line py-[clamp(5rem,12vh,9rem)]">
      <div className="shell">
        <p className="stage-tag mb-6 text-st4">04 — Path</p>
        <h2 ref={headRef} className="kin max-w-[18ch] text-d1 text-ink">
          Analytics to production AI.
        </h2>

        {/* progression arc */}
        <div className="mt-12 flex flex-wrap items-center gap-x-2 gap-y-3">
          {PROGRESSION.map((p, i) => (
            <div key={p.step} className="flex items-center gap-2">
              <span
                className="flex items-center gap-2 rounded-ctl px-3 py-2"
                style={{ background: `${p.color}12` }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="font-display text-[0.85rem] font-bold" style={{ color: p.color }}>
                  {p.step}
                </span>
              </span>
              {i < PROGRESSION.length - 1 && <span className="text-ink3">→</span>}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {/* experience with drawn spine */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-[3px] top-2 hidden h-[calc(100%-1rem)] w-2 sm:block"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line x1="1" y1="0" x2="1" y2="100" stroke="#E2DDD1" strokeWidth="2" />
              <line ref={lineRef} x1="1" y1="0" x2="1" y2="100" stroke="#0B6E4F" strokeWidth="2" />
            </svg>

            <ol className="path-list flex flex-col sm:pl-8">
              {ROWS.map((r) => (
                <li key={r.title} className="path-row relative border-b border-line py-6 last:border-b-0">
                  <span className="absolute -left-8 top-8 hidden h-2 w-2 rounded-full bg-brand sm:block" />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="tnum font-mono text-[0.72rem] font-medium text-ink3">
                      {r.from} → {r.to}
                    </span>
                    <span className="chip">{r.kind}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[1.15rem] font-bold leading-snug text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-[0.72rem] text-ink3">{r.org}</p>
                  {r.highlight && (
                    <p className="mt-1 font-mono text-[0.72rem] font-medium text-brand">{r.highlight}</p>
                  )}
                  <p className="mt-2 max-w-prose text-[0.88rem] leading-relaxed text-ink2">{r.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10">
              <p className="eyebrow mb-4">Certifications</p>
              <ul className="flex flex-col gap-2">
                {CERTIFICATIONS.map((c) => {
                  const Row = c.url ? 'a' : 'div'
                  return (
                    <li key={c.name}>
                      <Row
                        {...(c.url ? { href: c.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={`group flex items-center justify-between gap-3 rounded-ctl border border-line bg-sheet px-4 py-3 ${
                          c.url ? 'transition-colors duration-q hover:border-brand' : ''
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-[0.88rem] font-medium text-ink">{c.name}</span>
                          <span className="mt-0.5 block font-mono text-[0.68rem] text-ink3">{c.issuer}</span>
                        </span>
                        {c.url && (
                          <span className="chip shrink-0 border-brand/30 text-brand">Verify ↗</span>
                        )}
                      </Row>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* foundations */}
          <div>
            <p className="eyebrow mb-5">Foundations · newest first</p>
            <ul className="found-list flex flex-col gap-3">
              {FOUNDATIONS.map((f) => {
                const tone = PROGRESSION.find((p) => p.step === f.step)?.color || '#6B6555'
                return (
                  <li key={f.title} className="found-row rounded-ctl border border-line bg-sheet px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-wide text-ink3">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
                        {f.step}
                      </span>
                      <span className="tnum font-mono text-[0.66rem] text-ink3">{f.year}</span>
                    </div>
                    <p className="mt-1.5 font-display text-[0.95rem] font-bold text-ink">{f.title}</p>
                    <p className="mt-0.5 text-[0.78rem] text-ink2">{f.note}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {f.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chip transition-colors duration-q hover:border-brand hover:text-brand"
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
