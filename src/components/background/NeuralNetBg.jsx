import { useEffect, useRef } from 'react'

const MATH_SYMBOLS = [
  '∇L', 'σ(x)', 'W·x+b', '∂L/∂w', 'softmax', 'attention',
  'y=Wx', 'ReLU', 'argmax', 'z=Wx+b', 'P(y|x)', 'θ*', 'f(x;θ)',
]

// 4 columns: Input → Hidden1 → Hidden2 → Output
const COL_FRACTIONS  = [0.12, 0.36, 0.63, 0.88]
const COL_NODE_COUNTS = [3, 4, 4, 2]
const COL_COLORS = [
  'rgba(99,102,241,',   // indigo  – input
  'rgba(139,92,246,',   // violet  – hidden1
  'rgba(168,85,247,',   // purple  – hidden2
  'rgba(6,182,212,',    // cyan    – output
]
const SIGNAL_COLORS = [
  'rgba(6,182,212,',    // forward pass
  'rgba(251,146,60,',   // gradient
  'rgba(168,85,247,',   // attention
]

export const SECTION_TO_COL = {
  hero: 0, about: 0,
  skills: 1, projects: 1,
  demos: 2, experience: 2, achievements: 2,
  contact: 3,
}

function rand(a, b) { return a + Math.random() * (b - a) }

