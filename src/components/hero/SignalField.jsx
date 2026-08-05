import { useEffect, useRef, useState } from 'react'
import { SignalEngine } from '../../lib/signalEngine'

/**
 * The hero instrument.
 *
 * A live scope showing a waveform, an adaptive noise floor, and a voice
 * activity gate. It runs on a synthetic signal by default so it is alive on
 * first paint, and can be handed the visitor's own microphone — at which
 * point the page is running the same first stage that gates barge-in in a
 * production voice agent, on them.
 *
 * Per-frame values are written straight to DOM nodes rather than React
 * state; only `status`, which changes a handful of times, round-trips
 * through React.
 */
export default function SignalField() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const engineRef = useRef(null)
  const rmsRef = useRef(null)
  const gateRef = useRef(null)
  const meterRef = useRef(null)
  const [status, setStatus] = useState('idle')

  if (!engineRef.current) engineRef.current = new SignalEngine()

  useEffect(() => {
    const engine = engineRef.current
    engine.onChange = setStatus

    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')

    let W = 0
    let H = 0
    let dpr = 1
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // pointer drives the synthetic signal so the field responds before any permission
    let drive = 0
    let driveTarget = 0
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      const inside = x >= 0 && x <= 1 && y >= -0.6 && y <= 1.6
      driveTarget = inside ? Math.max(0, 1 - Math.abs(y - 0.5) * 1.6) : 0
    }
    const onLeave = () => {
      driveTarget = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    wrap.addEventListener('pointerleave', onLeave)

    // rolling level history — the recorder strip along the bottom
    const HIST = 220
    const hist = new Array(HIST).fill(0)
    let histAcc = 0

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let last = performance.now()
    let frame

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      drive += (driveTarget - drive) * 0.08

      const wave = engine.sample(dt, drive)
      const speaking = engine.speaking
      const mid = H * 0.5

      ctx.clearRect(0, 0, W, H)

      // ── baseline + threshold rails ──
      ctx.strokeStyle = 'rgba(126,150,184,0.16)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, mid)
      ctx.lineTo(W, mid)
      ctx.stroke()

      const thr = Math.max(engine.noiseFloor * 2.6, 0.012)
      const thrPx = Math.min(thr * H * 3.2, H * 0.42)
      ctx.setLineDash([3, 5])
      ctx.strokeStyle = 'rgba(126,150,184,0.28)'
      ctx.beginPath()
      ctx.moveTo(0, mid - thrPx)
      ctx.lineTo(W, mid - thrPx)
      ctx.moveTo(0, mid + thrPx)
      ctx.lineTo(W, mid + thrPx)
      ctx.stroke()
      ctx.setLineDash([])

      // ── the waveform ──
      const n = wave.length
      const gain = H * 0.42
      ctx.beginPath()
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * W
        const y = mid - Math.max(-1, Math.min(1, wave[i])) * gain
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.lineWidth = speaking ? 1.9 : 1.3
      ctx.strokeStyle = speaking ? '#FFC170' : '#F0A340'
      if (speaking && !reduced) {
        ctx.shadowColor = 'rgba(240,163,64,0.55)'
        ctx.shadowBlur = 14
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // ── spectrum, live mode only ──
      if (engine.mode === 'live') {
        const bins = 64
        const step = Math.floor(engine.freq.length / bins)
        const bw = W / bins
        for (let b = 0; b < bins; b++) {
          let v = 0
          for (let k = 0; k < step; k++) v += engine.freq[b * step + k]
          v = v / step / 255
          const h = v * H * 0.3
          ctx.fillStyle = `rgba(126,150,184,${0.10 + v * 0.3})`
          ctx.fillRect(b * bw + 1, H - h, bw - 2, h)
        }
      }

      // ── level history strip ──
      histAcc += dt
      if (histAcc > 0.032) {
        histAcc = 0
        hist.push(Math.min(1, engine.rms * 7))
        hist.shift()
      }
      ctx.beginPath()
      for (let i = 0; i < HIST; i++) {
        const x = (i / (HIST - 1)) * W
        const y = H - 2 - hist[i] * (H * 0.16)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(240,163,64,0.30)'
      ctx.lineWidth = 1
      ctx.stroke()

      // ── readouts (DOM, not canvas — keeps them selectable and accessible) ──
      if (rmsRef.current) rmsRef.current.textContent = engine.rms.toFixed(4)
      if (meterRef.current) meterRef.current.style.width = `${Math.min(100, engine.rms * 700)}%`
      if (gateRef.current) {
        const open = speaking
        gateRef.current.dataset.open = open ? 'yes' : 'no'
        gateRef.current.textContent = open ? 'SPEECH' : 'SILENCE'
      }

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      engine.onChange = null
      engine.disable()
    }
  }, [])

  const live = status === 'live'
  const label =
    status === 'requesting'
      ? 'Requesting…'
      : live
        ? 'Stop listening'
        : status === 'denied'
          ? 'Mic blocked'
          : status === 'unsupported'
            ? 'Unavailable'
            : 'Let it listen'

  const toggle = () => {
    const engine = engineRef.current
    if (!engine) return
    live ? engine.disable() : engine.enable()
  }

  return (
    <div className="relative">
      {/* the scope */}
      <div
        ref={wrapRef}
        className="relative h-[clamp(104px,16vh,170px)] w-full overflow-hidden border-y border-edge bg-panel/60"
      >
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent" />
      </div>

      {/* the readout strip */}
      <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2.5 py-2.5 font-mono text-micro uppercase tracking-[0.12em]">
        <span className="flex items-center gap-2 text-mute">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${live ? 'animate-breathe bg-live' : 'bg-mute'}`}
          />
          {live ? 'Live input' : 'Synthetic signal'}
        </span>

        <span className="text-mute">
          RMS <span ref={rmsRef} className="tnum text-dim">0.0000</span>
        </span>

        <span className="flex items-center gap-2 text-mute">
          Gate
          <span
            ref={gateRef}
            data-open="no"
            className="tnum text-dim data-[open=yes]:text-signal"
          >
            SILENCE
          </span>
        </span>

        <span className="hidden h-3 w-24 overflow-hidden bg-edge sm:block" aria-hidden="true">
          <span ref={meterRef} className="block h-full w-0 bg-signal/70" />
        </span>

        <button
          onClick={toggle}
          disabled={status === 'requesting' || status === 'unsupported'}
          data-reticle
          className="ml-auto rounded-chip border border-signal/40 px-3 py-1.5 text-signal transition-colors duration-attack hover:bg-signal hover:text-void disabled:opacity-40"
        >
          {label}
        </button>
      </div>

      <div className="shell pb-1">
        <p className="max-w-measure font-mono text-[0.68rem] leading-relaxed tracking-wide text-mute">
          {live
            ? 'Speak — the gate above is an energy-based voice activity detector with an adaptive noise floor. It is the same first stage that decides when an agent should stop talking. Audio is analysed in your browser and never leaves it.'
            : 'Move your cursor across the scope. Or hand it your microphone — the analysis runs entirely in your browser, nothing is recorded or sent anywhere.'}
        </p>
      </div>
    </div>
  )
}
