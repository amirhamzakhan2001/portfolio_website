/**
 * SignalEngine — the audio layer behind the hero.
 *
 * Two modes:
 *   synthetic — no permission needed. A procedural signal, so the field is
 *               alive on first paint and never depends on a prompt.
 *   live      — the visitor's own microphone, analysed entirely in the
 *               browser. Nothing is recorded, stored, or sent anywhere; the
 *               stream is never connected to the audio destination, so it
 *               cannot feed back through the speakers either.
 *
 * It also runs a small energy-based voice activity detector, which is the
 * same first stage that gates barge-in in a real voice agent — the hero
 * demonstrates the thing the site is about rather than describing it.
 */

const FFT = 1024

export class SignalEngine {
  constructor() {
    this.mode = 'synthetic'
    this.status = 'idle' // idle | requesting | live | denied | unsupported
    this.ctx = null
    this.analyser = null
    this.stream = null
    this.time = new Float32Array(FFT)
    this.freq = new Uint8Array(FFT / 2)

    // VAD state
    this.rms = 0
    this.noiseFloor = 0.006
    this.speaking = false
    this.speechFrames = 0
    this.silenceFrames = 0
    this.onChange = null

    this._t = Math.random() * 1000
  }

  get supported() {
    return typeof window !== 'undefined' && !!(navigator.mediaDevices?.getUserMedia && (window.AudioContext || window.webkitAudioContext))
  }

  _emit() {
    if (this.onChange) this.onChange(this.status)
  }

  async enable() {
    if (!this.supported) {
      this.status = 'unsupported'
      this._emit()
      return false
    }
    this.status = 'requesting'
    this._emit()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      const Ctx = window.AudioContext || window.webkitAudioContext
      this.ctx = new Ctx()
      if (this.ctx.state === 'suspended') await this.ctx.resume()

      const source = this.ctx.createMediaStreamSource(stream)
      const analyser = this.ctx.createAnalyser()
      analyser.fftSize = FFT
      analyser.smoothingTimeConstant = 0.72
      source.connect(analyser) // deliberately NOT connected to destination

      this.stream = stream
      this.analyser = analyser
      this.mode = 'live'
      this.status = 'live'
      this._emit()
      return true
    } catch (err) {
      this.status = err?.name === 'NotAllowedError' ? 'denied' : 'unsupported'
      this._emit()
      return false
    }
  }

  disable() {
    this.stream?.getTracks().forEach((t) => t.stop())
    this.ctx?.close()
    this.stream = null
    this.ctx = null
    this.analyser = null
    this.mode = 'synthetic'
    this.status = 'idle'
    this.speaking = false
    this.rms = 0
    this._emit()
  }

  /**
   * Advance one frame.
   * @param {number} dt seconds since last frame
   * @param {number} drive 0..1 — cursor energy, used only in synthetic mode
   * @returns {Float32Array} normalised waveform, -1..1
   */
  sample(dt, drive = 0) {
    if (this.mode === 'live' && this.analyser) {
      this.analyser.getFloatTimeDomainData(this.time)
      this.analyser.getByteFrequencyData(this.freq)

      let sum = 0
      for (let i = 0; i < this.time.length; i++) sum += this.time[i] * this.time[i]
      const rms = Math.sqrt(sum / this.time.length)
      this.rms += (rms - this.rms) * 0.35

      // adapt the floor downward during silence so the detector survives a noisy room
      if (!this.speaking) this.noiseFloor += (Math.max(rms, 0.002) - this.noiseFloor) * 0.02

      const threshold = Math.max(this.noiseFloor * 2.6, 0.012)
      if (this.rms > threshold) {
        this.speechFrames++
        this.silenceFrames = 0
      } else {
        this.silenceFrames++
        this.speechFrames = 0
      }
      // hangover both ways: 3 frames to open, 14 to close. Prevents chatter.
      if (!this.speaking && this.speechFrames > 3) this.speaking = true
      else if (this.speaking && this.silenceFrames > 14) this.speaking = false

      return this.time
    }

    // ── synthetic ──
    this._t += dt
    const t = this._t
    const amp = 0.10 + drive * 0.42
    const n = this.time.length
    for (let i = 0; i < n; i++) {
      const p = i / n
      const env = Math.sin(p * Math.PI) // taper at both ends
      this.time[i] =
        env *
        amp *
        (Math.sin(p * 34 + t * 2.1) * 0.55 +
          Math.sin(p * 71 - t * 1.35) * 0.28 +
          Math.sin(p * 143 + t * 3.4) * 0.13 +
          (Math.random() - 0.5) * 0.09)
    }
    this.rms = amp * 0.42
    this.speaking = drive > 0.55
    return this.time
  }
}
