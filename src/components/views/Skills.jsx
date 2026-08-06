import StackBar from '../charts/StackBar'
import { useReveal } from '../../lib/useReveal'
import { CAPABILITY_GROUPS as GROUPS, CAPABILITY_TOTAL, CAPABILITY_PROD } from '../../data/capabilities'

/**
 * Capabilities, taken from the résumé's own four categories and wording.
 * Filled = used in shipped work. No self-graded percentages anywhere.
 */

export default function Skills() {
  const ref = useReveal()
  const total = CAPABILITY_TOTAL
  const prod = CAPABILITY_PROD

  return (
    <section id="skills" className="mt-4 scroll-mt-24" ref={ref}>
      <div className="rv panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Capabilities</h2>
            <p className="mt-0.5 text-[0.72rem] text-ink3">
              {total} tools · {prod} shipped to production
            </p>
          </div>
          {/* Explicit two-state key — a lone "filled = production" caption
              left people guessing what the outlined ones meant. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <span className="rounded-chip border border-transparent bg-brand px-1.5 py-[3px] text-[0.66rem] leading-none text-white">
                Aa
              </span>
              <span className="text-[0.72rem] text-ink2">Used in shipped work</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="rounded-chip border border-line bg-panel px-1.5 py-[3px] text-[0.66rem] leading-none text-ink2">
                Aa
              </span>
              <span className="text-[0.72rem] text-ink2">Working knowledge</span>
            </span>
          </div>
        </div>

        {/* distribution across the areas */}
        <div className="border-b border-line px-5 py-5">
          <p className="lab mb-3">Distribution by area</p>
          <StackBar
            series={GROUPS.map((g) => ({
              label: g.label,
              value: g.items.length,
              color: g.color,
            }))}
            height="h-6"
          />
        </div>

        {/* Column flow, not a grid. Groups have very uneven lengths, and a
            grid pads every short group out to the tallest row in its band —
            which was costing ~175px of dead space and made this section
            larger than Projects. */}
        <div className="gap-x-8 p-5 md:columns-2 xl:columns-3">
          {GROUPS.map((g) => {
            const p = g.items.filter(([, x]) => x).length
            return (
              <div key={g.id} className="mb-6 break-inside-avoid">
                <div className="mb-2.5 flex items-center justify-between gap-2 border-b border-line pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                      style={{ background: g.color }}
                      aria-hidden="true"
                    />
                    <h3 className="text-[0.88rem] font-semibold text-ink">{g.label}</h3>
                  </div>
                  <span className="tnum font-mono text-[0.66rem] text-ink3">
                    {p}/{g.items.length}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-1">
                  {g.items.map(([name, isProd]) => (
                    <li
                      key={name}
                      className={`rounded-chip border px-2 py-[3px] text-[0.74rem] leading-[1.45] transition-colors duration-q ${
                        isProd
                          ? 'border-transparent text-white'
                          : 'border-line bg-panel text-ink2 hover:border-line2'
                      }`}
                      style={isProd ? { background: g.color } : undefined}
                    >
                      {name}
                      {isProd ? <span className="sr-only"> (in production)</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
