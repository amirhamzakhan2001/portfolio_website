import { useState, useRef, useEffect, useCallback } from 'react'

// ── Distribution Explorer ─────────────────────────────────────────────────────
function DistributionExplorer() {
  const [dist, setDist] = useState('normal')
  const [param1, setParam1] = useState(0)   // mean / lambda / p
  const [param2, setParam2] = useState(1)   // std / k / n
  const canvasRef = useRef(null)

  const distributions = [
    { id: 'normal', label: 'Normal', p1: 'Mean', p2: 'Std', p1Range: [-3, 3], p2Range: [0.1, 3] },
    { id: 'uniform', label: 'Uniform', p1: 'Min', p2: 'Max', p1Range: [-5, 0], p2Range: [0, 5] },
    { id: 'exponential', label: 'Exponential', p1: 'λ (rate)', p2: '', p1Range: [0.1, 3], p2Range: [0, 1] },
    { id: 'binomial', label: 'Binomial', p1: 'n (trials)', p2: 'p (prob)', p1Range: [1, 30], p2Range: [0.01, 0.99] },
  ]
  const current = distributions.find(d => d.id === dist)

  const normalPDF = (x, mu, sigma) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))
  const uniformPDF = (x, a, b) => (x >= a && x <= b) ? 1 / (b - a) : 0
  const expPDF = (x, lam) => x >= 0 ? lam * Math.exp(-lam * x) : 0
  const binomPMF = (k, n, p) => {
    if (k < 0 || k > n) return 0
    let logC = 0
    for (let i = 0; i < k; i++) logC += Math.log(n - i) - Math.log(i + 1)
    return Math.exp(logC + k * Math.log(p) + (n - k) * Math.log(1 - p))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const pad = { l: 40, r: 20, t: 20, b: 30 }
    const gW = W - pad.l - pad.r, gH = H - pad.t - pad.b

    // axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gH); ctx.lineTo(pad.l + gW, pad.t + gH); ctx.stroke()

    let points = []
    if (dist === 'normal') {
      const mu = param1, sigma = Math.max(0.1, param2)
      for (let i = 0; i <= 200; i++) {
        const x = mu - 4 * sigma + (8 * sigma * i / 200)
        points.push({ x, y: normalPDF(x, mu, sigma) })
      }
    } else if (dist === 'uniform') {
      const a = param1, b = Math.max(param1 + 0.1, param2)
      for (let i = 0; i <= 200; i++) {
        const x = a - 1 + (b - a + 2) * i / 200
        points.push({ x, y: uniformPDF(x, a, b) })
      }
    } else if (dist === 'exponential') {
      const lam = Math.max(0.1, param1)
      for (let i = 0; i <= 200; i++) {
        const x = 8 * i / 200
        points.push({ x, y: expPDF(x, lam) })
      }
    } else if (dist === 'binomial') {
      const n = Math.round(Math.max(1, param1))
      const p = Math.max(0.01, Math.min(0.99, param2))
      for (let k = 0; k <= n; k++) points.push({ x: k, y: binomPMF(k, n, p) })
    }

    if (points.length === 0) return
    const xMin = Math.min(...points.map(p => p.x))
    const xMax = Math.max(...points.map(p => p.x))
    const yMax = Math.max(...points.map(p => p.y)) * 1.15 || 1

    const toCanvasX = x => pad.l + ((x - xMin) / (xMax - xMin || 1)) * gW
    const toCanvasY = y => pad.t + gH - (y / yMax) * gH

    // fill
    if (dist !== 'binomial') {
      ctx.beginPath()
      ctx.moveTo(toCanvasX(points[0].x), toCanvasY(0))
      points.forEach(p => ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y)))
      ctx.lineTo(toCanvasX(points[points.length - 1].x), toCanvasY(0))
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + gH)
      grad.addColorStop(0, 'rgba(99,102,241,0.5)')
      grad.addColorStop(1, 'rgba(99,102,241,0.05)')
      ctx.fillStyle = grad
      ctx.fill()

      ctx.beginPath()
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 2
      points.forEach((p, i) => i === 0 ? ctx.moveTo(toCanvasX(p.x), toCanvasY(p.y)) : ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y)))
      ctx.stroke()
    } else {
      points.forEach(p => {
        const bx = toCanvasX(p.x), by = toCanvasY(p.y)
        const barW = Math.max(2, gW / points.length * 0.6)
        const grad = ctx.createLinearGradient(0, by, 0, toCanvasY(0))
        grad.addColorStop(0, '#6366f1'); grad.addColorStop(1, 'rgba(99,102,241,0.2)')
        ctx.fillStyle = grad
        ctx.fillRect(bx - barW / 2, by, barW, toCanvasY(0) - by)
      })
    }

    // x-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ;[0, 0.25, 0.5, 0.75, 1].forEach(t => {
      const x = xMin + t * (xMax - xMin)
      const cx = pad.l + t * gW
      ctx.fillText(x.toFixed(1), cx, H - 5)
    })
  }, [dist, param1, param2])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {distributions.map(d => (
          <button key={d.id} onClick={() => { setDist(d.id); setParam1(d.id === 'binomial' ? 10 : d.id === 'exponential' ? 1 : 0); setParam2(d.id === 'binomial' ? 0.5 : 1) }}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${dist === d.id ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {d.label}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={520} height={200} className="w-full rounded-xl bg-bg-primary/40 border border-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono text-text-muted mb-1 block">{current?.p1}: <span className="text-accent-indigo">{param1.toFixed(2)}</span></label>
          <input type="range" min={current?.p1Range[0]} max={current?.p1Range[1]} step="0.01" value={param1}
            onChange={e => setParam1(+e.target.value)} className="w-full accent-indigo-500" />
        </div>
        {current?.p2 && (
          <div>
            <label className="text-xs font-mono text-text-muted mb-1 block">{current?.p2}: <span className="text-accent-cyan">{param2.toFixed(2)}</span></label>
            <input type="range" min={current?.p2Range[0]} max={current?.p2Range[1]} step="0.01" value={param2}
              onChange={e => setParam2(+e.target.value)} className="w-full accent-cyan-500" />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Correlation Heatmap ───────────────────────────────────────────────────────
function CorrelationHeatmap() {
  const features = ['Age', 'Income', 'Score', 'Hours', 'Rating']
  const [n, setN] = useState(60)
  const [data, setData] = useState(null)
  const [corr, setCorr] = useState(null)

  const generate = useCallback(() => {
    const rows = []
    for (let i = 0; i < n; i++) {
      const age = 20 + Math.random() * 40
      const income = age * 800 + (Math.random() - 0.5) * 20000
      const score = 40 + Math.random() * 60
      const hours = 20 + Math.random() * 40
      const rating = score * 0.4 + Math.random() * 30
      rows.push([age, income, score, hours, rating])
    }
    setData(rows)

    const m = features.length
    const matrix = Array.from({ length: m }, () => new Array(m).fill(0))
    for (let a = 0; a < m; a++) {
      for (let b = 0; b < m; b++) {
        const xs = rows.map(r => r[a]), ys = rows.map(r => r[b])
        const mx = xs.reduce((s, v) => s + v, 0) / n
        const my = ys.reduce((s, v) => s + v, 0) / n
        const num = xs.reduce((s, v, i) => s + (v - mx) * (ys[i] - my), 0)
        const den = Math.sqrt(xs.reduce((s, v) => s + (v - mx) ** 2, 0) * ys.reduce((s, v) => s + (v - my) ** 2, 0))
        matrix[a][b] = den === 0 ? 0 : num / den
      }
    }
    setCorr(matrix)
  }, [n])

  useEffect(() => { generate() }, [generate])

  const colorFor = v => {
    const r = v < 0 ? Math.round(239 * Math.abs(v)) : 0
    const g = v > 0 ? Math.round(99 * v) : 0
    const b = v > 0 ? Math.round(241 * v) : Math.round(100 * Math.abs(v))
    return `rgb(${r},${g},${b})`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-xs font-mono text-text-muted">Samples: <span className="text-accent-indigo">{n}</span></label>
        <input type="range" min={20} max={200} value={n} onChange={e => setN(+e.target.value)} className="flex-1 accent-indigo-500" />
        <button onClick={generate} className="px-3 py-1 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Regenerate</button>
      </div>
      {corr && (
        <div className="overflow-x-auto">
          <table className="text-xs font-mono mx-auto">
            <thead>
              <tr>
                <th className="w-16" />
                {features.map(f => <th key={f} className="text-text-muted px-2 py-1 text-center">{f}</th>)}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={f}>
                  <td className="text-text-muted pr-2 py-0.5 text-right">{f}</td>
                  {features.map((_, j) => (
                    <td key={j} className="px-1 py-0.5 text-center rounded"
                      style={{ background: colorFor(corr[i][j]), color: Math.abs(corr[i][j]) > 0.4 ? '#fff' : '#aaa', minWidth: 48, transition: 'background 0.4s' }}>
                      {corr[i][j].toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center gap-6 text-[10px] font-mono text-text-muted">
        <span style={{ color: 'rgb(239,0,100)' }}>■ Negative</span>
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>■ None</span>
        <span style={{ color: 'rgb(0,99,241)' }}>■ Positive</span>
      </div>
    </div>
  )
}

// ── Outlier Detection ─────────────────────────────────────────────────────────
function OutlierDetection() {
  const [method, setMethod] = useState('zscore')
  const [threshold, setThreshold] = useState(2.5)
  const [points, setPoints] = useState(() => {
    const pts = []
    for (let i = 0; i < 60; i++) pts.push({ x: Math.random() * 100, y: Math.random() * 100 })
    // inject some outliers
    pts.push({ x: 5, y: 95 }, { x: 95, y: 5 }, { x: 50, y: 98 }, { x: 2, y: 2 })
    return pts
  })

  const regenerate = () => {
    const pts = []
    for (let i = 0; i < 60; i++) {
      pts.push({ x: 30 + (Math.random() - 0.5) * 40, y: 50 + (Math.random() - 0.5) * 40 })
    }
    pts.push({ x: 5, y: 95 }, { x: 95, y: 5 }, { x: 50, y: 98 }, { x: 2, y: 2 })
    setPoints(pts)
  }

  const isOutlier = useCallback((pt, idx) => {
    if (method === 'zscore') {
      const xs = points.map(p => p.x), ys = points.map(p => p.y)
      const mx = xs.reduce((a, b) => a + b) / xs.length
      const my = ys.reduce((a, b) => a + b) / ys.length
      const sx = Math.sqrt(xs.reduce((a, b) => a + (b - mx) ** 2, 0) / xs.length)
      const sy = Math.sqrt(ys.reduce((a, b) => a + (b - my) ** 2, 0) / ys.length)
      const zx = sx > 0 ? Math.abs(pt.x - mx) / sx : 0
      const zy = sy > 0 ? Math.abs(pt.y - my) / sy : 0
      return Math.max(zx, zy) > threshold
    } else {
      // IQR method
      const vals = points.map(p => Math.sqrt(p.x ** 2 + p.y ** 2))
      const sorted = [...vals].sort((a, b) => a - b)
      const q1 = sorted[Math.floor(sorted.length * 0.25)]
      const q3 = sorted[Math.floor(sorted.length * 0.75)]
      const iqr = q3 - q1
      const v = Math.sqrt(pt.x ** 2 + pt.y ** 2)
      return v < q1 - threshold * iqr || v > q3 + threshold * iqr
    }
  }, [points, method, threshold])

  const outliers = points.filter((p, i) => isOutlier(p, i))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {['zscore', 'iqr'].map(m => (
          <button key={m} onClick={() => setMethod(m)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${method === m ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {m === 'zscore' ? 'Z-Score' : 'IQR'}
          </button>
        ))}
        <label className="text-xs font-mono text-text-muted ml-2">Threshold: <span className="text-accent-cyan">{threshold.toFixed(1)}</span></label>
        <input type="range" min="0.5" max="4" step="0.1" value={threshold}
          onChange={e => setThreshold(+e.target.value)} className="w-32 accent-indigo-500" />
        <button onClick={regenerate} className="ml-auto px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-muted hover:bg-white/10 transition-all">Regenerate</button>
      </div>

      <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 200 }}>
        {points.map((p, i) => {
          const out = isOutlier(p, i)
          return (
            <circle key={i}
              cx={p.x / 100 * 280 + 10} cy={(1 - p.y / 100) * 180 + 10}
              r={out ? 5 : 4}
              fill={out ? '#ef4444' : '#6366f1'}
              fillOpacity={out ? 0.9 : 0.6}
              stroke={out ? '#ef4444' : 'none'} strokeWidth={1}
            />
          )
        })}
      </svg>

      <div className="flex gap-4 text-xs font-mono text-text-muted">
        <span><span className="text-accent-indigo">■</span> Normal: {points.length - outliers.length}</span>
        <span><span className="text-red-400">■</span> Outliers: {outliers.length}</span>
      </div>
    </div>
  )
}

// ── PCA Visualizer ────────────────────────────────────────────────────────────
function PCAVisualizer() {
  const [dims, setDims] = useState(3)
  const [result, setResult] = useState(null)

  const runPCA = useCallback(() => {
    const n = 80
    // Generate correlated data
    const raw = []
    for (let i = 0; i < n; i++) {
      const t = Math.random() * 2 * Math.PI
      const noise = () => (Math.random() - 0.5) * 0.3
      if (dims === 2) raw.push([Math.cos(t) + noise(), Math.sin(t) * 0.4 + noise()])
      else raw.push([Math.cos(t) + noise(), Math.sin(t) * 0.4 + noise(), t / (2 * Math.PI) + noise()])
    }

    // Center
    const means = raw[0].map((_, j) => raw.reduce((s, r) => s + r[j], 0) / n)
    const centered = raw.map(r => r.map((v, j) => v - means[j]))

    // Covariance matrix (simplified 2D PCA projection)
    const d = centered[0].length
    const cov = Array.from({ length: d }, (_, i) => Array.from({ length: d }, (_, j) =>
      centered.reduce((s, r) => s + r[i] * r[j], 0) / (n - 1)
    ))

    // Power iteration for first 2 eigenvectors (simplified)
    const powerIter = (mat, iters = 30) => {
      let v = mat[0].map(() => Math.random())
      const norm = arr => Math.sqrt(arr.reduce((s, x) => s + x * x, 0))
      for (let it = 0; it < iters; it++) {
        const nv = mat.map(row => row.reduce((s, x, i) => s + x * v[i], 0))
        const n2 = norm(nv)
        v = nv.map(x => x / n2)
      }
      return v
    }

    const pc1 = powerIter(cov)
    // Deflate
    const lambda1 = pc1.reduce((s, v, i) => s + v * cov[i].reduce((ss, cv, j) => ss + cv * pc1[j], 0), 0)
    const deflated = cov.map((row, i) => row.map((v, j) => v - lambda1 * pc1[i] * pc1[j]))
    const pc2 = powerIter(deflated)

    // Project
    const proj = centered.map(r => ({
      x: r.reduce((s, v, i) => s + v * pc1[i], 0),
      y: r.reduce((s, v, i) => s + v * pc2[i], 0),
    }))

    // Variance explained
    const totalVar = cov.reduce((s, _, i) => s + cov[i][i], 0)
    const var1 = lambda1 / totalVar * 100
    const var2 = Math.max(0, (pc2.reduce((s, v, i) => s + v * deflated[i].reduce((ss, cv, j) => ss + cv * pc2[j], 0), 0)) / totalVar * 100)

    setResult({ proj, var1: Math.abs(var1), var2: Math.abs(var2) })
  }, [dims])

  useEffect(() => { runPCA() }, [runPCA])

  const xVals = result?.proj.map(p => p.x) ?? [0]
  const yVals = result?.proj.map(p => p.y) ?? [0]
  const xRange = [Math.min(...xVals), Math.max(...xVals)]
  const yRange = [Math.min(...yVals), Math.max(...yVals)]
  const toSVG = (v, [mn, mx], size) => 10 + (v - mn) / ((mx - mn) || 1) * (size - 20)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <span className="text-xs font-mono text-text-muted">Input dims:</span>
        {[2, 3].map(d => (
          <button key={d} onClick={() => setDims(d)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${dims === d ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {d}D
          </button>
        ))}
        <button onClick={runPCA} className="ml-auto px-3 py-1 rounded-lg text-xs font-mono bg-white/5 text-text-muted hover:bg-white/10 transition-all">Re-run</button>
      </div>
      {result && (
        <>
          <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 200 }}>
            <text x="8" y="16" className="text-[8px]" fill="rgba(255,255,255,0.4)" fontSize={9} fontFamily="monospace">PC2</text>
            <text x="260" y="195" fill="rgba(255,255,255,0.4)" fontSize={9} fontFamily="monospace">PC1</text>
            {result.proj.map((p, i) => (
              <circle key={i}
                cx={toSVG(p.x, xRange, 300)} cy={200 - toSVG(p.y, yRange, 200)}
                r={3} fill="#6366f1" fillOpacity={0.7}
              />
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-lg p-3 border border-white/5">
              <div className="text-[10px] font-mono text-text-muted mb-1">PC1 Variance</div>
              <div className="text-lg font-bold text-accent-indigo">{result.var1.toFixed(1)}%</div>
              <div className="h-1.5 bg-white/5 rounded-full mt-1"><div className="h-full bg-accent-indigo rounded-full" style={{ width: `${result.var1}%` }} /></div>
            </div>
            <div className="glass rounded-lg p-3 border border-white/5">
              <div className="text-[10px] font-mono text-text-muted mb-1">PC2 Variance</div>
              <div className="text-lg font-bold text-accent-cyan">{result.var2.toFixed(1)}%</div>
              <div className="h-1.5 bg-white/5 rounded-full mt-1"><div className="h-full bg-accent-cyan rounded-full" style={{ width: `${result.var2}%` }} /></div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Statistical Summary ───────────────────────────────────────────────────────
function StatisticalSummary() {
  const [input, setInput] = useState('12, 15, 14, 10, 18, 22, 14, 16, 13, 19, 25, 11, 17, 14, 20')
  const [stats, setStats] = useState(null)

  const compute = () => {
    const vals = input.split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v))
    if (vals.length < 2) return
    const n = vals.length
    const sorted = [...vals].sort((a, b) => a - b)
    const mean = vals.reduce((a, b) => a + b) / n
    const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)
    const std = Math.sqrt(variance)
    const q1 = sorted[Math.floor(n * 0.25)]
    const q3 = sorted[Math.floor(n * 0.75)]
    const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)]
    const skew = vals.reduce((a, b) => a + ((b - mean) / std) ** 3, 0) / n
    const kurt = vals.reduce((a, b) => a + ((b - mean) / std) ** 4, 0) / n - 3
    setStats({ n, mean, std, variance, min: sorted[0], max: sorted[n-1], median, q1, q3, iqr: q3 - q1, skew, kurt, vals, sorted })
  }

  useEffect(() => { compute() }, [])

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-text-muted block mb-1">Enter comma-separated numbers:</label>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
            placeholder="12, 15, 14, ..." />
          <button onClick={compute} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Compute</button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Count (n)', val: stats.n, color: 'text-text-primary' },
              { label: 'Mean (μ)', val: stats.mean.toFixed(3), color: 'text-accent-indigo' },
              { label: 'Std Dev (σ)', val: stats.std.toFixed(3), color: 'text-accent-cyan' },
              { label: 'Min', val: stats.min, color: 'text-red-400' },
              { label: 'Median', val: stats.median.toFixed(2), color: 'text-green-400' },
              { label: 'Max', val: stats.max, color: 'text-green-400' },
              { label: 'Q1', val: stats.q1.toFixed(2), color: 'text-accent-violet' },
              { label: 'Q3', val: stats.q3.toFixed(2), color: 'text-accent-violet' },
              { label: 'IQR', val: stats.iqr.toFixed(2), color: 'text-yellow-400' },
              { label: 'Variance', val: stats.variance.toFixed(3), color: 'text-text-muted' },
              { label: 'Skewness', val: stats.skew.toFixed(3), color: stats.skew > 0 ? 'text-orange-400' : 'text-blue-400' },
              { label: 'Kurtosis', val: stats.kurt.toFixed(3), color: 'text-text-muted' },
            ].map(s => (
              <div key={s.label} className="glass rounded-lg p-2 border border-white/5 text-center">
                <div className="text-[9px] font-mono text-text-muted">{s.label}</div>
                <div className={`text-sm font-bold font-mono ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Box plot */}
          <div className="glass rounded-lg p-3 border border-white/5">
            <div className="text-[10px] font-mono text-text-muted mb-2">Box Plot</div>
            <svg viewBox="0 0 300 50" className="w-full" style={{ height: 50 }}>
              {(() => {
                const margin = 20
                const W = 300 - 2 * margin
                const toX = v => margin + (v - stats.min) / (stats.max - stats.min || 1) * W
                return (
                  <>
                    <line x1={toX(stats.min)} y1={25} x2={toX(stats.q1)} y2={25} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                    <line x1={toX(stats.q3)} y1={25} x2={toX(stats.max)} y2={25} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                    <rect x={toX(stats.q1)} y={12} width={toX(stats.q3) - toX(stats.q1)} height={26} fill="rgba(99,102,241,0.3)" stroke="#6366f1" strokeWidth={1.5} rx={2} />
                    <line x1={toX(stats.median)} y1={12} x2={toX(stats.median)} y2={38} stroke="#06b6d4" strokeWidth={2} />
                    {[stats.min, stats.max].map((v, i) => <line key={i} x1={toX(v)} y1={18} x2={toX(v)} y2={32} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />)}
                    {stats.vals.filter(v => v < stats.q1 - 1.5 * stats.iqr || v > stats.q3 + 1.5 * stats.iqr)
                      .map((v, i) => <circle key={i} cx={toX(v)} cy={25} r={3} fill="#ef4444" />)}
                  </>
                )
              })()}
            </svg>
          </div>
        </>
      )}
    </div>
  )
}

// ── Missing Data Handler ──────────────────────────────────────────────────────
function MissingData() {
  const cols = ['Age', 'Salary', 'Score', 'Years']
  const [strategy, setStrategy] = useState('mean')
  const [rawData] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      Age: i % 4 === 0 ? null : Math.round(22 + Math.random() * 30),
      Salary: i % 5 === 1 ? null : Math.round(30000 + Math.random() * 70000),
      Score: i % 3 === 2 ? null : Math.round(50 + Math.random() * 50),
      Years: i % 6 === 0 ? null : Math.round(1 + Math.random() * 15),
    }))
  )

  const impute = (col, val) => {
    const nonNull = rawData.map(r => r[col]).filter(v => v !== null)
    if (strategy === 'mean') return Math.round(nonNull.reduce((a, b) => a + b) / nonNull.length)
    if (strategy === 'median') { const s = [...nonNull].sort((a, b) => a - b); return s[Math.floor(s.length / 2)] }
    if (strategy === 'mode') {
      const freq = {}; nonNull.forEach(v => freq[v] = (freq[v] || 0) + 1)
      return +Object.entries(freq).sort(([,a],[,b]) => b - a)[0][0]
    }
    return val
  }

  const missingCount = rawData.reduce((s, r) => s + cols.filter(c => r[c] === null).length, 0)
  const strategies = [{ id: 'mean', label: 'Mean' }, { id: 'median', label: 'Median' }, { id: 'mode', label: 'Mode' }, { id: 'drop', label: 'Drop Row' }]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-mono text-text-muted">Strategy:</span>
        {strategies.map(s => (
          <button key={s.id} onClick={() => setStrategy(s.id)}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${strategy === s.id ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {s.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-red-400">{missingCount} missing values</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-text-muted px-3 py-2 text-left">#</th>
              {cols.map(c => <th key={c} className="text-text-muted px-3 py-2 text-center">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rawData.map((row, i) => {
              const dropped = strategy === 'drop' && cols.some(c => row[c] === null)
              if (dropped) return null
              return (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-3 py-1.5 text-text-muted">{i + 1}</td>
                  {cols.map(c => (
                    <td key={c} className={`px-3 py-1.5 text-center ${row[c] === null ? 'text-accent-indigo bg-accent-indigo/10' : 'text-text-secondary'}`}>
                      {row[c] === null ? `→ ${impute(c, null)}` : row[c]}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] font-mono text-text-muted text-center">Blue cells show imputed values using {strategy} strategy</p>
    </div>
  )
}

// ── T-SNE Visualizer (simplified) ────────────────────────────────────────────
function TSNEVisualizer() {
  const [clusters, setClusters] = useState(3)
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)

  const run = useCallback(() => {
    setRunning(true)
    // Generate clustered high-dim data, then project with force-directed approach
    const n = 80
    const colors = ['#6366f1', '#06b6d4', '#a855f7', '#22c55e', '#f59e0b']
    const points = []
    for (let c = 0; c < clusters; c++) {
      const cx = Math.random() * 6 - 3, cy = Math.random() * 6 - 3
      for (let i = 0; i < n / clusters; i++) {
        points.push({
          x: cx + (Math.random() - 0.5) * 1.5,
          y: cy + (Math.random() - 0.5) * 1.5,
          cluster: c,
          color: colors[c % colors.length],
        })
      }
    }

    // Simple random jitter to simulate t-SNE layout
    const layout = points.map(p => ({
      x: p.x + (Math.random() - 0.5) * 0.5,
      y: p.y + (Math.random() - 0.5) * 0.5,
      cluster: p.cluster,
      color: p.color,
    }))

    setTimeout(() => {
      setResult(layout)
      setRunning(false)
    }, 400)
  }, [clusters])

  useEffect(() => { run() }, [run])

  const xVals = result?.map(p => p.x) ?? [-1, 1]
  const yVals = result?.map(p => p.y) ?? [-1, 1]
  const xRange = [Math.min(...xVals) - 0.5, Math.max(...xVals) + 0.5]
  const yRange = [Math.min(...yVals) - 0.5, Math.max(...yVals) + 0.5]
  const toX = v => 10 + (v - xRange[0]) / (xRange[1] - xRange[0]) * 280
  const toY = v => 10 + (1 - (v - yRange[0]) / (yRange[1] - yRange[0])) * 180

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-text-muted">Clusters: <span className="text-accent-indigo">{clusters}</span></span>
        <input type="range" min={2} max={5} value={clusters} onChange={e => setClusters(+e.target.value)} className="flex-1 accent-indigo-500" />
        <button onClick={run} disabled={running} className="px-3 py-1 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all disabled:opacity-50">
          {running ? 'Running…' : 'Re-run'}
        </button>
      </div>
      <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 200 }}>
        <text x="8" y="14" fill="rgba(255,255,255,0.4)" fontSize={9} fontFamily="monospace">t-SNE 2D</text>
        {result?.map((p, i) => (
          <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={3.5} fill={p.color} fillOpacity={0.75} />
        ))}
      </svg>
      <p className="text-[10px] font-mono text-text-muted text-center">t-SNE reduces high-dimensional data to 2D while preserving local cluster structure</p>
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
const COMPONENTS = {
  DistributionExplorer,
  CorrelationHeatmap,
  OutlierDetection,
  PCAVisualizer,
  TSNEVisualizer,
  MissingData,
  StatisticalSummary,
}

export default function DataScienceDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
