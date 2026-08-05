import { useReveal } from '../../lib/useReveal'

/**
 * Tools grouped by the problem they solve, never by rating.
 * A percentage bar next to "PyTorch" tells a reader nothing true;
 * "used in production" does.
 */

const GROUPS = [
  {
    q: 'Getting speech in and out',
    tools: [
      ['WebRTC', 1], ['Silero-VAD', 1], ['Deepgram', 1], ['ElevenLabs', 1], ['Twilio', 1],
    ],
  },
  {
    q: 'Making models do the job',
    tools: [
      ['LangChain', 1], ['LangGraph', 0], ['OpenAI', 1], ['Claude', 1], ['Gemini', 1],
      ['Prompt engineering', 1], ['LoRA fine-tuning', 1],
    ],
  },
  {
    q: 'Finding the right context',
    tools: [
      ['Qdrant', 1], ['FAISS', 1], ['Sentence Transformers', 1], ['RAG pipelines', 1], ['PCA', 0],
    ],
  },
  {
    q: 'Training and evaluating',
    tools: [
      ['PyTorch', 1], ['Hugging Face', 1], ['scikit-learn', 0], ['TensorFlow / Keras', 0],
      ['OpenCLIP', 0], ['MLflow', 0],
    ],
  },
  {
    q: 'Shipping and keeping it up',
    tools: [
      ['FastAPI', 1], ['Docker', 1], ['Kubernetes', 1], ['Supabase', 1], ['PostgreSQL', 1],
      ['MongoDB', 0], ['AWS', 0],
    ],
  },
  {
    q: 'The layer underneath',
    tools: [
      ['Python', 1], ['SQL', 1], ['Pandas', 1], ['NumPy', 1], ['Applied mathematics', 1],
    ],
  },
]

export default function Instruments() {
  const ref = useReveal()

  return (
    <section id="instruments" className="movement border-t border-edge" ref={ref}>
      <div className="shell">
        <header className="reveal mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="chan mb-5">Instruments</p>
            <h2 className="text-h2 max-w-[18ch]">What I reach for, and what for.</h2>
          </div>
          <p className="flex items-center gap-2.5 font-mono text-[0.68rem] uppercase tracking-wider text-mute">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            shipped to production
          </p>
        </header>

        {/* Column flow, not a grid: groups have uneven lengths, and a grid would
            pad every short group out to the tallest row. */}
        <div className="gap-x-12 sm:columns-2 lg:columns-3" data-reveal-group>
          {GROUPS.map((g) => (
            <div key={g.q} className="reveal mb-10 break-inside-avoid">
              <h3 className="mb-4 border-b border-edge pb-3 font-serif text-[1.12rem] font-normal italic text-ink">
                {g.q}
              </h3>
              <ul className="flex flex-col gap-2">
                {g.tools.map(([name, prod]) => (
                  <li key={name} className="flex items-center gap-2.5">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${prod ? 'bg-signal' : 'bg-edge'}`}
                      aria-hidden="true"
                    />
                    <span className={`text-[0.92rem] ${prod ? 'text-ink' : 'text-mute'}`}>
                      {name}
                    </span>
                    {prod === 1 && <span className="sr-only">(used in production)</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
