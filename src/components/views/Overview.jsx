import Kpi from '../charts/Kpi'
import { useReveal } from '../../lib/useReveal'
import { scrollToId } from '../../lib/useLenis'
import { PROJECT_COUNT, PRODUCTION_COUNT } from '../../data/projects'
import { CAPABILITY_TOTAL, CAPABILITY_PROD } from '../../data/capabilities'

/**
 * The landing view. Every figure here comes from the résumé — no estimates,
 * no invented breakdowns.
 */

/** Real, published latencies for the two systems Amir has shipped. Single
 *  series (magnitude), so one hue, direct labels, no legend needed. */
const LATENCY = [
  { name: 'Voxa — voice agent', ms: 1000, note: 'End-to-end: speech in → speech out', tag: 'Eyas Ventures' },
  { name: 'JMI chatbot — RAG', ms: 1500, note: 'Query → grounded answer', tag: 'Jamia Millia Islamia' },
]
const LAT_MAX = 1800

export default function Overview() {
  const ref = useReveal()

  return (
    <section id="overview" className="scroll-mt-24" ref={ref}>
      {/* ── identity ── */}
      <div className="rv panel grid-bg relative overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-8">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="chip chip-ok">
                <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" />
                Available for hire
              </span>
              <span className="chip">New Delhi, India</span>
              <span className="chip chip-brand">M.Sc. AI/ML · 9.49 · Rank 1</span>
            </div>

            <h1 className="text-h1 font-semibold text-ink">
              I build production AI systems
              <br className="hidden sm:block" /> that{' '}
              <span className="text-brand">listen, retrieve and act.</span>
            </h1>

            <p className="mt-4 max-w-prose text-lead text-ink2">
              AI/ML engineer shipping end-to-end products from architecture through deployment —
              multi-tenant voice AI platforms, RAG pipelines, agentic systems and no-code
              workflow automation. Most recently built{' '}
              <span className="font-medium text-ink">Voxa</span> at Eyas Ventures.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button onClick={() => scrollToId('projects')} className="btn">
                View projects
              </button>
              <a
                href="/Amir_Hamza_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sec"
              >
                Résumé (PDF)
              </a>
            </div>
          </div>

          <figure className="order-first w-full max-w-[190px] md:order-last md:w-[190px]">
            <div className="overflow-hidden rounded-panel border border-line bg-panel shadow-raise">
              <img
                src="/ahk_profile_pic.png"
                alt="Amir Hamza Khan"
                width="580"
                height="580"
                className="block aspect-square w-full object-cover object-top"
              />
              <figcaption className="flex items-center justify-between border-t border-line px-3 py-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-wide text-ink3">
                  AI/ML Engineer
                </span>
                <span className="font-mono text-[0.62rem] text-ink3">2026</span>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>

      {/* ── metrics ── */}
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Metrics about the engineer, not trivia from one project — the
            project-specific numbers live on their own cards below. */}
        <div className="rv">
          <Kpi value={9.49} decimals={2} label="M.Sc. CGPA" sub="Ranked 1st in class · JMI" tone="brand" />
        </div>
        <div className="rv">
          <Kpi
            value={PRODUCTION_COUNT}
            label="Products in production"
            sub="Shipped at Eyas Ventures"
            tone="ok"
          />
        </div>
        <div className="rv">
          <Kpi
            value={PROJECT_COUNT}
            label="Projects delivered"
            sub="Analytics → ML → production AI"
          />
        </div>
        <div className="rv">
          <Kpi
            value={CAPABILITY_TOTAL}
            label="Tools in the stack"
            sub={`${CAPABILITY_PROD} used in shipped work`}
          />
        </div>
      </div>

      {/* ── latency + latest ── */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="rv panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Response latency — shipped systems</h2>
              <p className="mt-0.5 text-[0.72rem] text-ink3">Lower is better</p>
            </div>
            <span className="chip chip-ok">Measured</span>
          </div>
          <div className="panel-body flex flex-col gap-5">
            {LATENCY.map((l, i) => (
              <div key={l.name}>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-[0.88rem] font-semibold text-ink">{l.name}</span>
                  <span className="chip">{l.tag}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 flex-1 overflow-hidden rounded-[4px] bg-sunk">
                    <div
                      className="flex h-full items-center justify-end rounded-[4px] pr-2"
                      style={{
                        width: `${(l.ms / LAT_MAX) * 100}%`,
                        background: i === 0 ? '#2A5BD7' : '#5C7FE0',
                      }}
                    >
                      <span className="tnum font-mono text-[0.66rem] font-medium text-white">
                        ~{l.ms.toLocaleString()}ms
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-[0.75rem] text-ink3">{l.note}</p>
              </div>
            ))}
            <p className="border-t border-line pt-3 text-[0.78rem] leading-relaxed text-ink3">
              Voxa runs configurable STT, LLM and TTS per tenant, with voice cloning through
              ElevenLabs, Cartesia and AssemblyAI — so the budget has to hold while every stage is
              swappable.
            </p>
          </div>
        </div>

        <div className="rv panel">
          <div className="panel-head">
            <h2 className="panel-title">Recent</h2>
            <span className="chip chip-ok">
              <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-ok" />
              Open to work
            </span>
          </div>
          <ul className="divide-y divide-line">
            {[
              {
                t: 'JMI University AI Chatbot',
                o: 'RAG on Qwen · 50+ departments',
                d: 'Completed 2026',
                n: 'Chatbot layer, backend services and a role-based admin portal.',
                c: '#2A5BD7',
              },
              {
                t: 'AI Engineer Intern',
                o: 'Eyas Ventures · Noida',
                d: 'Feb – Jul 2026',
                n: 'Built Voxa, a no-code automation builder and an embeddable AI widget.',
                c: '#0E9384',
              },
              {
                t: 'AI Model Evaluation Researcher',
                o: 'Outlier AI · remote',
                d: 'Oct 2025 – Feb 2026',
                n: 'LLM output graded against structured rubrics for accuracy and safety.',
                c: '#B54708',
              },
            ].map((r) => (
              <li key={r.t} className="flex items-start gap-3 px-5 py-3.5">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${r.live ? 'animate-pulseDot' : ''}`}
                  style={{ background: r.c }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="text-[0.88rem] font-semibold text-ink">{r.t}</p>
                    <p className="font-mono text-[0.66rem] text-ink3">{r.d}</p>
                  </div>
                  <p className="mt-0.5 font-mono text-[0.68rem] text-ink3">{r.o}</p>
                  <p className="mt-1 text-[0.8rem] text-ink2">{r.n}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
