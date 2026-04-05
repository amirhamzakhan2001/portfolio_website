import { useState, useRef, useEffect, useCallback } from 'react'

// ── Shared helpers ────────────────────────────────────────────────────────────
const Btn = ({ onClick, children, variant = 'primary' }) => (
  <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-none ${
    variant === 'primary' ? 'bg-accent-indigo/20 border border-accent-indigo/40 text-accent-indigo hover:bg-accent-indigo/30'
    : variant === 'danger' ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
    : 'bg-bg-tertiary border border-white/10 text-text-muted hover:border-white/20'
  }`}>{children}</button>
)

// ── Linear Regression ─────────────────────────────────────────────────────────
function LinearRegression() {
  const [points, setPoints] = useState([
    { x: 15, y: 80 }, { x: 30, y: 60 }, { x: 45, y: 50 },
    { x: 60, y: 35 }, { x: 75, y: 20 }, { x: 85, y: 15 },
  ])
  const svgRef = useRef(null)
  const W = 500, H = 300

  const regression = useCallback(() => {
    if (points.length < 2) return null
    const n = points.length
    const sx  = points.reduce((a, p) => a + p.x, 0)
    const sy  = points.reduce((a, p) => a + p.y, 0)
    const sxy = points.reduce((a, p) => a + p.x * p.y, 0)
    const sxx = points.reduce((a, p) => a + p.x * p.x, 0)
    const denom = n * sxx - sx * sx
    if (!denom) return null
    const m = (n * sxy - sx * sy) / denom
    const b = (sy - m * sx) / n
    const yMean = sy / n
    const ssTot = points.reduce((a, p) => a + (p.y - yMean) ** 2, 0)
    const ssRes = points.reduce((a, p) => a + (p.y - (m * p.x + b)) ** 2, 0)
    const r2 = ssTot ? 1 - ssRes / ssTot : 0
    return { m, b, r2 }
  }, [points])

  const addPoint = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPoints(prev => [...prev, { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) }])
  }

  const reg = regression()
  const lineY = (x) => reg ? reg.m * x + reg.b : 0

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Click on the canvas to add data points. Watch OLS regression update live.</p>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60 cursor-crosshair" style={{ maxHeight: 280 }} onClick={addPoint}>
        {/* Grid */}
        {[20,40,60,80].map(v => (
          <g key={v}>
            <line x1={v/100*W} y1={0} x2={v/100*W} y2={H} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1={0} y1={v/100*H} x2={W} y2={v/100*H} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </g>
        ))}
        {/* Regression line */}
        {reg && (
          <line
            x1={0} y1={lineY(0)/100*H}
            x2={W} y2={lineY(100)/100*H}
            stroke="#6366F1" strokeWidth="2" strokeDasharray="6 3" opacity="0.8"
          />
        )}
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x/100*W} cy={p.y/100*H} r="5" fill="#06B6D4" stroke="rgba(6,182,212,0.3)" strokeWidth="3" />
        ))}
      </svg>
      <div className="flex items-center gap-3 flex-wrap">
        <Btn onClick={() => setPoints([])} variant="danger">Reset</Btn>
        {reg && (
          <>
            <span className="text-xs font-mono text-accent-indigo">y = {reg.m.toFixed(3)}x + {reg.b.toFixed(2)}</span>
            <span className="text-xs font-mono text-accent-cyan">R² = {reg.r2.toFixed(4)}</span>
            <span className="text-xs font-mono text-text-muted">{points.length} points</span>
          </>
        )}
      </div>
    </div>
  )
}

// ── Logistic Regression ───────────────────────────────────────────────────────
function LogisticRegression() {
  const [z, setZ] = useState(0)
  const [age, setAge] = useState(45)
  const [score, setScore] = useState(60)
  const W = 480, H = 220

  const sigmoid = (x) => 1 / (1 + Math.exp(-x))
  const prob = sigmoid(z)
  const predProb = sigmoid((age - 50) * 0.08 + (score - 50) * 0.05)

  const path = () => {
    const pts = []
    for (let i = 0; i <= W; i++) {
      const xVal = (i / W) * 12 - 6
      const yVal = (1 - sigmoid(xVal)) * H
      pts.push(`${i},${yVal}`)
    }
    return `M${pts.join('L')}`
  }

  const zToX = (v) => ((v + 6) / 12) * W

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Adjust z to see the sigmoid output. Below: real-world binary prediction.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60" style={{ maxHeight: 200 }}>
        <line x1={0} y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d={path()} fill="none" stroke="#6366F1" strokeWidth="2.5" />
        <line x1={0} y1={H*0.1} x2={W} y2={H*0.1} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1={0} y1={H*0.9} x2={W} y2={H*0.9} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={zToX(z)} cy={(1-sigmoid(z))*H} r="7" fill="#06B6D4" stroke="rgba(6,182,212,0.4)" strokeWidth="4" />
        {[-6,-4,-2,0,2,4,6].map(v => (
          <text key={v} x={zToX(v)} y={H-4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{v}</text>
        ))}
      </svg>
      <div className="space-y-2">
        <label className="flex items-center gap-3 text-xs font-mono text-text-muted">
          z value: <span className="text-accent-indigo w-8">{z}</span>
          <input type="range" min="-6" max="6" step="0.1" value={z} onChange={e => setZ(+e.target.value)} className="flex-1" />
          <span className="text-accent-cyan">σ(z) = {prob.toFixed(4)}</span>
        </label>
      </div>
      <div className="glass rounded-xl p-3 border border-white/5 grid grid-cols-3 gap-3">
        <label className="text-xs font-mono text-text-muted space-y-1">
          <div>Age: <span className="text-accent-indigo">{age}</span></div>
          <input type="range" min="20" max="80" value={age} onChange={e => setAge(+e.target.value)} className="w-full" />
        </label>
        <label className="text-xs font-mono text-text-muted space-y-1">
          <div>Health Score: <span className="text-accent-indigo">{score}</span></div>
          <input type="range" min="0" max="100" value={score} onChange={e => setScore(+e.target.value)} className="w-full" />
        </label>
        <div className="text-center">
          <div className="text-[10px] font-mono text-text-muted mb-1">Risk Probability</div>
          <div className="text-2xl font-bold" style={{ color: predProb > 0.5 ? '#EF4444' : '#10B981' }}>
            {(predProb * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] font-mono" style={{ color: predProb > 0.5 ? '#EF4444' : '#10B981' }}>
            {predProb > 0.5 ? 'HIGH RISK' : 'LOW RISK'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Decision Tree ─────────────────────────────────────────────────────────────
function DecisionTree() {
  const [answers, setAnswers] = useState({})
  const questions = [
    { id: 'ml', text: 'Knows ML/AI?', yes: 'python', no: 'learn' },
    { id: 'python', text: 'Python proficient?', yes: 'prod', no: 'almost' },
    { id: 'prod', text: 'Built production systems?', yes: 'hire', no: 'good' },
  ]

  const getResult = () => {
    if (answers.ml === false) return { label: '🔴 Not Yet', msg: 'Keep learning — AI is waiting for you!', color: '#EF4444' }
    if (answers.python === false) return { label: '🟡 Almost', msg: 'Great potential. Python first, then apply!', color: '#F59E0B' }
    if (answers.prod === false) return { label: '🟢 Good Candidate', msg: 'Solid skills. A few projects away from ideal.', color: '#10B981' }
    if (answers.prod === true) return { label: '🚀 Hire Amir!', msg: 'Perfect match. Contact now.', color: '#6366F1' }
    return null
  }

  const result = getResult()

  const nodes = [
    { id: 'root', x: 240, y: 30, label: 'Should you hire\nAmir Hamza Khan?', root: true },
    { id: 'ml',   x: 100, y: 110, label: 'Knows ML/AI?' },
    { id: 'python', x: 240, y: 110, label: 'Python\nproficient?' },
    { id: 'prod', x: 340, y: 190, label: 'Built production\nsystems?' },
    { id: 'no1',  x: 60, y: 210, label: '🔴 Keep\nLearning', leaf: true },
    { id: 'no2',  x: 160, y: 210, label: '🟡 Almost\nReady', leaf: true },
    { id: 'no3',  x: 280, y: 280, label: '🟢 Good\nCandidate', leaf: true },
    { id: 'yes3', x: 400, y: 280, label: '🚀 Hire\nAmir!', leaf: true, highlight: true },
  ]

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">A decision tree for the most important question. Answer below to traverse.</p>
      <svg viewBox="0 0 480 320" className="w-full rounded-xl border border-white/10 bg-bg-primary/60" style={{ maxHeight: 260 }}>
        {[['root','ml',true],['root','python',false],['ml','no1',true],['python','no2',true],['python','prod',false],['prod','no3',true],['prod','yes3',false]].map(([a,b,isYes]) => {
          const na = nodes.find(n=>n.id===a), nb = nodes.find(n=>n.id===b)
          if (!na || !nb) return null
          return (
            <g key={`${a}-${b}`}>
              <line x1={na.x} y1={na.y+16} x2={nb.x} y2={nb.y-16} stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" />
              <text x={(na.x+nb.x)/2+4} y={(na.y+nb.y)/2} fontSize="9" fill={isYes ? '#10B981' : '#EF4444'} textAnchor="middle">{isYes ? 'Yes' : 'No'}</text>
            </g>
          )
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <rect x={n.x-36} y={n.y-15} width={72} height={32} rx="6"
              fill={n.highlight ? 'rgba(99,102,241,0.3)' : n.leaf ? 'rgba(6,182,212,0.1)' : 'rgba(99,102,241,0.15)'}
              stroke={n.highlight ? '#6366F1' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
            {n.label.split('\n').map((line, i) => (
              <text key={i} x={n.x} y={n.y + i * 10 - (n.label.includes('\n') ? 4 : 0)} textAnchor="middle" fontSize="8" fill={n.highlight ? '#818CF8' : 'rgba(255,255,255,0.7)'}>{line}</text>
            ))}
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-3 gap-2">
        {[{id:'ml',q:'Do you value AI expertise?'},{id:'python',q:'Is Python experience required?'},{id:'prod',q:'Do you need production experience?'}].map(({id,q}) => (
          <div key={id} className="glass rounded-lg p-2 border border-white/5">
            <p className="text-[10px] text-text-muted mb-1.5">{q}</p>
            <div className="flex gap-1">
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setAnswers(a => ({...a, [id]: v}))}
                  className={`flex-1 text-[10px] font-mono py-1 rounded cursor-none transition ${
                    answers[id] === v ? (v ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/20') : 'bg-bg-primary/50 text-text-muted border border-white/5'
                  }`}>{v ? 'Yes' : 'No'}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {result && (
        <div className="glass rounded-xl p-3 border text-center" style={{ borderColor: result.color + '40' }}>
          <div className="font-display font-bold text-lg" style={{ color: result.color }}>{result.label}</div>
          <div className="text-xs text-text-muted mt-1">{result.msg}</div>
        </div>
      )}
    </div>
  )
}

// ── K-Means Clustering ────────────────────────────────────────────────────────
function KMeans() {
  const W = 480, H = 280
  const COLORS = ['#6366F1','#06B6D4','#10B981','#F59E0B','#EF4444']

  const genPoints = () => {
    const pts = []
    const centers = [[25,35],[65,25],[45,70],[75,65]]
    centers.forEach(([cx, cy]) => {
      for (let i = 0; i < 12; i++) {
        pts.push({ x: cx + (Math.random()-0.5)*20, y: cy + (Math.random()-0.5)*20, cluster: -1 })
      }
    })
    return pts
  }

  const [points, setPoints] = useState(genPoints)
  const [k, setK] = useState(3)
  const [centroids, setCentroids] = useState([])
  const [iter, setIter] = useState(0)

  const dist = (a, b) => Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2)

  const initCentroids = (kVal) => {
    const shuffled = [...points].sort(() => Math.random()-0.5)
    return shuffled.slice(0, kVal).map(p => ({ x: p.x, y: p.y }))
  }

  const step = () => {
    let cents = centroids.length === k ? centroids : initCentroids(k)
    // Assign
    const assigned = points.map(p => ({
      ...p, cluster: cents.reduce((best, c, i) => dist(p, c) < dist(p, cents[best]) ? i : best, 0)
    }))
    // Move centroids
    const newCents = cents.map((_, ci) => {
      const grp = assigned.filter(p => p.cluster === ci)
      if (!grp.length) return cents[ci]
      return { x: grp.reduce((a, p) => a + p.x, 0) / grp.length, y: grp.reduce((a, p) => a + p.y, 0) / grp.length }
    })
    setPoints(assigned)
    setCentroids(newCents)
    setIter(i => i + 1)
  }

  const reset = () => { setPoints(genPoints()); setCentroids([]); setIter(0) }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Click Step to run one iteration of Lloyd's algorithm. Watch centroids converge.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60" style={{ maxHeight: 260 }}>
        {points.map((p, i) => (
          <circle key={i} cx={p.x/100*W} cy={p.y/100*H} r="5"
            fill={p.cluster >= 0 ? COLORS[p.cluster] : '#6366F1'} opacity="0.7" />
        ))}
        {centroids.map((c, i) => (
          <g key={i}>
            <circle cx={c.x/100*W} cy={c.y/100*H} r="10" fill="none" stroke={COLORS[i]} strokeWidth="2.5" />
            <circle cx={c.x/100*W} cy={c.y/100*H} r="4" fill={COLORS[i]} />
          </g>
        ))}
      </svg>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-xs font-mono text-text-muted">
          K: <span className="text-accent-indigo w-4">{k}</span>
          <input type="range" min="2" max="5" value={k} onChange={e => { setK(+e.target.value); setCentroids([]); setIter(0) }} className="w-24" />
        </label>
        <Btn onClick={step}>Step ({iter})</Btn>
        <Btn onClick={reset} variant="danger">Reset</Btn>
        <span className="text-xs font-mono text-text-muted">{centroids.length ? `${centroids.length} centroids active` : 'Click Step to start'}</span>
      </div>
    </div>
  )
}

// ── SVM ───────────────────────────────────────────────────────────────────────
function SVM() {
  const W = 480, H = 280
  const [C, setC] = useState(1)
  const classA = [[20,30],[25,40],[15,50],[30,35],[22,55],[18,42]]
  const classB = [[70,60],[75,50],[65,70],[80,55],[72,65],[68,45]]

  const margin = 8 + C * 3

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Adjust C (regularization) to see how the margin changes between classes.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60" style={{ maxHeight: 260 }}>
        {/* Decision boundary */}
        <line x1={W*0.48} y1={0} x2={W*0.48} y2={H} stroke="#6366F1" strokeWidth="2" />
        {/* Margin lines */}
        <line x1={W*(0.48 - margin/100)} y1={0} x2={W*(0.48 - margin/100)} y2={H} stroke="#6366F1" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
        <line x1={W*(0.48 + margin/100)} y1={0} x2={W*(0.48 + margin/100)} y2={H} stroke="#6366F1" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
        {/* Shaded margin */}
        <rect x={W*(0.48 - margin/100)} y={0} width={W*(margin*2/100)} height={H} fill="rgba(99,102,241,0.06)" />
        {classA.map((p, i) => <circle key={i} cx={p[0]/100*W} cy={p[1]/100*H} r="6" fill="#06B6D4" opacity="0.8" />)}
        {classB.map((p, i) => <circle key={i} cx={p[0]/100*W} cy={p[1]/100*H} r="6" fill="#8B5CF6" opacity="0.8" />)}
        <text x={W*0.48} y={H-6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">Decision Boundary</text>
        <text x={W*0.15} y={20} fontSize="9" fill="#06B6D4">Class A</text>
        <text x={W*0.75} y={20} fontSize="9" fill="#8B5CF6">Class B</text>
        <text x={W*0.48} y={14} textAnchor="middle" fontSize="9" fill="rgba(99,102,241,0.6)">← margin →</text>
      </svg>
      <label className="flex items-center gap-3 text-xs font-mono text-text-muted">
        Regularization C: <span className="text-accent-indigo w-6">{C}</span>
        <input type="range" min="0.1" max="5" step="0.1" value={C} onChange={e => setC(+e.target.value)} className="flex-1" />
        <span className="text-text-muted">{C < 1 ? 'wide margin (soft)' : C > 3 ? 'narrow margin (hard)' : 'balanced'}</span>
      </label>
    </div>
  )
}

// ── KNN ───────────────────────────────────────────────────────────────────────
function KNN() {
  const W = 480, H = 280
  const [k, setK] = useState(3)
  const [testPt, setTestPt] = useState(null)
  const svgRef = useRef(null)

  const data = [
    {x:20,y:30,cls:0},{x:25,y:50,cls:0},{x:15,y:40,cls:0},{x:30,y:25,cls:0},{x:35,y:55,cls:0},
    {x:65,y:60,cls:1},{x:75,y:45,cls:1},{x:70,y:70,cls:1},{x:80,y:55,cls:1},{x:60,y:50,cls:1},
    {x:45,y:35,cls:0},{x:50,y:65,cls:1},{x:55,y:40,cls:1},{x:40,y:70,cls:0},
  ]

  const dist = (a, b) => Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2)

  const classify = (pt) => {
    const sorted = [...data].sort((a,b) => dist(pt,a)-dist(pt,b)).slice(0,k)
    const votes = sorted.reduce((a,p) => { a[p.cls]++; return a }, {0:0,1:0})
    return { cls: votes[0] >= votes[1] ? 0 : 1, neighbors: sorted }
  }

  const handleClick = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setTestPt({ x: Math.max(2,Math.min(98,x)), y: Math.max(2,Math.min(98,y)) })
  }

  const result = testPt ? classify(testPt) : null

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Click to place a test point. KNN classifies it by majority vote of K neighbors.</p>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60 cursor-crosshair" style={{ maxHeight: 260 }} onClick={handleClick}>
        {data.map((p, i) => (
          <circle key={i} cx={p.x/100*W} cy={p.y/100*H} r="6"
            fill={p.cls===0 ? '#06B6D4' : '#8B5CF6'}
            stroke={result?.neighbors.includes(p) ? '#FFF' : 'transparent'}
            strokeWidth="2" opacity="0.8" />
        ))}
        {testPt && result && (
          <>
            {result.neighbors.map((n, i) => (
              <line key={i} x1={testPt.x/100*W} y1={testPt.y/100*H} x2={n.x/100*W} y2={n.y/100*H}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 2" />
            ))}
            <circle cx={testPt.x/100*W} cy={testPt.y/100*H} r="9"
              fill={result.cls===0 ? '#06B6D4' : '#8B5CF6'}
              stroke="white" strokeWidth="2.5" />
            <text x={testPt.x/100*W+12} y={testPt.y/100*H+4} fontSize="10" fill="white">
              {result.cls===0 ? 'Class A' : 'Class B'}
            </text>
          </>
        )}
        <circle cx={20} cy={10} r="4" fill="#06B6D4" /><text x={28} y={14} fontSize="9" fill="rgba(255,255,255,0.5)">Class A</text>
        <circle cx={80} cy={10} r="4" fill="#8B5CF6" /><text x={88} y={14} fontSize="9" fill="rgba(255,255,255,0.5)">Class B</text>
      </svg>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-mono text-text-muted">
          K: <span className="text-accent-indigo w-4">{k}</span>
          <input type="range" min="1" max="9" step="2" value={k} onChange={e => setK(+e.target.value)} className="w-32" />
        </label>
        <Btn onClick={() => setTestPt(null)} variant="danger">Clear</Btn>
        {result && <span className="text-xs font-mono text-accent-cyan">→ {result.cls===0 ? 'Class A' : 'Class B'}</span>}
      </div>
    </div>
  )
}

// ── Bias-Variance Tradeoff ────────────────────────────────────────────────────
function BiasVariance() {
  const W = 480, H = 260
  const [degree, setDegree] = useState(2)

  const trueData = Array.from({length: 20}, (_, i) => {
    const x = i / 19
    return { x, y: Math.sin(x * Math.PI) * 0.7 + 0.15 + (Math.random()-0.5)*0.12 }
  })

  const polyFit = (pts, deg) => {
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y), n = pts.length
    const A = [], b = []
    for (let i = 0; i < n; i++) {
      A.push(Array.from({length: deg+1}, (_, j) => Math.pow(xs[i], j)))
      b.push(ys[i])
    }
    let coeffs = new Array(deg+1).fill(0)
    for (let iter = 0; iter < 800; iter++) {
      const grad = new Array(deg+1).fill(0)
      for (let i = 0; i < n; i++) {
        const pred = A[i].reduce((s, v, j) => s + v * coeffs[j], 0)
        const err = pred - b[i]
        for (let j = 0; j <= deg; j++) grad[j] += 2 * err * A[i][j] / n
      }
      for (let j = 0; j <= deg; j++) coeffs[j] -= 0.05 * grad[j]
    }
    return (x) => coeffs.reduce((s, c, j) => s + c * Math.pow(x, j), 0)
  }

  const predict = polyFit(trueData, degree)
  const label = degree <= 1 ? 'Underfitting (high bias)' : degree >= 8 ? 'Overfitting (high variance)' : 'Good fit'
  const color = degree <= 1 ? '#EF4444' : degree >= 8 ? '#F59E0B' : '#10B981'

  const curvePath = () => {
    const pts = []
    for (let i = 0; i <= 100; i++) {
      const x = i / 100
      const y = Math.max(0, Math.min(1, predict(x)))
      pts.push(`${x*W},${(1-y)*H}`)
    }
    return `M${pts.join('L')}`
  }

  const truePath = () => {
    const pts = []
    for (let i = 0; i <= 100; i++) {
      const x = i/100
      pts.push(`${x*W},${(1-Math.sin(x*Math.PI)*0.7-0.15)*H}`)
    }
    return `M${pts.join('L')}`
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Adjust polynomial degree. Low = underfit (high bias), high = overfit (high variance).</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60" style={{ maxHeight: 240 }}>
        <path d={truePath()} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="8 4" />
        <path d={curvePath()} fill="none" stroke={color} strokeWidth="2.5" />
        {trueData.map((p, i) => <circle key={i} cx={p.x*W} cy={(1-p.y)*H} r="4" fill="rgba(6,182,212,0.6)" />)}
        <text x={8} y={16} fontSize="9" fill="rgba(255,255,255,0.3)">-- True function</text>
        <text x={8} y={28} fontSize="9" fill={color}>— Polynomial fit (deg {degree})</text>
      </svg>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-mono text-text-muted flex-1">
          Degree: <span className="text-accent-indigo w-4">{degree}</span>
          <input type="range" min="1" max="10" value={degree} onChange={e => setDegree(+e.target.value)} className="flex-1" />
        </label>
        <span className="text-xs font-mono" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}

// ── Gradient Descent ──────────────────────────────────────────────────────────
function GradientDescent() {
  const W = 480, H = 260
  const [lr, setLr] = useState(0.1)
  const [x, setX] = useState(-4)
  const [history, setHistory] = useState([])
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const f  = (v) => (v-2)**2 * 0.5 + Math.sin(v) * 0.3 + 1
  const fd = (v) => (v-2) + Math.cos(v) * 0.3

  const xToSvg = (v) => ((v + 5) / 10) * W
  const yToSvg = (v) => H - (v / 8) * H

  const path = () => {
    const pts = []
    for (let v = -5; v <= 5; v += 0.05) pts.push(`${xToSvg(v)},${yToSvg(f(v))}`)
    return `M${pts.join('L')}`
  }

  const runStep = useCallback(() => {
    setX(prev => {
      const grad = fd(prev)
      const next = prev - lr * grad
      const clamped = Math.max(-4.8, Math.min(4.8, next))
      setHistory(h => [...h.slice(-30), { x: clamped, y: f(clamped) }])
      if (Math.abs(grad) < 0.001) { setRunning(false); clearInterval(intervalRef.current) }
      return clamped
    })
  }, [lr])

  const start = () => {
    setRunning(true)
    intervalRef.current = setInterval(runStep, 100)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    const nx = (Math.random() - 0.5) * 8
    setX(nx)
    setHistory([{ x: nx, y: f(nx) }])
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted font-mono">Watch gradient descent minimize the loss function. Adjust learning rate.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border border-white/10 bg-bg-primary/60" style={{ maxHeight: 240 }}>
        <path d={path()} fill="none" stroke="#6366F1" strokeWidth="2.5" />
        {history.map((pt, i) => (
          <circle key={i} cx={xToSvg(pt.x)} cy={yToSvg(pt.y)} r="3" fill="rgba(239,68,68,0.4)" />
        ))}
        <circle cx={xToSvg(x)} cy={yToSvg(f(x))} r="8" fill="#EF4444" stroke="rgba(239,68,68,0.4)" strokeWidth="5" />
        <line x1={xToSvg(2)} y1={0} x2={xToSvg(2)} y2={H} stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={xToSvg(2)+4} y={H-6} fontSize="9" fill="rgba(16,185,129,0.5)">minimum</text>
        <text x={8} y={18} fontSize="10" fill="rgba(255,255,255,0.4)">L(x) = {f(x).toFixed(4)}</text>
      </svg>
      <div className="flex items-center gap-3 flex-wrap">
        <label className="flex items-center gap-2 text-xs font-mono text-text-muted">
          LR: <span className="text-accent-indigo w-8">{lr}</span>
          <input type="range" min="0.01" max="0.5" step="0.01" value={lr} onChange={e => setLr(+e.target.value)} className="w-28" />
        </label>
        <Btn onClick={running ? () => { clearInterval(intervalRef.current); setRunning(false) } : start}>
          {running ? 'Pause' : 'Run'}
        </Btn>
        <Btn onClick={reset} variant="danger">Reset</Btn>
        <span className="text-xs font-mono text-accent-cyan">x = {x.toFixed(3)}, L = {f(x).toFixed(3)}</span>
      </div>
    </div>
  )
}

// ── Registry & Export ─────────────────────────────────────────────────────────
const COMPONENTS = {
  LinearRegression,
  LogisticRegression,
  DecisionTree,
  KMeans,
  SVM,
  KNN,
  BiasVariance,
  GradientDescent,
}

export default function ClassicalMLDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
