import { useReveal } from '../../lib/useReveal'

/**
 * The path, drawn as a signal trace.
 *
 * The 2022–24 break is rendered as a silence in the trace rather than
 * hidden — a gap in a waveform is still part of the recording, and the
 * honest version of that period is stronger than an unexplained jump.
 */

const TRACE = [
  {
    t: '2019 – 2022',
    title: 'BSc (Hons) Applied Mathematics',
    org: 'Jamia Millia Islamia',
    note: 'CGPA 9.53 · ranked 2nd in cohort',
    body: 'Linear algebra, probability, calculus, mathematical statistics.',
  },
  {
    silence: true,
    t: '2022 – 2024',
    title: 'Away from study',
    note: 'Family business · self-directed learning',
    body: 'I stepped out to support my family, and kept working through data science and mathematics on my own time. It is the least decorated line on this page and probably the one that explains the most about how I work.',
  },
  {
    t: 'Jul 2024 – present',
    title: 'MSc Artificial Intelligence & Machine Learning',
    org: 'Jamia Millia Islamia',
    note: 'CGPA 9.38',
    body: 'Deep learning, NLP, MLOps, cloud, applied statistics. Minors in IoT and big data.',
  },
  {
    t: 'Oct 2025 – present',
    title: 'AI Model Evaluation Researcher',
    org: 'Outlier AI · freelance',
    note: '80–90+ structured evaluations',
    body: 'Grading LLM output for hallucination, faithfulness, instruction-following and safety across coding, reasoning and maths tasks — and documenting where models repeatedly fail.',
  },
  {
    t: 'Feb 2026 – present',
    title: 'Artificial Intelligence Intern',
    org: 'KreoHealth · Noida',
    note: 'Building Voxa',
    body: 'Voice agents, retrieval, multi-channel messaging and CRM sync, in production.',
    current: true,
  },
]

const AWARDS = [
  ['Amazon ML Challenge 2025', 'Top 2500 of 7000+ teams'],
  ['IBM AI Agent Architect', 'SkillBuild × CSRBOX, 2025'],
  ['Student Placement Coordinator', 'Dept. of Computer Science, JMI'],
  ['Hackathons', 'IIT Madras · IIIT Bangalore · MongoDB'],
]

export default function Trace() {
  const ref = useReveal()

  return (
    <section id="trace" className="movement border-t border-edge" ref={ref}>
      <div className="shell">
        <header className="reveal mb-12 md:mb-16">
          <p className="chan mb-5">The path</p>
          <h2 className="text-h2 max-w-[17ch]">Including the quiet part.</h2>
        </header>

        <ol className="relative flex flex-col" data-reveal-group>
          {TRACE.map((e) => (
            <li
              key={e.t}
              className="reveal group relative grid gap-x-6 gap-y-2 border-t border-edge py-7 md:grid-cols-[minmax(0,10rem)_1.5rem_minmax(0,1fr)]"
            >
              <span className="tnum font-mono text-micro uppercase tracking-wider text-mute">
                {e.t}
              </span>

              {/* the trace itself: a live tick, or a dashed silence */}
              <span className="hidden items-center justify-center md:flex" aria-hidden="true">
                {e.silence ? (
                  <span className="h-full w-px border-l border-dashed border-mute/50" />
                ) : (
                  <span className="relative h-full w-px bg-edge">
                    <span
                      className={`absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                        e.current ? 'animate-breathe bg-live' : 'bg-signal'
                      }`}
                    />
                  </span>
                )}
              </span>

              <div>
                <h3
                  className={`text-[1.12rem] leading-snug ${e.silence ? 'text-dim' : 'text-ink'}`}
                >
                  {e.title}
                  {e.org && <span className="text-mute"> · {e.org}</span>}
                </h3>
                {e.note && (
                  <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-wider text-steel">
                    {e.note}
                  </p>
                )}
                <p className="mt-2.5 max-w-measure font-serif text-[1rem] leading-relaxed text-dim">
                  {e.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16" data-reveal-group>
          <p className="chan reveal mb-6">Also</p>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {AWARDS.map(([t, d]) => (
              <li key={t} className="reveal border-t border-edge pt-4">
                <p className="text-[0.98rem] leading-snug text-ink">{t}</p>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-wider text-mute">
                  {d}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