export default function NeuralNetBg({ activeSection = 'hero' }) {
  const canvasRef  = useRef(null)
  const activeSRef = useRef(activeSection)

  useEffect(() => { activeSRef.current = activeSection }, [activeSection])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let animId

    // ── state ────────────────────────────────────────────────────────────────
    let nodes     = []
    let equations = []
    const signals = []
    let mouse     = { x: -1000, y: -1000 }

    // ── builders ──────────────────────────────────────────────────────────────
    function buildNodes() {
      nodes = []
      const W = canvas.width, H = canvas.height

      // Structured column nodes (anchored)
      COL_FRACTIONS.forEach((frac, col) => {
        const count = COL_NODE_COUNTS[col]
        const cx    = W * frac
        for (let i = 0; i < count; i++) {
          const fy = count === 1
            ? 0.5
            : 0.18 + (i / (count - 1)) * 0.64
          const ay = H * fy
          nodes.push({
            x: cx + rand(-12, 12), y: ay + rand(-15, 15),
            ax: cx, ay,
            vx: 0, vy: rand(-0.08, 0.08),
            r: rand(2.2, 3.8),
            phase: Math.random() * Math.PI * 2,
            col, structured: true,
          })
        }
      })

      // Background noise nodes (free-drifting)
      for (let i = 0; i < 22; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          ax: null, ay: null,
          vx: rand(-0.18, 0.18), vy: rand(-0.18, 0.18),
          r: rand(0.8, 1.8),
          phase: Math.random() * Math.PI * 2,
          col: Math.floor(Math.random() * 4), structured: false,
        })
      }
    }

    function buildEquations() {
      equations = MATH_SYMBOLS.map(sym => ({
        text: sym,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: rand(-0.13, 0.13), vy: rand(-0.06, 0.06),
        alpha: rand(0.025, 0.075),
        size:  rand(11, 16),
      }))
    }

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      buildNodes()
      buildEquations()
    }

    resize()
    window.addEventListener('resize', resize)

    const onMouse = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouse)

    // ── signal spawning ───────────────────────────────────────────────────────
    function spawnSignal(preferCol = -1) {
      const pool = nodes.filter(n =>
        n.structured && (preferCol < 0 || n.col === preferCol) && n.col < 3
      )
      if (!pool.length) return
      const from = pool[Math.floor(Math.random() * pool.length)]
      const fi   = nodes.indexOf(from)
      const targets = nodes.filter(n => n.structured && n.col === from.col + 1)
      if (!targets.length) return
      const to = targets[Math.floor(Math.random() * targets.length)]
      const ti = nodes.indexOf(to)
      signals.push({
        from: fi, to: ti,
        progress: 0,
        speed: rand(0.007, 0.016),
        type: Math.floor(Math.random() * 3),
      })
    }

    // ── main draw loop ────────────────────────────────────────────────────────
    let frame = 0
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      const activeCol = SECTION_TO_COL[activeSRef.current] ?? 0

      // Mouse glow
      const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220)
      mg.addColorStop(0, 'rgba(99,102,241,0.05)')
      mg.addColorStop(1, 'rgba(99,102,241,0)')
      ctx.fillStyle = mg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Floating equations
      for (const eq of equations) {
        ctx.font      = `${eq.size}px 'Fira Code', monospace`
        ctx.fillStyle = `rgba(99,102,241,${eq.alpha})`
        ctx.fillText(eq.text, eq.x, eq.y)
        eq.x += eq.vx; eq.y += eq.vy
        if (eq.x < -60) eq.x = canvas.width + 10
        if (eq.x > canvas.width + 60) eq.x = -10
        if (eq.y < -20) eq.y = canvas.height + 10
        if (eq.y > canvas.height + 20) eq.y = -10
      }

      // Move nodes
      for (const n of nodes) {
        n.phase += 0.018
        if (n.structured) {
          n.vx += (n.ax - n.x) * 0.002
          n.vx *= 0.94
          n.x  += n.vx
          n.y  += n.vy
          if (n.y < n.ay - 45) n.vy =  Math.abs(n.vy)
          if (n.y > n.ay + 45) n.vy = -Math.abs(n.vy)
        } else {
          n.x += n.vx; n.y += n.vy
          if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
          if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        }
      }

      // Draw connections (only adjacent columns)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          if (Math.abs(a.col - b.col) !== 1) continue
          if (!a.structured || !b.structured) continue
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist > 320) continue
          const active = a.col === activeCol || b.col === activeCol
          const alpha  = (1 - dist / 320) * (active ? 0.22 : 0.07)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`
          ctx.lineWidth   = active ? 0.9 : 0.4
          ctx.stroke()
        }
      }

      // Spawn signals
      if (frame % 28 === 0) spawnSignal(activeCol)
      if (frame % 42 === 0) spawnSignal(activeCol)
      if (frame % 70 === 0) spawnSignal()

      // Draw signals
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]
        sig.progress += sig.speed
        if (sig.progress >= 1) { signals.splice(s, 1); continue }

        const f = nodes[sig.from], t = nodes[sig.to]
        if (!f || !t) { signals.splice(s, 1); continue }

        const sx  = f.x + (t.x - f.x) * sig.progress
        const sy  = f.y + (t.y - f.y) * sig.progress
        const col = SIGNAL_COLORS[sig.type]

        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 9)
        sg.addColorStop(0,   `${col}1)`)
        sg.addColorStop(0.4, `${col}0.55)`)
        sg.addColorStop(1,   `${col}0)`)
        ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI * 2)
        ctx.fillStyle = sg; ctx.fill()

        const tailP = Math.max(0, sig.progress - 0.2)
        ctx.beginPath()
        ctx.moveTo(f.x + (t.x - f.x) * tailP, f.y + (t.y - f.y) * tailP)
        ctx.lineTo(sx, sy)
        ctx.strokeStyle = `${col}0.5)`
        ctx.lineWidth   = 2.2
        ctx.stroke()
      }

      // Draw nodes
      for (const n of nodes) {
        const active  = n.col === activeCol
        const pulse   = 0.5 + 0.5 * Math.sin(n.phase)
        const cc      = COL_COLORS[n.col]
        const bright  = active ? 1.7 : 0.65
        const alpha   = Math.min(1, (0.3 + 0.45 * pulse) * bright)
        const r       = n.r * (active ? 1.35 : 1)

        const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4.5)
        ng.addColorStop(0, `${cc}${alpha})`)
        ng.addColorStop(1, `${cc}0)`)
        ctx.beginPath(); ctx.arc(n.x, n.y, r * 4.5, 0, Math.PI * 2)
        ctx.fillStyle = ng; ctx.fill()

        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `${cc}${Math.min(1, (0.65 + 0.3 * pulse) * bright)})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.78 }}
    />
  )
}
