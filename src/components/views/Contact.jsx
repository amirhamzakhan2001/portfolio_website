import { useReveal } from '../../lib/useReveal'

const CHANNELS = [
  ['Email', 'amirhamzakhan2001@gmail.com', 'mailto:amirhamzakhan2001@gmail.com', 'Fastest'],
  ['Phone', '+91 75418 96866', 'tel:+917541896866', null],
  ['LinkedIn', 'in/amirhamzakhan032001', 'https://www.linkedin.com/in/amirhamzakhan032001', null],
  ['GitHub', 'amirhamzakhan2001', 'https://github.com/amirhamzakhan2001', null],
  ['Resume', 'Download PDF', '/Amir_Hamza_Resume.pdf', null],
]

export default function Contact() {
  const ref = useReveal()

  return (
    <section id="contact" className="mt-4 scroll-mt-24" ref={ref}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rv panel grid-bg">
          <div className="panel-body">
            <span className="chip chip-ok mb-4">
              <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" />
              Open to opportunities
            </span>
            <h2 className="text-h2 font-semibold text-ink">Let&rsquo;s build something.</h2>
            <p className="mt-3 max-w-prose text-base2 text-ink2">
              I&rsquo;ve just finished my M.Sc. and a build-heavy internship shipping voice AI,
              agentic systems and automation tooling. I&rsquo;m looking for teams building AI
              products that have to hold up in front of real users. I read and answer every
              message myself.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href="mailto:amirhamzakhan2001@gmail.com" className="btn">
                Send an email
              </a>
              <a href="/Amir_Hamza_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-sec">
                Resume (PDF)
              </a>
            </div>
          </div>
        </div>

        <div className="rv panel">
          <div className="panel-head">
            <h2 className="panel-title">Channels</h2>
            <span className="lab">Response within a day</span>
          </div>
          <ul className="divide-y divide-line">
            {CHANNELS.map(([k, v, href, tag]) => (
              <li key={k}>
                <a
                  href={href}
                  target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-q hover:bg-sunk/60"
                >
                  <span className="min-w-0">
                    <span className="lab block">{k}</span>
                    <span className="mt-0.5 block truncate font-mono text-[0.84rem] text-ink transition-colors duration-q group-hover:text-brand">
                      {v}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {tag && <span className="chip chip-ok">{tag}</span>}
                    <span
                      className="text-ink3 transition-transform duration-q group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-1 py-6">
        <p className="font-mono text-[0.68rem] text-ink3">
          © 2026 Amir Hamza Khan · New Delhi, India
        </p>
      </footer>
    </section>
  )
}
