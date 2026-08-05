import Stage from '../stage/Stage'
import { scrollToId } from '../../lib/useLenis'

const TICKER = [
  'Voice AI', 'RAG', 'Embeddings', 'PyTorch', 'LangChain', 'Kubernetes',
  'LoRA', 'FastAPI', 'Qdrant', 'WebRTC', 'Applied Mathematics',
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[var(--nav-h)]">
      <div className="shell">
        <div className="grid items-center gap-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:py-10">
          {/* ── type block ── */}
          <div className="order-2 lg:order-1">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 border-2 border-ink px-2.5 py-1 font-mono text-micro uppercase">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-moss" />
                Open to work
              </span>
              <span className="eyebrow-mute">New Delhi, India</span>
            </div>

            <h1 className="mega text-d1">
              Amir
              <br />
              Hamza
              <br />
              <span className="text-blaze">Khan</span>
            </h1>

            <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4">
              <p className="font-ui text-d3 font-semibold uppercase leading-none tracking-tight">
                AI Engineer
              </p>
              <p className="max-w-[34ch] font-body text-[0.98rem] leading-relaxed text-ink2">
                I build voice agents, retrieval systems and the models underneath them —
                and I came to all of it through mathematics.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToId('projects')} className="btn">
                See the work →
              </button>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Résumé
              </a>
            </div>
          </div>

          {/* ── the subject: 3D model when supplied, treated photo until then ── */}
          <div className="order-1 h-[clamp(320px,48vh,540px)] lg:order-2 lg:h-[clamp(420px,64vh,660px)]">
            <Stage />
          </div>
        </div>
      </div>

      {/* ── ticker: the speed element ── */}
      <div className="relative border-y-2 border-ink bg-ink py-2.5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {TICKER.map((t) => (
                <span
                  key={t + dup}
                  className="flex items-center gap-6 whitespace-nowrap px-6 font-mega text-[1.05rem] uppercase tracking-wide text-paper"
                >
                  {t}
                  <span className="h-1.5 w-1.5 rotate-45 bg-blaze" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
