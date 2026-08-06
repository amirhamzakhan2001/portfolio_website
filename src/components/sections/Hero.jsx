import { useRef } from 'react'
import { gsap, useGSAP, revealChars, revealWords, riseIn, magnetic, reduced, trackLoad, EASE } from '../../lib/motion'

export default function Hero() {
  const root = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const leadRef = useRef(null)
  const portraitRef = useRef(null)
  const ctaRef = useRef(null)

  useGSAP(
    () => {
      const splits = []
      // page-load sequence — one orchestrated moment, not five scattered ones
      splits.push(revealChars(nameRef.current, { trigger: null, delay: 0.15, stagger: 0.022 }))
      splits.push(revealChars(roleRef.current, { trigger: null, delay: 0.5, stagger: 0.012 }))
      splits.push(revealWords(leadRef.current, { trigger: null, delay: 0.75 }))
      riseIn(ctaRef.current?.children, { trigger: null, delay: 1, y: 22 })

      if (!reduced()) {
        trackLoad(
          gsap.from(portraitRef.current, {
            scale: 1.06,
            opacity: 0,
            duration: 1.4,
            ease: EASE,
            delay: 0.2,
          })
        )
        // the portrait drifts slower than the page — cheap, convincing depth
        gsap.to(portraitRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('.hero-grid', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      const cleanups = Array.from(ctaRef.current?.querySelectorAll('[data-magnetic]') || []).map((el) =>
        magnetic(el, 0.25)
      )

      return () => {
        cleanups.forEach((fn) => fn())
        splits.forEach((s) => s?.revert?.())
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} className="stage relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      <div className="hero-grid grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <div className="shell w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div className="min-w-0">
            <p className="eyebrow mb-6 flex items-center gap-2.5 text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Available for hire · New Delhi
            </p>

            {/* One word per line, explicitly. At this size "Amir Hamza" does
                not fit the column, and a line that wraps inside its own clip
                box breaks the reveal animation. */}
            <h1 ref={nameRef} className="kin text-mega font-bold text-ink">
              Amir
              <br />
              Hamza
              <br />
              Khan
            </h1>

            <p ref={roleRef} className="kin mt-6 font-display text-d3 font-bold uppercase tracking-tight text-brand">
              AI / ML Engineer
            </p>

            <p ref={leadRef} className="kin mt-6 max-w-prose text-lead text-ink2">
              I build production AI systems that listen, retrieve and act — multi-tenant voice
              platforms, RAG pipelines and agentic tooling, shipped end to end.
            </p>

            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#work" data-magnetic className="btn">
                See the work
              </a>
              <a
                href="/Amir_Hamza_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="btn-ghost"
              >
                Résumé
              </a>
            </div>
          </div>

          <figure ref={portraitRef} className="order-first w-full max-w-[300px] lg:order-last lg:max-w-[380px]">
            <div className="relative overflow-hidden rounded-xl2 bg-sunk shadow-lift">
              <img
                src="/ahk_profile_pic.png"
                alt="Amir Hamza Khan"
                width="580"
                height="580"
                className="block aspect-[4/5] w-full object-cover object-top"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/70 to-transparent px-4 pb-3 pt-10 font-mono text-[0.66rem] uppercase tracking-wide text-white/90">
                <span>M.Sc. AI/ML · 9.49 · Rank 1</span>
                <span>2026</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center">
        <span className="eyebrow flex items-center gap-2 text-ink3">
          Scroll
          <span className="block h-8 w-px bg-line2" />
        </span>
      </div>
    </section>
  )
}
