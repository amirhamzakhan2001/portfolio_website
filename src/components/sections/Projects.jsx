import { useReveal } from '../../lib/useReveal'

/**
 * Projects as product features.
 *
 * Each one gets a full block, alternating side, with its own big number,
 * headline stat and spec list — the way a launch page walks through
 * features. Every project gets the same amount of room, so none dominates.
 */

const WORK = [
  {
    n: '01',
    title: 'Voxa',
    tagline: 'Voice agents that survive real callers',
    stat: 'In production',
    statSub: 'KreoHealth · 2026',
    body: 'A caller dials in and a full speech → model → speech loop holds the conversation. The hard part is barge-in: detecting that a human started talking over the agent, on a noisy phone line, then killing synthesis mid-word and handing the turn back without losing state.',
    specs: [['Pipeline', 'STT → LLM → TTS'], ['Detection', 'WebRTC + Silero-VAD'], ['Retrieval', 'Qdrant'], ['Scale', 'Multi-tenant']],
    tech: ['Python', 'FastAPI', 'LangChain', 'WebRTC', 'Kubernetes'],
    link: null,
    flag: 'Metrics pending clearance',
  },
  {
    n: '02',
    title: 'Email Categorisation',
    tagline: '60,000 emails, no labels, no budget',
    stat: '96%',
    statSub: 'Accuracy · MSc major project',
    body: 'No labelled training set and no money to make one. Transformer embeddings reduced with PCA, bisecting k-means to find the natural clusters, then an LLM to name each cluster — which removes the human labelling step entirely. An MLP handles inference on new mail.',
    specs: [['Embeddings', 'all-MiniLM-L6-v2'], ['Clustering', 'Bisecting k-means'], ['Index', 'FAISS'], ['Ops', 'Docker + MLflow']],
    tech: ['PyTorch', 'FAISS', 'PCA', 'LangChain', 'MLflow'],
    link: 'https://github.com/amirhamzakhan2001/nlp-email-categorization',
  },
  {
    n: '03',
    title: 'Transformer From Scratch',
    tagline: 'Attention, built from the maths up',
    stat: '0',
    statSub: 'Frameworks used',
    body: 'Full encoder–decoder in plain PyTorch — attention, positional encoding, multi-head projection, feed-forward blocks. The point was never to produce a model worth running. It was to be unable to hand-wave about how one works.',
    specs: [['Architecture', 'Encoder–decoder'], ['Written in', 'PyTorch + NumPy'], ['Scope', 'End to end'], ['Purpose', 'Understanding']],
    tech: ['PyTorch', 'NumPy'],
    link: 'https://github.com/amirhamzakhan2001/Transformer_scratch',
  },
  {
    n: '04',
    title: 'Amazon ML Challenge',
    tagline: 'Price prediction from pictures and words',
    stat: 'Top 2500',
    statSub: 'Of 7000+ teams · SMAPE 54.6',
    body: 'Multi-modal price prediction fusing product images and copy. OpenCLIP for vision, sentence transformers for text, gradient boosting over the fused representation. Four of us, one weekend.',
    specs: [['Vision', 'OpenCLIP'], ['Text', 'Sentence Transformers'], ['Head', 'XGBoost'], ['Team', '4 people']],
    tech: ['PyTorch', 'OpenCLIP', 'XGBoost'],
    link: 'https://github.com/amirhamzakhan2001/amazon_challange_2k25',
  },
  {
    n: '05',
    title: 'LLM Evaluation',
    tagline: 'Finding where models actually break',
    stat: '90+',
    statSub: 'Structured evaluations · Outlier AI',
    body: 'Grading model output against rubrics for hallucination, faithfulness, instruction-following and safety, across coding, reasoning and mathematics. The useful output is the failure library — where models repeatedly break on multi-step reasoning.',
    specs: [['Domains', 'Code · reasoning · maths'], ['Axes', 'Faithfulness, safety'], ['Method', 'Structured rubrics'], ['Status', 'Ongoing']],
    tech: ['Evaluation', 'Prompt engineering'],
    link: null,
  },
  {
    n: '06',
    title: 'AI Quiz For Rural Learners',
    tagline: 'Multilingual teaching, auto-graded',
    stat: 'IBM',
    statSub: 'AI Agent Architect certified',
    body: 'A quiz generator and grader for grades 3–12, built as the AI and backend lead in a team of six. Retrieval over curriculum material, auto-grading, and feedback written in the learner’s own language.',
    specs: [['Agents', 'LangGraph'], ['Model', 'Gemini'], ['Retrieval', 'FAISS + RAG'], ['Store', 'MongoDB Atlas']],
    tech: ['LangGraph', 'Gemini', 'RAG', 'MongoDB'],
    link: 'https://github.com/amirhamzakhan2001/AI-Powered-Quiz',
  },
  {
    n: '07',
    title: 'Multi-Task Classification',
    tagline: 'Three problems, one encoder',
    stat: '3-in-1',
    statSub: 'Shared-embedding architecture',
    body: 'Emotion, violence type and hate speech detected simultaneously from a single shared embedding rather than three separate models — cheaper to serve, and the tasks regularise each other.',
    specs: [['Backbone', 'LSTM'], ['Heads', '3 outputs'], ['Stack', 'TensorFlow / Keras'], ['Demo', 'Streamlit']],
    tech: ['TensorFlow', 'Keras', 'NLTK'],
    link: 'https://github.com/amirhamzakhan2001/nlp_emotion_detection',
  },
  {
    n: '08',
    title: 'University Assistant',
    tagline: 'A model that knows one department',
    stat: 'LoRA',
    statSub: 'Fine-tuned Qwen · in progress',
    body: 'A student query system for Jamia Millia Islamia trained on department-specific material instead of answering generically. Retrieval plus a LoRA fine-tune, built with two collaborators.',
    specs: [['Base', 'Qwen'], ['Method', 'LoRA'], ['Serving', 'FastAPI'], ['Front end', 'React']],
    tech: ['Qwen', 'LoRA', 'RAG', 'FastAPI'],
    link: null,
  },
  {
    n: '09',
    title: 'Cognivo',
    tagline: 'Helping people remember faces',
    stat: 'Health',
    statSub: 'Dementia support · in progress',
    body: 'A companion app that helps people with dementia recall names, relationships and places, with a family-side tracking and alert layer.',
    specs: [['Vision', 'Face recognition'], ['Model', 'Gemini'], ['Client', 'React Native'], ['Status', 'Building']],
    tech: ['Python', 'Gemini', 'Computer Vision'],
    link: 'https://github.com/amirhamzakhan2001/Cognivo',
  },
]

