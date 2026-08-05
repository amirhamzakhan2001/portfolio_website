import { useReveal } from '../../lib/useReveal'
import Mark from '../shell/Mark'

const LINKS = [
  ['Email', 'amirhamzakhan2001@gmail.com', 'mailto:amirhamzakhan2001@gmail.com'],
  ['LinkedIn', '/in/amirhamzakhan032001', 'https://www.linkedin.com/in/amirhamzakhan032001'],
  ['GitHub', '@amirhamzakhan2001', 'https://github.com/amirhamzakhan2001'],
  ['Résumé', 'PDF', '/resume.pdf'],
]

export default function Contact() {
  const ref = useReveal()

  return (
    <>
      <section id="contact" className="movement border-t border-edge" ref={ref}>
        <div className="shell">
          <p className="chan reveal mb-6">Contact</p>

          <h2 className="reveal max-w-[15ch] text-h1 font-semibold leading-[0.95]">
            Let&rsquo;s talk.
          </h2>

          <p className="reveal prose-signal mt-8">
            I&rsquo;m finishing my MSc and working on Voxa full time. I&rsquo;m interested in
            teams building <strong>voice, speech or language systems</strong> that have to survive
            real users — and I answer every message myself.
          </p>

          <ul className="mt-14 border-t border-edge" data-reveal-group>
            {LINKS.map(([k, v, href]) => (
              <li key={k} className="reveal border-b border-edge">
                <a
                  href={href}
                  target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  data-reticle
                  className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5 transition-colors duration-attack"
                >
                  <span className="font-mono text-micro uppercase tracking-[0.16em] text-mute group-hover:text-signal">
                    {k}
                  </span>
                  <span className="flex-1 text-[1.1rem] text-ink transition-colors duration-attack group-hover:text-signal md:text-[1.35rem]">
                    {v}
                  </span>
                  <span
                    className="font-mono text-micro text-mute transition-transform duration-settle ease-signal group-hover:translate-x-1 group-hover:text-signal"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-edge py-10">
        <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="flex items-center gap-3">
            <Mark className="h-4 w-7 text-signal" />
            <span className="font-mono text-micro uppercase tracking-[0.14em] text-dim">
              Amir Hamza Khan
            </span>
          </div>

          <p className="font-mono text-[0.64rem] uppercase leading-relaxed tracking-wider text-mute">
            Built with React, Canvas and the Web Audio API · No analytics · No cookies
          </p>

          <p className="tnum font-mono text-[0.64rem] uppercase tracking-wider text-mute">
            New Delhi, India
          </p>
        </div>
      </footer>
    </>
  )
}
