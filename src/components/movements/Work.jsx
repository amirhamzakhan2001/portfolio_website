import { useState } from 'react'
import { useReveal } from '../../lib/useReveal'

/**
 * Work as a ledger, not a card grid.
 *
 * Rows in an index: number, title, year, result. Opening one expands the
 * detail in place, so scanning stays fast and depth is opt-in — which is how
 * both audiences actually read a portfolio.
 */

const ENTRIES = [
  {
    id: 'nlp-email',
    title: 'Email categorisation at scale',
    year: '2025',
    kind: 'MSc major project',
    result: '96% accuracy · 0 manual labels',
    body: 'Sixty thousand real Gmail messages, no labelled training set, and no budget to make one. Transformer embeddings reduced with PCA, bisecting k-means to find natural clusters, then an LLM to name each cluster — which removes the human labelling step entirely. An MLP handles inference on new mail. Dockerised for incremental retraining.',
    tech: ['all-MiniLM-L6-v2', 'FAISS', 'PCA', 'MLP', 'LangChain', 'MLflow', 'Docker'],
    link: 'https://github.com/amirhamzakhan2001/nlp-email-categorization',
  },
  {
    id: 'amazon-ml',
    title: 'Amazon ML Challenge',
    year: '2025',
    kind: 'National competition',
    result: 'Top 2500 of 7000+ teams · SMAPE 54.6',
    body: 'Multi-modal price prediction from product images and text. OpenCLIP for vision, sentence transformers for copy, gradient boosting over the fused representation. Four of us, one weekend.',
    tech: ['PyTorch', 'OpenCLIP', 'Sentence Transformers', 'XGBoost'],
    link: 'https://github.com/amirhamzakhan2001/amazon_challange_2k25',
  },
  {
    id: 'transformer',
    title: 'Transformer from scratch',
    year: '2024',
    kind: 'Study',
    result: 'Full encoder–decoder, no frameworks',
    body: 'Attention, positional encoding, multi-head projection, feed-forward blocks — written from the mathematics up in plain PyTorch. The point was not to produce a model worth running. It was to be unable to hand-wave about how one works.',
    tech: ['PyTorch', 'NumPy'],
    link: 'https://github.com/amirhamzakhan2001/Transformer_scratch',
  },
  {
    id: 'ibm-quiz',
    title: 'AI quiz for rural learners',
    year: '2025',
    kind: 'IBM SkillBuild · team of 6',
    result: 'IBM AI Agent Architect certified',
    body: 'A multilingual quiz generator for grades 3–12, built as the AI and backend lead. Retrieval over curriculum material, auto-grading, and feedback written in the learner\'s own language.',
    tech: ['LangGraph', 'Gemini', 'RAG', 'FAISS', 'MongoDB Atlas'],
    link: 'https://github.com/amirhamzakhan2001/AI-Powered-Quiz',
  },
  {
    id: 'multitask',
    title: 'Multi-task text classification',
    year: '2024',
    kind: 'NLP project',
    result: 'Three tasks, one shared encoder',
    body: 'Emotion, violence type and hate speech detected simultaneously from a single shared embedding rather than three separate models — cheaper to serve and the tasks regularise each other.',
    tech: ['TensorFlow', 'Keras', 'LSTM', 'NLTK'],
    link: 'https://github.com/amirhamzakhan2001/nlp_emotion_detection',
  },
  {
    id: 'jmi-bot',
    title: 'University assistant',
    year: 'In progress',
    kind: 'Team project',
    result: 'Qwen fine-tuned with LoRA',
    body: 'A student query system for Jamia Millia Islamia, trained on department-specific material rather than answering generically. Retrieval plus a LoRA fine-tune, with two collaborators.',
    tech: ['Qwen', 'LoRA', 'RAG', 'FastAPI', 'React'],
    link: null,
  },
]

export default function Work() {
  const ref = useReveal()
  const [open, setOpen] = useState(null)

  return (
    <section id="work" className="movement border-t border-edge" ref={ref}>
      <div className="shell">
        <header className="reveal mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-16">
          <div>
            <p className="chan mb-5">Selected work</p>
            <h2 className="text-h2 max-w-[16ch]">Six things worth opening.</h2>
          </div>
          <p className="max-w-[30ch] font-mono text-[0.68rem] uppercase leading-relaxed tracking-wider text-mute">
            Voxa is covered above. Everything here is public — code linked where it exists.
          </p>
        </header>

        <ul className="border-t border-edge" data-reveal-group>
          {ENTRIES.map((e, i) => {
            const isOpen = open === e.id
            return (
              <li key={e.id} className="reveal border-b border-edge">
                <button
                  onClick={() => setOpen(isOpen ? null : e.id)}
                  aria-expanded={isOpen}
                  data-reticle
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 text-left transition-colors duration-attack md:grid-cols-[3rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] md:gap-6"
                >
                  <span className="tnum font-mono text-micro text-mute group-hover:text-signal">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="text-[1.08rem] leading-snug text-ink transition-colors duration-attack group-hover:text-signal md:text-[1.2rem]">
                    {e.title}
                    <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-wider text-mute">
                      {e.kind}
                    </span>
                  </span>

                  <span className="hidden font-mono text-[0.7rem] uppercase tracking-wider text-steel md:block">
                    {e.result}
                  </span>

                  <span
                    className={`font-mono text-micro text-mute transition-transform duration-settle ease-signal ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className="grid transition-all duration-settle ease-signal"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-6">
                      <span aria-hidden="true" />
                      <div className="flex flex-col gap-5">
                        <p className="max-w-measure font-serif text-[1.05rem] leading-relaxed text-dim">
                          {e.body}
                        </p>
                        <p className="font-mono text-[0.68rem] uppercase tracking-wider text-steel md:hidden">
                          {e.result}
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {e.tech.map((t) => (
                            <li
                              key={t}
                              className="rounded-chip border border-edge px-2 py-1 font-mono text-[0.63rem] uppercase tracking-wider text-mute"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                        {e.link && (
                          <a
                            href={e.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-reticle
                            className="link w-fit font-mono text-micro uppercase tracking-[0.12em]"
                          >
                            Source ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
