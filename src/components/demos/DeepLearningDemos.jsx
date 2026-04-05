import { useState, useRef, useEffect, useCallback } from 'react'

// ── Neural Network Visualizer ─────────────────────────────────────────────────
function NeuralNetwork() {
  const [layers, setLayers] = useState([3, 4, 4, 2])
  const [activations, setActivations] = useState(null)
  const canvasRef = useRef(null)

  const forward = useCallback(() => {
    const acts = [Array.from({ length: layers[0] }, () => Math.random())]
    for (let l = 1; l < layers.length; l++) {
      const prev = acts[l - 1]
      const curr = Array.from({ length: layers[l] }, () => {
        const z = prev.reduce((s, a) => s + a * (Math.random() * 2 - 1), 0)
        return 1 / (1 + Math.exp(-z)) // sigmoid
      })
      acts.push(curr)
    }
    setActivations(acts)
  }, [layers])

  useEffect(() => { forward() }, [forward])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !activations) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const maxN = Math.max(...layers)
    const layerX = layers.map((_, i) => 40 + (i / (layers.length - 1)) * (W - 80))
    const nodeY = (l, n, i) => H / 2 + (i - (n - 1) / 2) * Math.min(40, H / (maxN + 1))

    // Edges
    for (let l = 0; l < layers.length - 1; l++) {
      for (let i = 0; i < layers[l]; i++) {
        for (let j = 0; j < layers[l + 1]; j++) {
          const x1 = layerX[l], y1 = nodeY(l, layers[l], i)
          const x2 = layerX[l + 1], y2 = nodeY(l + 1, layers[l + 1], j)
          const act = activations[l][i]
          ctx.beginPath()
          ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
          ctx.strokeStyle = `rgba(99,102,241,${act * 0.5})`
          ctx.lineWidth = act * 1.5
          ctx.stroke()
        }
      }
    }

    // Nodes
    layers.forEach((n, l) => {
      for (let i = 0; i < n; i++) {
        const x = layerX[l], y = nodeY(l, n, i)
        const act = activations[l]?.[i] ?? 0
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(${Math.round(99 + act * 156)},${Math.round(102)},${Math.round(241 - act * 100)},0.9)`
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = '#fff'
        ctx.font = '8px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(act.toFixed(1), x, y)
      }
    })

    // Labels
    const labels = ['Input', ...Array.from({ length: layers.length - 2 }, (_, i) => `H${i + 1}`), 'Output']
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '9px monospace'
    ctx.textBaseline = 'bottom'
    layers.forEach((_, l) => {
      ctx.textAlign = 'center'
      ctx.fillText(labels[l], layerX[l], 14)
    })
  }, [activations, layers])

  const addLayer = () => setLayers(prev => [...prev.slice(0, -1), Math.round(2 + Math.random() * 4), prev[prev.length - 1]])
  const removeLayer = () => layers.length > 2 && setLayers(prev => [...prev.slice(0, -2), prev[prev.length - 1]])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={addLayer} className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-muted hover:bg-white/10 transition-all">+ Layer</button>
        <button onClick={removeLayer} disabled={layers.length <= 2} className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-muted hover:bg-white/10 transition-all disabled:opacity-40">- Layer</button>
        <button onClick={forward} className="px-3 py-1 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Forward Pass</button>
        <span className="text-xs font-mono text-text-muted ml-auto">Architecture: [{layers.join(', ')}]</span>
      </div>
      <canvas ref={canvasRef} width={520} height={220} className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 220 }} />
      <p className="text-[10px] font-mono text-text-muted text-center">Node brightness = activation strength. Click Forward Pass to run inference.</p>
    </div>
  )
}

// ── Activation Functions ──────────────────────────────────────────────────────
function ActivationFunctions() {
  const [selected, setSelected] = useState(['relu', 'sigmoid', 'tanh'])
  const canvasRef = useRef(null)

  const fns = {
    relu: { fn: x => Math.max(0, x), color: '#6366f1', label: 'ReLU' },
    sigmoid: { fn: x => 1 / (1 + Math.exp(-x)), color: '#06b6d4', label: 'Sigmoid' },
    tanh: { fn: x => Math.tanh(x), color: '#a855f7', label: 'Tanh' },
    leaky_relu: { fn: x => x >= 0 ? x : 0.1 * x, color: '#f59e0b', label: 'Leaky ReLU' },
    elu: { fn: x => x >= 0 ? x : Math.exp(x) - 1, color: '#22c55e', label: 'ELU' },
    swish: { fn: x => x / (1 + Math.exp(-x)), color: '#ef4444', label: 'Swish' },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const pad = { l: 40, r: 20, t: 20, b: 30 }
    const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b
    const xMin = -5, xMax = 5, yMin = -1.5, yMax = 1.5

    const toX = v => pad.l + (v - xMin) / (xMax - xMin) * gW
    const toY = v => pad.t + gH - (v - yMin) / (yMax - yMin) * gH

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(toX(i), pad.t); ctx.lineTo(toX(i), pad.t + gH); ctx.stroke() }
    for (let i = -1; i <= 1; i += 0.5) { ctx.beginPath(); ctx.moveTo(pad.l, toY(i)); ctx.lineTo(pad.l + gW, toY(i)); ctx.stroke() }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(pad.l + gW, toY(0)); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(toX(0), pad.t); ctx.lineTo(toX(0), pad.t + gH); ctx.stroke()

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '9px monospace'
    ctx.textAlign = 'center'
    for (let i = -4; i <= 4; i += 2) ctx.fillText(i, toX(i), pad.t + gH + 14)
    ctx.textAlign = 'right'
    for (let v = -1; v <= 1; v += 0.5) ctx.fillText(v.toFixed(1), pad.l - 4, toY(v) + 3)

    // Functions
    selected.forEach(id => {
      const { fn, color } = fns[id]
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      let first = true
      for (let px = 0; px <= gW; px++) {
        const x = xMin + (px / gW) * (xMax - xMin)
        const y = Math.max(yMin, Math.min(yMax, fn(x)))
        const cy = toY(y)
        if (first) { ctx.moveTo(pad.l + px, cy); first = false } else ctx.lineTo(pad.l + px, cy)
      }
      ctx.stroke()
    })
  }, [selected])

  const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(fns).map(([id, { label, color }]) => (
          <button key={id} onClick={() => toggle(id)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${selected.includes(id) ? 'border-opacity-80 text-white' : 'border-white/10 text-text-muted bg-white/5'}`}
            style={selected.includes(id) ? { borderColor: color, backgroundColor: color + '22', color } : {}}>
            {label}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={520} height={220} className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 220 }} />
    </div>
  )
}

