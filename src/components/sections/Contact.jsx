import { useRef } from 'react'
import { gsap, useGSAP, revealChars, riseIn, magnetic } from '../../lib/motion'

const CHANNELS = [
  ['Email', 'amirhamzakhan2001@gmail.com', 'mailto:amirhamzakhan2001@gmail.com'],
  ['Phone', '+91 75418 96866', 'tel:+917541896866'],
  ['LinkedIn', 'in/amirhamzakhan032001', 'https://www.linkedin.com/in/amirhamzakhan032001'],
  ['GitHub', 'amirhamzakhan2001', 'https://github.com/amirhamzakhan2001'],
]

export default function Contact() {
  const root = useRef(null)
  const headRef = useRef(null)
  const ctaRef = useRef(null)

  useGSAP(
    () => {
      const splits = []
      splits.push(revealChars(headRef.current, { trigger: root.current, stagger: 0.02 }))
      riseIn('.ch-row', { trigger: '.ch-list', start: 'top 86%', stagger: 0.07 })

      const cleanups = Array.from(ctaRef.current?.querySelectorAll('[data-magnetic]') || []).map((el) =>
        magnetic(el, 0.3)
      )

      return () => {
        cleanups.forEach((fn) => fn())
        splits.forEach((s) => s?.revert?.())
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} id="contact" className="stage relative overflow-hidden border-t border-line py-[clamp(6rem,16vh,12rem)]">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <div className="shell">
        <p className="stage-tag mb-6 text-st5">05 — Contact</p>

        <h2 ref={headRef} className="kin max-w-[14ch] text-mega text-ink">
          Let&rsquo;s build.
        </h2>

        <p className="mt-8 max-w-prose text-lead text-ink2">
          I&rsquo;ve just finished my M.Sc. and a build-heavy internship shipping voice AI, agentic
          systems and automation tooling. Looking for teams building AI products that have to hold
          up in front of real users. I answer every message myself.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
          <a href="mailto:amirhamzakhan2001@gmail.com" data-magnetic className="btn">
            Send an email
          </a>
          <a
            href="/Amir_Hamza_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            className="btn-ghost"
          >
            Resume (PDF)
          </a>
        </div>

        <ul className="ch-list mt-16 border-t border-line">
          {CHANNELS.map(([k, v, href]) => (
            <li key={k} className="ch-row border-b border-line">
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-6 transition-colors duration-q"
              >
                <span className="eyebrow w-28 shrink-0 group-hover:text-brand">{k}</span>
                <span className="flex-1 font-display text-[1.2rem] font-bold text-ink transition-colors duration-q group-hover:text-brand md:text-[1.9rem]">
                  {v}
                </span>
                <span
                  aria-hidden="true"
                  className="font-display text-[1.2rem] text-ink3 transition-all duration-q group-hover:translate-x-2 group-hover:text-brand md:text-[1.6rem]"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-14 font-mono text-[0.7rem] uppercase tracking-wide text-ink3">
          © 2026 Amir Hamza Khan · New Delhi, India
        </p>
      </div>
    </section>
  )
}
