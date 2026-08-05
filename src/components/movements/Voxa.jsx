import { useCallback, useEffect, useRef, useState } from 'react'
import { useReveal } from '../../lib/useReveal'

/**
 * The Voxa case study.
 *
 * A voice agent lives or dies on one number: how long the caller waits
 * between finishing their sentence and hearing a reply. So the case study is
 * that turn, played back at real speed, with a working interruption.
 *
 * Timings below are the shape of the pipeline, not a claim about production
 * numbers — those need Amir's sign-off on what is publishable.
 */

const STAGES = [
  { id: 'vad', label: 'Endpointing', detail: 'Silero-VAD · hangover', ms: 180, who: 'edge' },
  { id: 'stt', label: 'Transcribe', detail: 'Deepgram streaming', ms: 120, who: 'stt' },
  { id: 'llm', label: 'Reason', detail: 'LLM · first token', ms: 320, who: 'llm' },
  { id: 'tts', label: 'Speak', detail: 'ElevenLabs · first audio', ms: 140, who: 'tts' },
]
const TO_FIRST_AUDIO = STAGES.reduce((a, s) => a + s.ms, 0)
const AGENT_SPEECH_MS = 3600
const YIELD_MS = 210 // detection → audio stops

const FACTS = [
  ['LLM providers', '5', 'swappable per tenant'],
  ['Telephony integrations', '9', 'Twilio and others'],
  ['Channels', '4', 'call · SMS · email · WhatsApp'],
  ['CRMs', '3', 'bidirectional sync'],
]

