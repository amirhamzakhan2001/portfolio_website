import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, revealChars, reduced } from '../../lib/motion'
import { PROJECTS } from '../../data/projects'

const STAGE_COLOR = ['#0E9384', '#B54708', '#7839EE', '#BA2D5B', '#2A5BD7']

/**
 * Projects as a horizontal pinned scroll.
 *
 * The pinned element is the track viewport ONLY — not the whole section.
 * Pinning the section kept the 355px header on screen, which left a 846px
 * card only ~424px of a 779px viewport: almost exactly half of it visible.
 * The header now scrolls away first and the track gets the full screen.
 *
 * Cards are also capped to fit inside that viewport. A card taller than the
 * screen can never be read in a pinned context, however good it looks in
 * isolation.
 *
 * Below lg this degrades to a normal vertical stack — sideways scroll-jacking
 * on a phone is hostile, and phones are where most of this traffic lands.
 */
export default function Work() {
  const root = useRef(null)
  const pinRef = useRef(null)
  const track = useRef(null)
  const headRef = useRef(null)

  useGSAP(
    () => {
      const splits = []
      splits.push(revealChars(headRef.current, { trigger: root.current }))

      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          if (reduced()) return
          const el = track.current
          if (!el) return
          const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 80)

          gsap.to(el, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          })

          gsap.to('.work-progress', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: pinRef.current,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: true,
            },
          })
        },
      })

      return () => splits.forEach((s) => s?.revert?.())
    },
    { scope: root }
  )

  return (
    <section ref={root} id="work" className="stage border-t border-line">
      {/* header scrolls away before the pin begins */}
      <div className="shell pb-10 pt-[clamp(4rem,10vh,7rem)]">
        <p className="stage-tag mb-6 text-st2">02 — Work</p>
        <h2 ref={headRef} className="kin max-w-[18ch] text-d1 text-ink">
          Eight things I shipped.
        </h2>
        <p className="mt-4 max-w-prose text-lead text-ink2">
          Voice platforms, retrieval systems and a model index — with what was hard about each.
        </p>
        <div className="mt-8 hidden h-px w-full bg-line lg:block">
          <div className="work-progress h-px origin-left scale-x-0 bg-brand" />
        </div>
      </div>

      {/* the pinned viewport */}
      <div ref={pinRef} className="relative lg:h-screen lg:overflow-hidden">
        <div
          ref={track}
          className="flex flex-col gap-8 px-gutter pb-[clamp(3rem,8vh,5rem)] lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:pb-0"
        >
          {PROJECTS.map((p, i) => {
            const c = STAGE_COLOR[i % STAGE_COLOR.length]
            return (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-xl2 border border-line bg-sheet p-6 shadow-soft transition-shadow duration-m hover:shadow-lift lg:h-[min(74vh,660px)] lg:w-[clamp(27rem,36vw,34rem)] lg:p-8"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className="tnum font-display text-[2.4rem] font-bold leading-none"
                    style={{ color: c }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <span className="chip" style={{ borderColor: `${c}44`, color: c }}>
                      {p.kind}
                    </span>
                    <span className="chip">{p.year}</span>
                  </div>
                </div>

                <h3 className="font-display text-[1.4rem] font-bold leading-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wide text-ink3">
                  {p.org}
                </p>
                <p className="mt-3 font-display text-[1.15rem] font-bold" style={{ color: c }}>
                  {p.metric}
                </p>

                <div className="mt-4 flex min-h-0 flex-col gap-3 border-t border-line pt-4">
                  {[
                    ['Problem', p.problem],
                    ['Approach', p.approach],
                    ['Result', p.result],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="eyebrow mb-0.5">{k}</p>
                      <p className="line-clamp-4 text-[0.8rem] leading-[1.55] text-ink2">{v}</p>
                    </div>
                  ))}
                </div>

                <ul className="mt-auto flex flex-wrap gap-1 pt-4">
                  {p.stack.slice(0, 6).map((s) => (
                    <li key={s} className="chip !px-2 !py-0.5 !text-[0.62rem]">
                      {s}
                    </li>
                  ))}
                  {p.stack.length > 6 && (
                    <li className="chip !px-2 !py-0.5 !text-[0.62rem]">+{p.stack.length - 6}</li>
                  )}
                </ul>

                {p.links?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                    {p.links.map((l, li) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          li === 0
                            ? 'btn !px-3.5 !py-2 !text-[0.78rem]'
                            : 'btn-ghost !px-3.5 !py-2 !text-[0.78rem]'
                        }
                      >
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
