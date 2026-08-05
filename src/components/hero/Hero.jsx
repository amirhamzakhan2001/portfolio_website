import SignalField from './SignalField'
import { scrollToId } from '../../lib/useLenis'

const FACTS = [
  { k: 'Now', v: 'AI Engineer, KreoHealth' },
  { k: 'Shipped', v: 'Voice agents in production' },
  { k: 'Studying', v: 'MSc AI/ML · Jamia Millia Islamia' },
  { k: 'Based', v: 'Delhi NCR, India' },
]

export default function Hero() {
  return (
    // The instrument sits at the bottom of the first screen, always in view —
    // it is the proof, and proof below the fold is proof nobody sees.
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-[var(--nav-h)]">
      <div className="shell flex flex-1 flex-col justify-center py-[clamp(1.5rem,4vh,3rem)]">
        <p className="chan mb-5">AI Engineer · Voice &amp; language systems</p>

        {/* The thesis. Real text, server-independent, readable before anything animates. */}
        <h1 className="text-h1 font-semibold text-ink">
          I build machines
          <br />
          that <span className="font-serif font-normal italic text-signal">listen</span>.
        </h1>

        <div className="mt-7 grid gap-7 md:mt-9 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
          <p className="prose-signal">
            Most conversational systems wait politely for you to finish. The hard part is
            everything else — knowing when to <strong>stop talking</strong>, what to remember, and
            what a person actually meant. I work on that layer: real-time speech pipelines,
            retrieval, and the evaluation that tells you whether any of it actually works.
          </p>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-1 md:gap-y-3">
            {FACTS.map((f) => (
              <div key={f.k} className="border-l border-edge pl-3">
                <dt className="font-mono text-micro uppercase tracking-[0.14em] text-mute">{f.k}</dt>
                <dd className="mt-0.5 text-[0.92rem] leading-snug text-dim">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <button
            onClick={() => scrollToId('voxa')}
            data-reticle
            className="group inline-flex items-center gap-3 border-b border-signal/40 pb-1 font-mono text-micro uppercase tracking-[0.14em] text-signal transition-colors duration-attack hover:border-signal"
          >
            Read the Voxa case study
            <span className="transition-transform duration-settle ease-signal group-hover:translate-x-1">→</span>
          </button>
          <a
            href="mailto:amirhamzakhan2001@gmail.com"
            data-reticle
            className="font-mono text-micro uppercase tracking-[0.14em] text-mute transition-colors duration-attack hover:text-ink"
          >
            Get in touch
          </a>
        </div>
      </div>

      <SignalField />
    </section>
  )
}
