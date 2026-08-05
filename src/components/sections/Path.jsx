import { useReveal } from '../../lib/useReveal'

const STEPS = [
  {
    year: '2019',
    end: '2022',
    role: 'BSc (Hons) Applied Mathematics',
    org: 'Jamia Millia Islamia',
    stat: '9.53',
    statLabel: 'CGPA · Rank 2',
    body: 'Linear algebra, probability, calculus, mathematical statistics.',
  },
  {
    year: '2022',
    end: '2024',
    role: 'Away from study',
    org: 'Family business · self-directed learning',
    stat: '2 yrs',
    statLabel: 'Out, then back',
    body: 'I stepped out to support my family and kept working through data science and mathematics on my own time. Then came back and took a 9.38.',
    quiet: true,
  },
  {
    year: '2024',
    end: 'now',
    role: 'MSc Artificial Intelligence & Machine Learning',
    org: 'Jamia Millia Islamia',
    stat: '9.38',
    statLabel: 'CGPA · ongoing',
    body: 'Deep learning, NLP, MLOps, cloud, applied statistics. Minors in IoT and big data.',
  },
  {
    year: '2025',
    end: 'now',
    role: 'AI Model Evaluation Researcher',
    org: 'Outlier AI · remote, freelance',
    stat: '90+',
    statLabel: 'Evaluations',
    body: 'Grading LLM output for hallucination, faithfulness, instruction-following and safety.',
  },
  {
    year: '2026',
    end: 'now',
    role: 'Artificial Intelligence Intern',
    org: 'KreoHealth · Noida, on-site',
    stat: 'Live',
    statLabel: 'Building Voxa',
    body: 'Voice agents, retrieval, multi-channel messaging and CRM sync, in production.',
    current: true,
  },
]

const COMPETITIONS = [
  ['Amazon ML Challenge 2025', 'Online · Top 2500 of 7000+ teams'],
  ['Dataverse — IIT Madras', 'Online hackathon'],
  ['Neural.net — IIIT Bangalore', 'Online hackathon'],
  ['Face the Future (Deepfake ML) — IIIT Bangalore', 'Online hackathon'],
  ['MongoDB Hackathon', 'Online hackathon'],
  ['IBM AI Agent Architect', 'SkillBuild × CSRBOX · 4-week program'],
]

export default function Path() {
  const ref = useReveal({ selector: '.rv', stagger: 55 })

  return (
    <section id="path" className="beat border-t-2 border-ink" ref={ref}>
      <div className="shell">
        <div className="rv mb-14">
          <p className="eyebrow mb-4">Path</p>
          <h2 className="mega text-d2">
            Maths first.
            <br />
            <span className="text-blaze">Then everything else.</span>
          </h2>
        </div>

        <ol className="flex flex-col">
          {STEPS.map((s) => (
            <li
              key={s.year + s.role}
              className="rv grid items-start gap-x-8 gap-y-3 border-t-2 border-ink py-7 md:grid-cols-[8rem_1fr_10rem]"
            >
              {/* years */}
              <div className="flex items-baseline gap-2 md:block">
                <p className="tnum mega text-[2rem] leading-none text-ink">{s.year}</p>
                <p className="font-mono text-[0.66rem] uppercase tracking-wider text-ink3 md:mt-1">
                  → {s.end}
                </p>
              </div>

              {/* role */}
              <div>
                <h3
                  className={`font-ui text-[1.22rem] font-semibold uppercase leading-tight tracking-wide ${
                    s.quiet ? 'text-ink2' : 'text-ink'
                  }`}
                >
                  {s.role}
                  {s.current && (
                    <span className="ml-3 inline-flex items-center gap-1.5 border border-moss px-1.5 py-0.5 align-middle font-mono text-[0.58rem] uppercase tracking-wider text-moss">
                      <span className="h-1 w-1 animate-blink rounded-full bg-moss" />
                      Now
                    </span>
                  )}
                </h3>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-blaze">
                  {s.org}
                </p>
                <p className="mt-2.5 max-w-measure font-body text-[0.97rem] leading-relaxed text-ink2">
                  {s.body}
                </p>
              </div>

              {/* stat */}
              <div className="md:text-right">
                <p className="tnum mega text-[2.2rem] leading-none text-blaze">{s.stat}</p>
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-ink3">
                  {s.statLabel}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* competitions */}
        <div className="mt-16">
          <p className="eyebrow rv mb-6">Competitions &amp; programs</p>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETITIONS.map(([name, detail]) => (
              <li key={name} className="rv border-t-2 border-ink pt-3">
                <p className="font-ui text-[0.98rem] font-semibold leading-snug">{name}</p>
                <p className="mt-1 font-mono text-[0.64rem] uppercase tracking-wider text-ink3">
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
