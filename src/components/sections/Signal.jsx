import { useRef } from 'react'
import { gsap, useGSAP, revealChars, countUp, riseIn } from '../../lib/motion'
import { PROJECT_COUNT, PRODUCTION_COUNT } from '../../data/projects'
import { CAPABILITY_TOTAL, CAPABILITY_PROD } from '../../data/capabilities'

const STATS = [
  { v: 9.49, d: 2, label: 'M.Sc. CGPA', sub: 'Ranked 1st in class · JMI', tone: 'text-st1' },
  { v: PRODUCTION_COUNT, label: 'Products in production', sub: 'Shipped at Eyas Ventures', tone: 'text-st2' },
  { v: PROJECT_COUNT, label: 'Projects delivered', sub: 'Analytics → ML → production AI', tone: 'text-st3' },
  { v: CAPABILITY_TOTAL, label: 'Tools in the stack', sub: `${CAPABILITY_PROD} used in shipped work`, tone: 'text-st4' },
]

export default function Signal() {
  const root = useRef(null)
  const headRef = useRef(null)

  useGSAP(
    () => {
      const splits = []
      splits.push(revealChars(headRef.current, { trigger: root.current }))
      riseIn('.stat-card', { trigger: '.stat-grid', start: 'top 82%', stagger: 0.1 })
      root.current?.querySelectorAll('[data-count]').forEach((el) => {
        countUp(el, parseFloat(el.dataset.count), {
          decimals: parseInt(el.dataset.decimals || '0', 10),
          trigger: el,
        })
      })

      return () => splits.forEach((s) => s?.revert?.())
    },
    { scope: root }
  )

  return (
    <section ref={root} id="signal" className="stage border-t border-line py-[clamp(5rem,12vh,9rem)]">
      <div className="shell">
        <p className="stage-tag mb-6 text-st1">01 — Signal</p>
        <h2 ref={headRef} className="kin max-w-[16ch] text-d1 text-ink">
          The numbers, first.
        </h2>

        <div className="stat-grid mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card border-t-2 border-ink pt-5">
              <p
                data-count={s.v}
                data-decimals={s.d || 0}
                className={`tnum font-display text-num font-bold ${s.tone}`}
              >
                0
              </p>
              <p className="mt-3 font-display text-[1.05rem] font-bold leading-tight text-ink">
                {s.label}
              </p>
              <p className="mt-1 font-mono text-[0.7rem] uppercase leading-relaxed tracking-wide text-ink3">
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
