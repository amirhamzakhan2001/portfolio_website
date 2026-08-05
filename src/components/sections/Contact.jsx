import { useReveal } from '../../lib/useReveal'

const LINKS = [
  ['Email', 'amirhamzakhan2001@gmail.com', 'mailto:amirhamzakhan2001@gmail.com'],
  ['LinkedIn', 'amirhamzakhan032001', 'https://www.linkedin.com/in/amirhamzakhan032001'],
  ['GitHub', 'amirhamzakhan2001', 'https://github.com/amirhamzakhan2001'],
  ['Résumé', 'Download PDF', '/resume.pdf'],
]

export default function Contact() {
  const ref = useReveal({ selector: '.rv' })

  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-ink py-beat text-paper" ref={ref}>
        <div aria-hidden="true" className="hatch absolute -right-10 top-10 h-40 w-72 opacity-50" />

        <div className="shell relative">
          <p className="rv mb-6 font-mono text-micro uppercase tracking-[0.16em] text-blaze">
            Contact
          </p>

          <h2 className="rv mega text-d1 leading-[0.84]">
            Hire
            <br />
            <span className="text-blaze">me.</span>
          </h2>

          <p className="rv mt-8 max-w-[46ch] font-body text-lead leading-relaxed text-paper/75">
            I&rsquo;m finishing my MSc and building voice agents full time. Looking for teams
            working on speech, language or retrieval systems that have to survive real users.
            I answer every message myself.
          </p>

          <ul className="mt-14 border-t border-paper/25">
            {LINKS.map(([k, v, href]) => (
              <li key={k} className="rv border-b border-paper/25">
                <a
                  href={href}
                  target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6 transition-colors duration-fast"
                >
                  <span className="font-mono text-micro uppercase tracking-[0.16em] text-paper/50 transition-colors duration-fast group-hover:text-blaze">
                    {k}
                  </span>
                  <span className="mega flex-1 text-[1.6rem] leading-none text-paper transition-colors duration-fast group-hover:text-blaze md:text-[2.6rem]">
                    {v}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mega text-[1.6rem] leading-none text-paper/40 transition-all duration-fast group-hover:translate-x-2 group-hover:text-blaze md:text-[2.2rem]"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="bg-ink pb-10 pt-2 text-paper">
        <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-paper/20 pt-8">
          <p className="mega text-[1.1rem] uppercase">Amir Hamza Khan</p>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-paper/45">
            Built with React &amp; Three.js · No analytics · No cookies
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-wider text-paper/45">
            New Delhi, India
          </p>
        </div>
      </footer>
    </>
  )
}