export default function Voxa() {
  const ref = useReveal()
  const [phase, setPhase] = useState('idle') // idle | turn | speaking | yielded
  const [yielded, setYielded] = useState(null)

  const rafRef = useRef(null)
  const startRef = useRef(0)
  const speakStartRef = useRef(0)
  const playheadRef = useRef(null)
  const clockRef = useRef(null)
  const stageRefs = useRef({})

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  useEffect(() => () => stop(), [stop])

  /** Return the instrument to rest. Distinct from paint(0) — at rest no
   *  stage is active, whereas elapsed=0 sits inside the first stage. */
  const reset = useCallback(() => {
    if (playheadRef.current) playheadRef.current.style.width = '0%'
    if (clockRef.current) clockRef.current.textContent = '0 ms'
    for (const s of STAGES) {
      const el = stageRefs.current[s.id]
      if (el) el.dataset.state = 'idle'
    }
  }, [])

  const paint = useCallback((elapsed, speaking) => {
    // playhead across the latency track
    const pct = Math.min(1, elapsed / TO_FIRST_AUDIO)
    if (playheadRef.current) playheadRef.current.style.width = `${pct * 100}%`
    if (clockRef.current) {
      clockRef.current.textContent = `${Math.round(Math.min(elapsed, TO_FIRST_AUDIO))} ms`
    }

    // light each stage as the playhead crosses it
    let acc = 0
    for (const s of STAGES) {
      const el = stageRefs.current[s.id]
      if (!el) continue
      const active = elapsed >= acc && elapsed < acc + s.ms
      const done = elapsed >= acc + s.ms
      el.dataset.state = speaking ? 'done' : active ? 'active' : done ? 'done' : 'idle'
      acc += s.ms
    }
  }, [])

  const run = useCallback(() => {
    stop()
    setYielded(null)
    setPhase('turn')
    startRef.current = performance.now()

    const tick = (now) => {
      const elapsed = now - startRef.current

      if (elapsed < TO_FIRST_AUDIO) {
        paint(elapsed, false)
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      // agent is now speaking — interruptible
      if (!speakStartRef.current) {
        speakStartRef.current = now
        setPhase('speaking')
      }
      paint(TO_FIRST_AUDIO, true)

      if (now - speakStartRef.current > AGENT_SPEECH_MS) {
        speakStartRef.current = 0
        setPhase('idle')
        reset()
        stop()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    speakStartRef.current = 0
    rafRef.current = requestAnimationFrame(tick)
  }, [paint, reset, stop])

  const bargeIn = useCallback(() => {
    if (phase !== 'speaking') return
    const spokenFor = Math.round(performance.now() - speakStartRef.current)
    stop()
    speakStartRef.current = 0
    setYielded({ spokenFor, yieldMs: YIELD_MS })
    setPhase('yielded')
    reset()
  }, [phase, reset, stop])

  const speaking = phase === 'speaking'

  return (
    <section id="voxa" className="movement" ref={ref}>
      <div className="shell">
        <header className="reveal mb-12 md:mb-16">
          <p className="chan mb-5">Case study 01 · production</p>
          <h2 className="text-h2 max-w-[18ch]">
            Voxa — a voice agent that knows when to stop talking.
          </h2>
        </header>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="flex flex-col gap-6" data-reveal-group>
            <p className="reveal prose-signal">
              Voxa is an omnichannel communication platform I built during my AI internship at
              KreoHealth. The part I own end to end is the voice agent: a caller dials in, and a
              full <strong>speech → language model → speech</strong> loop holds the conversation.
            </p>
            <p className="reveal prose-signal">
              The demo everybody builds works because the caller is polite. Real callers
              interrupt. They say "no, wait —" halfway through the agent's sentence, and if the
              agent keeps talking over them, the illusion collapses and the call is lost.
            </p>
            <p className="reveal prose-signal">
              That problem is <em>barge-in</em>, and it was the hardest thing I solved here. It
              means running voice activity detection on the caller's channel <em>while</em> the
              agent's own audio is playing, over a phone line, in a noisy room — then killing
              synthesis mid-word and re-entering the loop without losing conversational state.
            </p>
            <p className="reveal prose-signal">
              I built it with WebRTC and Silero-VAD, with an adaptive noise floor so a rickshaw
              horn does not read as speech and a soft "hmm" still does. Below is one turn of that
              loop, at real speed. Interrupt it.
            </p>
          </div>

          {/* ── the instrument ── */}
          <div className="reveal panel grain relative overflow-hidden p-5 md:p-6">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <span className="chan">Turn latency</span>
              <span ref={clockRef} className="tnum font-mono text-micro text-dim">
                0 ms
              </span>
            </div>

            {/* latency track */}
            <div className="relative mb-1 h-1.5 w-full overflow-hidden bg-edge">
              <div ref={playheadRef} className="h-full w-0 bg-signal" />
            </div>
            <div className="mb-6 flex justify-between font-mono text-[0.6rem] uppercase tracking-wider text-mute">
              <span>caller stops</span>
              <span className="tnum">{TO_FIRST_AUDIO} ms budget</span>
            </div>

            {/* stages */}
            <ol className="mb-6 flex flex-col gap-1.5">
              {STAGES.map((s) => (
                <li
                  key={s.id}
                  ref={(el) => (stageRefs.current[s.id] = el)}
                  data-state="idle"
                  className="group flex items-center gap-3 border-l-2 border-edge py-1.5 pl-3 transition-colors duration-attack data-[state=active]:border-signal data-[state=done]:border-steel-deep"
                >
                  <span className="flex-1 text-[0.9rem] text-dim transition-colors duration-attack group-data-[state=active]:text-ink">
                    {s.label}
                    <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-wider text-mute">
                      {s.detail}
                    </span>
                  </span>
                  <span className="tnum font-mono text-[0.7rem] text-mute group-data-[state=active]:text-signal">
                    {s.ms}ms
                  </span>
                </li>
              ))}
            </ol>

            {/* agent speech state */}
            <div
              className={`mb-5 flex items-center gap-3 border border-dashed px-3 py-2.5 transition-colors duration-attack ${
                speaking ? 'border-signal/50 bg-signal/5' : 'border-edge'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${speaking ? 'animate-breathe bg-signal' : 'bg-mute'}`}
              />
              <span className="font-mono text-micro uppercase tracking-[0.12em] text-dim">
                {speaking ? 'Agent speaking — interruptible' : 'Agent idle'}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={run}
                data-reticle
                className="rounded-chip border border-edge px-4 py-2 font-mono text-micro uppercase tracking-[0.12em] text-dim transition-colors duration-attack hover:border-signal hover:text-signal"
              >
                {phase === 'idle' || phase === 'yielded' ? 'Play one turn' : 'Restart'}
              </button>
              <button
                onClick={bargeIn}
                disabled={!speaking}
                data-reticle
                className="rounded-chip border border-signal bg-signal px-4 py-2 font-mono text-micro uppercase tracking-[0.12em] text-void transition-opacity duration-attack disabled:border-edge disabled:bg-transparent disabled:text-mute disabled:opacity-50"
              >
                Interrupt
              </button>
            </div>

            {yielded && (
              <div className="mt-5 border-t border-edge pt-4">
                <p className="font-mono text-micro uppercase tracking-[0.12em] text-live">
                  Agent yielded
                </p>
                <p className="mt-2 max-w-[42ch] text-[0.86rem] leading-relaxed text-dim">
                  Speech detected on the caller channel{' '}
                  <span className="tnum text-ink">{yielded.spokenFor} ms</span> into the agent's
                  reply. Synthesis cancelled and the turn handed back in{' '}
                  <span className="tnum text-ink">{yielded.yieldMs} ms</span> — before the caller
                  finished their first word.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── what else is in the box ── */}
        <div className="mt-16 md:mt-20" data-reveal-group>
          <div className="rule reveal mb-8" />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {FACTS.map(([k, v, note]) => (
              <div key={k} className="reveal">
                <dd className="tnum font-display text-[2.4rem] font-medium leading-none text-signal">
                  {v}
                </dd>
                <dt className="mt-2 text-[0.9rem] text-ink">{k}</dt>
                <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-mute">
                  {note}
                </p>
              </div>
            ))}
          </dl>
          <p className="reveal mt-10 max-w-measure font-serif text-[1rem] italic leading-relaxed text-mute">
            Also in Voxa: a retrieval layer over Qdrant so an agent answers from a tenant's own
            uploaded documents rather than guessing, and multi-tenant configuration so each
            business sets its own voice, script and conversation flow without touching code.
          </p>
        </div>
      </div>
    </section>
  )
}