// ── Backpropagation Visualizer ────────────────────────────────────────────────
function Backpropagation() {
  const [lr, setLr] = useState(0.1)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState([])
  const [weights, setWeights] = useState({ w1: 0.5, w2: -0.3, b: 0.1 })
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  // Simple XOR-like problem: learn y = x1 XOR x2
  const data = [{ x1: 0, x2: 0, y: 0 }, { x1: 0, x2: 1, y: 1 }, { x1: 1, x2: 0, y: 1 }, { x1: 1, x2: 1, y: 0 }]

  const sigmoid = z => 1 / (1 + Math.exp(-z))

  const step = useCallback(() => {
    setWeights(prev => {
      let { w1, w2, b } = prev
      let totalLoss = 0
      let dw1 = 0, dw2 = 0, db = 0

      data.forEach(({ x1, x2, y }) => {
        const z = w1 * x1 + w2 * x2 + b
        const pred = sigmoid(z)
        const err = pred - y
        totalLoss += 0.5 * err * err
        const dz = err * pred * (1 - pred)
        dw1 += dz * x1; dw2 += dz * x2; db += dz
      })

      setLoss(prev => [...prev.slice(-60), totalLoss / data.length])
      setEpoch(e => e + 1)

      return {
        w1: w1 - lr * dw1 / data.length,
        w2: w2 - lr * dw2 / data.length,
        b: b - lr * db / data.length,
      }
    })
  }, [lr])

  const toggle = () => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      intervalRef.current = setInterval(step, 80)
      setRunning(true)
    }
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setWeights({ w1: 0.5, w2: -0.3, b: 0.1 })
    setLoss([])
    setEpoch(0)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const currentLoss = loss[loss.length - 1] ?? 0.5

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button onClick={toggle} className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${running ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-accent-indigo/20 border-accent-indigo/30 text-accent-indigo'}`}>
          {running ? 'Pause' : 'Train'}
        </button>
        <button onClick={step} disabled={running} className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 disabled:opacity-40 transition-all">Step</button>
        <button onClick={reset} className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 transition-all">Reset</button>
        <label className="text-xs font-mono text-text-muted ml-auto">LR: <span className="text-accent-cyan">{lr}</span></label>
        <input type="range" min="0.01" max="1" step="0.01" value={lr} onChange={e => setLr(+e.target.value)} className="w-24 accent-indigo-500" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[{ label: 'Epoch', val: epoch, color: 'text-text-primary' }, { label: 'Loss', val: currentLoss.toFixed(4), color: currentLoss < 0.1 ? 'text-green-400' : 'text-red-400' }, { label: 'w1, w2, b', val: `${weights.w1.toFixed(2)}, ${weights.w2.toFixed(2)}, ${weights.b.toFixed(2)}`, color: 'text-accent-indigo' }].map(s => (
          <div key={s.label} className="glass rounded-lg p-2 border border-white/5 text-center">
            <div className="text-[9px] font-mono text-text-muted">{s.label}</div>
            <div className={`text-xs font-bold font-mono ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Loss curve */}
      {loss.length > 1 && (
        <svg viewBox={`0 0 ${loss.length} 100`} preserveAspectRatio="none" className="w-full h-20 rounded-xl bg-bg-primary/40 border border-white/5">
          <polyline
            points={loss.map((v, i) => `${i},${100 - v * 200}`).join(' ')}
            fill="none" stroke="#6366f1" strokeWidth={1.5} />
        </svg>
      )}

      {/* Predictions */}
      <div className="grid grid-cols-4 gap-2">
        {data.map(({ x1, x2, y }) => {
          const { w1, w2, b } = weights
          const pred = sigmoid(w1 * x1 + w2 * x2 + b)
          const correct = Math.round(pred) === y
          return (
            <div key={`${x1}${x2}`} className={`glass rounded-lg p-2 border text-center ${correct ? 'border-green-500/20' : 'border-red-500/20'}`}>
              <div className="text-[9px] font-mono text-text-muted">{x1} XOR {x2}</div>
              <div className="text-xs font-bold font-mono text-text-primary">{pred.toFixed(2)}</div>
              <div className={`text-[9px] ${correct ? 'text-green-400' : 'text-red-400'}`}>{correct ? '✓' : '✗'} want {y}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── CNN Feature Maps ──────────────────────────────────────────────────────────
function CNN() {
  const [kernel, setKernel] = useState('edge')
  const [zoom, setZoom] = useState(8)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  const kernels = {
    edge: { label: 'Edge Detect', k: [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]] },
    sharpen: { label: 'Sharpen', k: [[0,-1,0],[-1,5,-1],[0,-1,0]] },
    blur: { label: 'Blur', k: [[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]] },
    emboss: { label: 'Emboss', k: [[-2,-1,0],[-1,1,1],[0,1,2]] },
  }

  // Generate a simple 16x16 image
  const rawImage = useRef((() => {
    const img = []
    for (let y = 0; y < 16; y++) {
      img.push([])
      for (let x = 0; x < 16; x++) {
        // Simple pattern: circle
        const cx = 7.5, cy = 7.5
        const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        img[y].push(d < 5 ? (d < 3 ? 220 : 150) : 30)
      }
    }
    return img
  })())

  const convolve = k => {
    const img = rawImage.current
    const out = []
    for (let y = 1; y < 15; y++) {
      out.push([])
      for (let x = 1; x < 15; x++) {
        let sum = 0
        for (let ky = -1; ky <= 1; ky++)
          for (let kx = -1; kx <= 1; kx++)
            sum += img[y + ky][x + kx] * k[ky + 1][kx + 1]
        out[y - 1].push(Math.max(0, Math.min(255, sum + 128)))
      }
    }
    return out
  }

  const drawGrid = (canvas, grid, z) => {
    const ctx = canvas.getContext('2d')
    const s = z
    canvas.width = grid[0].length * s
    canvas.height = grid.length * s
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    grid.forEach((row, y) => row.forEach((v, x) => {
      ctx.fillStyle = `rgb(${v},${v},${v})`
      ctx.fillRect(x * s, y * s, s, s)
    }))
  }

  useEffect(() => {
    if (inputRef.current) drawGrid(inputRef.current, rawImage.current, zoom)
  }, [zoom])

  useEffect(() => {
    const k = kernels[kernel].k
    const out = convolve(k)
    if (outputRef.current) drawGrid(outputRef.current, out, zoom)
  }, [kernel, zoom])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {Object.entries(kernels).map(([id, { label }]) => (
          <button key={id} onClick={() => setKernel(id)}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${kernel === id ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
        <label className="ml-auto text-xs font-mono text-text-muted">Zoom: <span className="text-accent-cyan">{zoom}x</span></label>
        <input type="range" min={4} max={12} value={zoom} onChange={e => setZoom(+e.target.value)} className="w-20 accent-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-mono text-text-muted mb-1 text-center">Input Image</div>
          <canvas ref={inputRef} className="rounded-lg border border-white/10 w-full" style={{ imageRendering: 'pixelated' }} />
        </div>
        <div>
          <div className="text-[10px] font-mono text-text-muted mb-1 text-center">Feature Map (after conv)</div>
          <canvas ref={outputRef} className="rounded-lg border border-white/10 w-full" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>

      <div className="glass rounded-lg p-3 border border-white/5">
        <div className="text-[10px] font-mono text-text-muted mb-2">Kernel ({kernels[kernel].label}):</div>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {kernels[kernel].k.flat().map((v, i) => (
            <div key={i} className="text-center text-xs font-mono rounded p-1"
              style={{ background: `rgba(${v > 0 ? '99,102,241' : '239,68,68'},${Math.min(1, Math.abs(v)) * 0.4})`, color: v > 0 ? '#a5b4fc' : '#fca5a5' }}>
              {typeof v === 'number' ? (v % 1 !== 0 ? v.toFixed(2) : v) : v}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Transformer Attention ─────────────────────────────────────────────────────
function TransformerAttention() {
  const words = ['The', 'cat', 'sat', 'on', 'mat']
  const [selected, setSelected] = useState(1) // 'cat'
  const [temp, setTemp] = useState(1.0)

  const rawScores = [
    [0.9, 2.5, 1.2, 0.3, 0.7],
    [2.1, 0.8, 1.8, 0.4, 1.1],
    [1.0, 1.9, 0.7, 0.5, 2.0],
    [0.4, 0.3, 0.6, 0.8, 1.2],
    [0.7, 1.1, 2.3, 1.0, 0.6],
  ]

  const softmax = arr => {
    const max = Math.max(...arr)
    const exp = arr.map(x => Math.exp((x - max) / temp))
    const sum = exp.reduce((a, b) => a + b)
    return exp.map(v => v / sum)
  }

  const attnRow = softmax(rawScores[selected])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono text-text-muted">Query word:</span>
        {words.map((w, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${selected === i ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {w}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-text-muted">Temperature: <span className="text-accent-cyan">{temp.toFixed(1)}</span></span>
        <input type="range" min={0.1} max={3} step={0.1} value={temp} onChange={e => setTemp(+e.target.value)} className="flex-1 accent-indigo-500" />
      </div>

      {/* Attention bars */}
      <div className="space-y-2">
        {words.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-mono text-text-muted w-10 text-right">{w}</span>
            <div className="flex-1 h-8 bg-bg-primary/40 rounded-lg overflow-hidden relative border border-white/5">
              <div className="h-full transition-all duration-500 rounded-lg"
                style={{ width: `${attnRow[i] * 100}%`, background: `rgba(99,102,241,${0.3 + attnRow[i] * 0.7})` }} />
            </div>
            <span className="text-xs font-mono text-accent-indigo w-12">{(attnRow[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Full attention matrix */}
      <div className="overflow-x-auto">
        <table className="text-[9px] font-mono mx-auto">
          <thead>
            <tr><th />
              {words.map(w => <th key={w} className="text-text-muted px-2 py-1">{w}</th>)}
            </tr>
          </thead>
          <tbody>
            {rawScores.map((row, i) => {
              const attn = softmax(row)
              return (
                <tr key={i} className={selected === i ? 'ring-1 ring-accent-indigo/40 rounded' : ''}>
                  <td className="text-text-muted pr-2 py-0.5 text-right">{words[i]}</td>
                  {attn.map((v, j) => (
                    <td key={j} className="px-1 py-0.5 text-center rounded"
                      style={{ background: `rgba(99,102,241,${v * 0.9})`, color: v > 0.3 ? '#fff' : '#888', minWidth: 36 }}>
                      {v.toFixed(2)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] font-mono text-text-muted text-center">Increase temperature → uniform attention. Decrease → sharper focus.</p>
    </div>
  )
}

// ── LSTM Sequence ─────────────────────────────────────────────────────────────
function LSTMSequence() {
  const [seq, setSeq] = useState('1 0 1 1 0 0 1 0')
  const [result, setResult] = useState(null)

  const run = () => {
    const inputs = seq.split(/\s+/).map(Number).filter(v => !isNaN(v))
    if (inputs.length < 2) return

    // Simplified LSTM with fixed weights to demo the concept
    let h = 0, c = 0
    const states = []
    const Wf = 0.6, Wi = 0.5, Wo = 0.7, Wc = 0.4
    const Uf = 0.3, Ui = 0.35, Uo = 0.4, Uc = 0.3
    const bf = 0.1, bi = 0.1, bo = 0.1, bc = 0.0
    const sig = z => 1 / (1 + Math.exp(-z))

    inputs.forEach((x, t) => {
      const f = sig(Wf * x + Uf * h + bf)
      const i = sig(Wi * x + Ui * h + bi)
      const o = sig(Wo * x + Uo * h + bo)
      const cTilde = Math.tanh(Wc * x + Uc * h + bc)
      c = f * c + i * cTilde
      h = o * Math.tanh(c)
      states.push({ t, x, f: +f.toFixed(3), i: +i.toFixed(3), o: +o.toFixed(3), c: +c.toFixed(3), h: +h.toFixed(3) })
    })
    setResult(states)
  }

  useEffect(() => { run() }, [])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={seq} onChange={e => setSeq(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
          placeholder="Enter binary sequence..." />
        <button onClick={run} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Run</button>
      </div>

      {result && (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-white/10">
                {['t', 'x(t)', 'f(forget)', 'i(input)', 'o(output)', 'c(cell)', 'h(hidden)'].map(h => (
                  <th key={h} className="text-text-muted px-2 py-1.5 text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map(s => (
                <tr key={s.t} className="border-b border-white/5">
                  <td className="px-2 py-1 text-center text-text-muted">{s.t}</td>
                  <td className="px-2 py-1 text-center text-text-primary font-bold">{s.x}</td>
                  <td className="px-2 py-1 text-center" style={{ color: `rgba(239,68,68,${0.5 + s.f * 0.5})` }}>{s.f}</td>
                  <td className="px-2 py-1 text-center" style={{ color: `rgba(99,102,241,${0.5 + s.i * 0.5})` }}>{s.i}</td>
                  <td className="px-2 py-1 text-center" style={{ color: `rgba(6,182,212,${0.5 + s.o * 0.5})` }}>{s.o}</td>
                  <td className="px-2 py-1 text-center text-text-secondary">{s.c}</td>
                  <td className="px-2 py-1 text-center text-green-400">{s.h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] font-mono text-text-muted text-center">Watch how cell state (c) accumulates memory across time steps</p>
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
const COMPONENTS = {
  NeuralNetwork,
  ActivationFunctions,
  Backpropagation,
  CNN,
  TransformerAttention,
  LSTMSequence,
}

export default function DeepLearningDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
