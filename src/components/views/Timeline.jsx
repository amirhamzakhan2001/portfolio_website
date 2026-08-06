import { useReveal } from '../../lib/useReveal'
import { CERTIFICATIONS } from '../../data/certifications'

/** Experience and education, exactly as stated on the résumé. */

const ROWS = [
  {
    from: 'Feb 2026',
    to: 'Jul 2026',
    title: 'AI Engineer Intern',
    org: 'Eyas Ventures · Noida',
    kind: 'Work',
    body: 'Built Voxa — a multi-tenant voice AI platform with configurable STT, LLM and TTS per tenant — plus a no-code workflow automation builder and an embeddable AI website widget.',
  },
  {
    from: 'Oct 2025',
    to: 'Feb 2026',
    title: 'AI Model Evaluation Researcher',
    org: 'Outlier AI · remote',
    kind: 'Work',
    body: 'Evaluated LLM output against structured rubrics for factual accuracy, hallucination detection, faithfulness, instruction-following and safety compliance, and identified recurring failure patterns across large-scale assessment tasks.',
  },
  {
    from: '2024',
    to: '2026',
    title: 'M.Sc. Artificial Intelligence & Machine Learning',
    org: 'Jamia Millia Islamia, New Delhi',
    kind: 'Study',
    highlight: 'CGPA 9.49 · Ranked 1st in class',
    body: 'Graduate study in AI and machine learning.',
  },
  {
    from: '2019',
    to: '2022',
    title: 'B.Sc. (Hons.) Applied Mathematics',
    org: 'Jamia Millia Islamia, New Delhi',
    kind: 'Study',
    highlight: 'CGPA 9.53 · Ranked 2nd in class',
    body: 'The mathematical foundation under everything since.',
  },
]

const KIND = { Work: 'chip-brand', Study: '' }

export default function Timeline() {
  const ref = useReveal()

  return (
    <section id="timeline" className="mt-4 scroll-mt-24" ref={ref}>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rv panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Experience & education</h2>
              <p className="mt-0.5 text-[0.72rem] text-ink3">Newest first</p>
            </div>
          </div>

          <ol className="divide-y divide-line">
            {ROWS.map((r) => (
              <li key={r.title} className="grid gap-x-5 gap-y-2 px-5 py-4 sm:grid-cols-[7.5rem_1fr]">
                <div className="flex items-center gap-2 sm:block">
                  <p className="tnum font-mono text-[0.74rem] font-medium text-ink">{r.from}</p>
                  <p className="tnum font-mono text-[0.66rem] text-ink3">→ {r.to}</p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[0.94rem] font-semibold leading-tight text-ink">
                      {r.title}
                    </h3>
                    <span className={`chip ${KIND[r.kind]}`}>{r.kind}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-[0.7rem] text-ink3">{r.org}</p>
                  {r.highlight && (
                    <p className="mt-1 font-mono text-[0.7rem] font-medium text-brand">
                      {r.highlight}
                    </p>
                  )}
                  <p className="mt-1.5 max-w-prose text-[0.82rem] leading-relaxed text-ink2">
                    {r.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rv panel self-start">
          <div className="panel-head">
            <h2 className="panel-title">Certifications & achievements</h2>
          </div>
          <ul className="divide-y divide-line">
            {CERTIFICATIONS.map((c) => {
              const Row = c.url ? 'a' : 'div'
              return (
                <li key={c.name}>
                  <Row
                    {...(c.url ? { href: c.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`group flex items-center justify-between gap-3 px-5 py-3.5 ${
                      c.url ? 'transition-colors duration-q hover:bg-sunk/60' : ''
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[0.86rem] font-medium leading-snug text-ink transition-colors duration-q group-hover:text-brand">
                        {c.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[0.68rem] text-ink3">
                        {c.issuer}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="tnum font-mono text-[0.66rem] text-ink3">{c.year}</span>
                      {c.url && <span className="chip chip-brand">Verify ↗</span>}
                    </span>
                  </Row>
                </li>
              )
            })}
          </ul>

          <div className="border-t border-line px-5 py-4">
            <p className="lab mb-2">Summary</p>
            <p className="text-[0.82rem] leading-relaxed text-ink2">
              AI/ML engineer with hands-on experience building production-grade AI systems —
              multi-tenant voice AI, RAG pipelines, agentic AI and no-code automation — with a
              track record of shipping end to end, from architecture through deployment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
