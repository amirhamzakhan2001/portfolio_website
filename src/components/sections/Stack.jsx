import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, revealChars, reduced } from '../../lib/motion'
import { CAPABILITY_GROUPS as GROUPS, CAPABILITY_TOTAL, CAPABILITY_PROD } from '../../data/capabilities'

/**
 * The stack as five continuously moving belts — one per capability area,
 * alternating direction.
 *
 * A static grid of seventy chips is a wall of nouns nobody reads. Motion
 * gives it a reason to be looked at, and tying belt speed to scroll velocity
 * makes the section respond to the visitor rather than loop obliviously.
 *
 * Hovering a belt stops it so a name can actually be read — motion must
 * never make content harder to use than a plain list would be.
 */

function Belt({ group, dir }) {
  const wrap = useRef(null)
  const inner = useRef(null)

  useGSAP(
    () => {
      const el = inner.current
      const node = wrap.current
      if (!el || !node || reduced()) return

      // seamless loop: the chip set is rendered twice, travelling half its width
      const half = () => el.scrollWidth / 2
      const SPEED = 34 // px per second
      const tween = gsap.fromTo(
        el,
        { x: dir > 0 ? -half() : 0 },
        {
          x: dir > 0 ? 0 : -half(),
          duration: () => half() / SPEED,
          ease: 'none',
          repeat: -1,
        }
      )

      // scroll velocity nudges the belts, then they settle back to base speed
      const st = ScrollTrigger.create({
        trigger: node,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 900)
          gsap.to(tween, { timeScale: boost, duration: 0.25, overwrite: true })
          gsap.to(tween, { timeScale: 1, duration: 1.1, delay: 0.3, overwrite: 'auto' })
        },
      })

      const enter = () => gsap.to(tween, { timeScale: 0, duration: 0.45, overwrite: true })
      const leave = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true })
      node.addEventListener('pointerenter', enter)
      node.addEventListener('pointerleave', leave)

      return () => {
        node.removeEventListener('pointerenter', enter)
        node.removeEventListener('pointerleave', leave)
        st.kill()
      }
    },
    { scope: wrap }
  )

  const chips = (prefix) =>
    group.items.map(([name, isProd]) => (
      <li
        key={`${prefix}-${name}`}
        className={`shrink-0 rounded-ctl border px-3.5 py-2 text-[0.85rem] font-medium transition-transform duration-q hover:-translate-y-1 ${
          isProd ? 'border-transparent text-white' : 'border-line bg-sheet text-ink2'
        }`}
        style={isProd ? { background: group.color } : undefined}
      >
        {name}
      </li>
    ))

  return (
    <div className="relative overflow-hidden py-2" ref={wrap}>
      {/* edges fade so chips enter and leave rather than pop */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />

      <ul ref={inner} className="flex w-max items-center gap-2" aria-label={group.label}>
        {chips('a')}
        {/* duplicate set makes the loop seamless; hidden from assistive tech */}
        <span aria-hidden="true" className="contents">
          {chips('b')}
        </span>
      </ul>
    </div>
  )
}

export default function Stack() {
  const root = useRef(null)
  const headRef = useRef(null)

  useGSAP(
    () => {
      const splits = []
      splits.push(revealChars(headRef.current, { trigger: root.current }))
      return () => splits.forEach((s) => s?.revert?.())
    },
    { scope: root }
  )

  return (
    <section ref={root} id="stack" className="stage border-t border-line py-[clamp(5rem,12vh,9rem)]">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="stage-tag mb-6 text-st3">03 — Stack</p>
            <h2 ref={headRef} className="kin max-w-[16ch] text-d1 text-ink">
              Everything I actually use.
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <div>
              <p className="tnum font-display text-[2.6rem] font-bold leading-none text-ink">
                {CAPABILITY_TOTAL}
              </p>
              <p className="eyebrow mt-1">Tools</p>
            </div>
            <div>
              <p className="tnum font-display text-[2.6rem] font-bold leading-none text-brand">
                {CAPABILITY_PROD}
              </p>
              <p className="eyebrow mt-1">Shipped</p>
            </div>
          </div>
        </div>
      </div>

      {/* belts run full-bleed — the shell would clip the illusion */}
      <div className="mt-14 flex flex-col gap-3">
        {GROUPS.map((g, i) => (
          <div key={g.id}>
            <div className="shell mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="h-2 w-2 shrink-0 self-center rounded-full" style={{ background: g.color }} />
              <h3 className="font-display text-[0.95rem] font-bold text-ink">{g.label}</h3>
              <span className="tnum font-mono text-[0.66rem] text-ink3">
                {g.items.filter(([, x]) => x).length}/{g.items.length} shipped
              </span>
            </div>
            <Belt group={g} dir={i % 2 === 0 ? 1 : -1} />
          </div>
        ))}
      </div>

      <div className="shell mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2">
          <span className="rounded-chip bg-brand px-2 py-1 text-[0.7rem] leading-none text-white">
            Aa
          </span>
          <span className="text-[0.78rem] text-ink2">Used in shipped work</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded-chip border border-line bg-sheet px-2 py-1 text-[0.7rem] leading-none text-ink2">
            Aa
          </span>
          <span className="text-[0.78rem] text-ink2">Working knowledge</span>
        </span>
        <span className="font-mono text-[0.68rem] uppercase tracking-wide text-ink3">
          Hover a row to pause it
        </span>
      </div>
    </section>
  )
}