export default function Projects() {
  const ref = useReveal({ selector: '.rv', stagger: 50 })

  return (
    <section id="projects" className="beat" ref={ref}>
      <div className="shell">
        <div className="rv mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Projects</p>
            <h2 className="mega text-d2">
              Nine builds.
              <br />
              <span className="stroke-text">One engineer.</span>
            </h2>
          </div>
          <p className="max-w-[26ch] font-mono text-[0.68rem] uppercase leading-relaxed tracking-wider text-ink3">
            Every one gets the same room. Scroll through.
          </p>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {WORK.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <article key={p.n} className="rv grid gap-8 lg:grid-cols-2 lg:gap-16">
                {/* stat plate */}
                <div className={`${flip ? 'lg:order-2' : ''}`}>
                  <div className="relative border-2 border-ink bg-sheet p-7 md:p-9">
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 -top-2 h-full w-full border-2 border-blaze"
                      style={{ zIndex: -1 }}
                    />
                    <p className="mega text-[3.4rem] leading-none text-blaze md:text-[5rem]">
                      {p.stat}
                    </p>
                    <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-wider text-ink3">
                      {p.statSub}
                    </p>

                    <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-4 border-t-2 border-ink pt-5">
                      {p.specs.map(([k, v]) => (
                        <div key={k}>
                          <dt className="font-mono text-[0.6rem] uppercase tracking-wider text-ink3">
                            {k}
                          </dt>
                          <dd className="mt-0.5 font-ui text-[0.88rem] font-semibold leading-tight">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* copy */}
                <div className={`flex flex-col justify-center ${flip ? 'lg:order-1' : ''}`}>
                  <div className="mb-4 flex items-baseline gap-4">
                    <span className="mega text-[2.6rem] leading-none text-ink3">{p.n}</span>
                    <div className="h-0.5 flex-1 bg-ink" />
                  </div>
                  <h3 className="mega text-d3">{p.title}</h3>
                  <p className="mt-2 font-ui text-[1.15rem] font-semibold leading-snug text-blaze">
                    {p.tagline}
                  </p>
                  <p className="mt-4 max-w-measure font-body text-[1rem] leading-relaxed text-ink2">
                    {p.body}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2 !px-4">
                        Source ↗
                      </a>
                    )}
                    {p.flag && (
                      <span className="border-2 border-blaze px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-blaze">
                        {p.flag}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
