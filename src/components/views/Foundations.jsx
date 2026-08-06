import { useReveal } from '../../lib/useReveal'
import { FOUNDATIONS, PROGRESSION } from '../../data/projects'

/**
 * How the capability was built, in order.
 *
 * Most portfolios show only the newest work, which makes an engineer look
 * like they appeared fully formed. The route from Excel dashboards to
 * production AI is unusually legible here, and it is the clearest evidence
 * of the "data" half of a data/AI profile — so it gets its own panel.
 */
export default function Foundations() {
  const ref = useReveal()

  return (
    <section id="foundations" className="mt-4 scroll-mt-24" ref={ref}>
      <div className="rv panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Foundations</h2>
            <p className="mt-0.5 text-[0.72rem] text-ink3">
              How I got here — {FOUNDATIONS.length} earlier projects, newest first
            </p>
          </div>
          <span className="chip">2026 ← 2024</span>
        </div>

        {/* the arc */}
        <div className="border-b border-line px-5 py-5">
          <p className="lab mb-3">Progression</p>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
            {PROGRESSION.map((p, i) => (
              <div key={p.step} className="flex items-center gap-1.5">
                <span
                  className="flex items-center gap-2 rounded-ctl px-2.5 py-1.5"
                  style={{ background: `${p.color}14` }}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{ background: p.color }}
                    aria-hidden="true"
                  />
                  <span className="text-[0.78rem] font-semibold" style={{ color: p.color }}>
                    {p.step}
                  </span>
                  <span className="hidden font-mono text-[0.64rem] text-ink3 sm:inline">
                    {p.label}
                  </span>
                </span>
                {i < PROGRESSION.length - 1 && (
                  <span className="text-ink3" aria-hidden="true">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* the projects */}
        <ul className="divide-y divide-line">
          {FOUNDATIONS.map((f) => {
            const tone = PROGRESSION.find((p) => p.step === f.step)?.color || '#8A9099'
            return (
              <li
                key={f.title}
                className="grid items-start gap-x-5 gap-y-2 px-5 py-3.5 sm:grid-cols-[8.5rem_1fr_auto]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: tone }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[0.66rem] uppercase tracking-wide text-ink3">
                    {f.step}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-[0.9rem] font-semibold leading-snug text-ink">{f.title}</p>
                  <p className="mt-0.5 text-[0.78rem] text-ink2">{f.note}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                  {f.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chip transition-colors duration-q hover:border-brand hover:bg-brand-wash hover:text-brand"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                  <span className="tnum ml-1 font-mono text-[0.66rem] text-ink3">{f.year}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
