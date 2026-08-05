import { useReveal } from '../../lib/useReveal'

const PRINCIPLES = [
  {
    n: '01',
    t: 'Latency is a feeling, not a metric',
    d: 'A 900ms pause reads as hesitation. A 300ms pause reads as understanding. I optimise the pipeline against how the delay feels to the person on the line, then let the dashboard agree.',
  },
  {
    n: '02',
    t: 'Evaluate before you believe',
    d: 'I spend part of my week grading model output at Outlier — hallucination, faithfulness, instruction-following. It makes me distrustful of demos, including my own. Nothing ships on vibes.',
  },
  {
    n: '03',
    t: 'The maths is not decoration',
    d: 'Three years of applied mathematics before any of this. When an embedding space misbehaves or a loss curve lies, I can go down to the linear algebra rather than swapping libraries until it works.',
  },
]

export default function Approach() {
  const ref = useReveal()

  return (
    <section id="signal" className="movement border-t border-edge" ref={ref}>
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div>
            <p className="chan reveal mb-5">Approach</p>
            <h2 className="text-h2 reveal max-w-[16ch]">
              I came to language through mathematics.
            </h2>

            <figure className="reveal mt-10 max-w-[290px]">
              <div className="relative overflow-hidden rounded-panel border border-edge">
                <img
                  src="/ahk_profile_pic.png"
                  alt="Amir Hamza Khan"
                  width="580"
                  height="580"
                  loading="lazy"
                  decoding="async"
                  className="block w-full grayscale transition-all duration-[900ms] ease-signal hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/55 to-transparent" />
              </div>
              <figcaption className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-mute">
                Amir Hamza Khan · New Delhi
              </figcaption>
            </figure>
          </div>

          <div className="flex flex-col gap-8" data-reveal-group>
            <p className="reveal prose-signal">
              I did a BSc in Applied Mathematics before I wrote a line of production code —
              linear algebra, probability, the unglamorous parts. Then an MSc in AI and Machine
              Learning at Jamia Millia Islamia, where I am now.
            </p>
            <p className="reveal prose-signal">
              That order matters. I did not arrive at language models through a tutorial; I
              arrived through the geometry underneath them. It is why I once rebuilt a
              transformer end to end in plain PyTorch — not to use it, but to stop treating
              attention as a black box.
            </p>

            <div className="rule reveal my-2" />

            <ul className="flex flex-col gap-9">
              {PRINCIPLES.map((p) => (
                <li key={p.n} className="reveal grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="tnum pt-1 font-mono text-micro text-signal">{p.n}</span>
                  <div>
                    <h3 className="text-h3 mb-2">{p.t}</h3>
                    <p className="max-w-measure text-[0.97rem] leading-relaxed text-dim">{p.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
