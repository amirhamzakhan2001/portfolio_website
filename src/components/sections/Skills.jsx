import { useReveal } from '../../lib/useReveal'

/**
 * The full stack — every skill from Amir's own data, nothing trimmed.
 * A previous pass silently dropped eleven of these; they are all back.
 * ★ marks shipped to production.
 */

const GROUPS = [
  {
    id: '01',
    label: 'Languages & frameworks',
    items: [
      ['Python', 1], ['SQL', 1], ['FastAPI', 1], ['HTML5', 0], ['C', 0],
    ],
  },
  {
    id: '02',
    label: 'AI · ML · Deep learning',
    items: [
      ['PyTorch', 1], ['Scikit-learn', 0], ['TensorFlow / Keras', 0], ['Hugging Face', 1],
      ['Sentence Transformers', 1], ['OpenCLIP', 0], ['LoRA fine-tuning', 1],
      ['Model training & evaluation', 1], ['Transfer learning', 0], ['Feature engineering', 0],
    ],
  },
  {
    id: '03',
    label: 'Generative AI & NLP',
    items: [
      ['LangChain', 1], ['LangGraph', 0], ['OpenAI API', 1], ['Anthropic Claude', 1],
      ['Google Gemini', 1], ['RAG pipelines', 1], ['Prompt engineering', 1],
      ['Voice AI (STT/TTS)', 1], ['Text embeddings', 1], ['Transformers', 0],
    ],
  },
  {
    id: '04',
    label: 'Data & databases',
    items: [
      ['Pandas', 1], ['NumPy', 1], ['Matplotlib / Seaborn', 0], ['PostgreSQL', 1],
      ['Supabase', 1], ['MongoDB', 0], ['FAISS', 1], ['Qdrant', 1],
      ['Power BI', 0], ['Tableau', 0],
    ],
  },
  {
    id: '05',
    label: 'MLOps, cloud & tools',
    items: [
      ['Docker', 1], ['Kubernetes', 1], ['MLflow', 0], ['Git / GitHub', 0], ['AWS', 0],
      ['WebRTC', 1], ['Twilio API', 1], ['Jupyter', 0], ['VS Code', 0],
    ],
  },
  {
    id: '06',
    label: 'Foundations',
    items: [
      ['Linear algebra', 1], ['Probability', 1], ['Applied statistics', 1],
      ['Calculus', 0], ['Mathematical modelling', 0],
    ],
  },
]

export default function Skills() {
  const ref = useReveal({ selector: '.rv', stagger: 40 })
  const total = GROUPS.reduce((a, g) => a + g.items.length, 0)
  const prod = GROUPS.reduce((a, g) => a + g.items.filter(([, p]) => p).length, 0)

  return (
    <section id="skills" className="beat border-t-2 border-ink bg-sheet" ref={ref}>
      <div className="shell">
        <div className="rv mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Skills</p>
            <h2 className="mega text-d2">Everything I use.</h2>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="tnum mega text-[2.6rem] leading-none text-ink">{total}</p>
              <p className="font-mono text-[0.63rem] uppercase tracking-wider text-ink3">Total</p>
            </div>
            <div>
              <p className="tnum mega text-[2.6rem] leading-none text-blaze">{prod}</p>
              <p className="font-mono text-[0.63rem] uppercase tracking-wider text-ink3">
                In production
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.id} className="rv">
              <div className="mb-4 flex items-baseline gap-3 border-b-2 border-ink pb-3">
                <span className="mega text-[1.5rem] leading-none text-blaze">{g.id}</span>
                <h3 className="font-ui text-[1rem] font-semibold uppercase tracking-wide">
                  {g.label}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map(([name, isProd]) => (
                  <li
                    key={name}
                    className={`border px-2.5 py-1.5 font-ui text-[0.84rem] font-medium transition-colors duration-fast ${
                      isProd
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line2 bg-transparent text-ink2 hover:border-ink hover:text-ink'
                    }`}
                  >
                    {name}
                    {isProd ? <span className="ml-1.5 text-blaze">★</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="rv mt-10 font-mono text-[0.66rem] uppercase tracking-wider text-ink3">
          ★ / filled = shipped to production
        </p>
      </div>
    </section>
  )
}
