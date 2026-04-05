import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Section layout in the neural architecture
// col: 0=Input, 1=Hidden1, 2=Hidden2, 3=Output
const NEURONS = [
  { id: 'hero',         label: 'Hero',         col: 0, row: 0 },
  { id: 'about',        label: 'About',        col: 0, row: 1 },
  { id: 'skills',       label: 'Skills',       col: 1, row: 0 },
  { id: 'projects',     label: 'Projects',     col: 1, row: 1 },
  { id: 'demos',        label: 'Demos',        col: 2, row: 0 },
  { id: 'terminal',     label: 'Terminal',     col: 2, row: 1 },
  { id: 'experience',   label: 'Experience',   col: 2, row: 2 },
  { id: 'achievements', label: 'Achievements', col: 2, row: 3 },
  { id: 'contact',      label: 'Contact',      col: 3, row: 1 },
]

const LAYER_LABELS = ['Input', 'H-1', 'H-2', 'Output']

// Canvas sizing
const W   = 132
const COL_X = [16, 48, 80, 116]

function getY(col, row) {
  const rowCount = NEURONS.filter(n => n.col === col).length
  const total    = 280
  const pad      = 28
  const usable   = total - 2 * pad
  if (rowCount === 1) return total / 2
  return pad + (row / (rowCount - 1)) * usable
}

// Pre-compute positions
const POSITIONS = NEURONS.map(n => ({
  ...n,
  x: COL_X[n.col],
  y: getY(n.col, n.row),
}))

const EDGES = []
POSITIONS.forEach(a => {
  POSITIONS.forEach(b => {
    if (b.col === a.col + 1) EDGES.push({ from: a, to: b })
  })
})

export default function NeuralArchMap({ activeSection = 'hero' }) {
  const canvasRef = useRef(null)
  const [hovered, setHovered]   = useState(null)
  const activeSRef = useRef(activeSection)

  useEffect(() => { activeSRef.current = activeSection }, [activeSection])

  // Canvas draw — signals + glows
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const signals = []
    let frame = 0

    function spawnSignal() {
      const edge = EDGES[Math.floor(Math.random() * EDGES.length)]
      signals.push({ edge, progress: 0, speed: 0.014 + Math.random() * 0.01 })
    }

    function draw() {
      ctx.clearRect(0, 0, W, 280)
      frame++
      const active = activeSRef.current

      // Draw edges
      for (const { from: a, to: b } of EDGES) {
        const isActive = a.id === active || b.id === active
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = isActive
          ? 'rgba(99,102,241,0.4)'
          : 'rgba(99,102,241,0.12)'
        ctx.lineWidth = isActive ? 1.2 : 0.6
        ctx.stroke()
      }

      // Spawn + draw signals
      if (frame % 40 === 0) spawnSignal()
      if (frame % 55 === 0) spawnSignal()

      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]
        sig.progress += sig.speed
        if (sig.progress >= 1) { signals.splice(s, 1); continue }
        const { from: a, to: b } = sig.edge
        const sx = a.x + (b.x - a.x) * sig.progress
        const sy = a.y + (b.y - a.y) * sig.progress
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 5)
        sg.addColorStop(0, 'rgba(6,182,212,0.9)')
        sg.addColorStop(1, 'rgba(6,182,212,0)')
        ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2)
        ctx.fillStyle = sg; ctx.fill()
      }

      // Draw neurons
      for (const n of POSITIONS) {
        const isActive = n.id === active
        const pulse    = 0.5 + 0.5 * Math.sin(frame * 0.06 + n.x + n.y)
        const r        = isActive ? 6 + pulse * 1.5 : 4

        if (isActive) {
          // Outer glow ring
          const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 16)
          halo.addColorStop(0, 'rgba(99,102,241,0.35)')
          halo.addColorStop(1, 'rgba(99,102,241,0)')
          ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI * 2)
          ctx.fillStyle = halo; ctx.fill()
        }

        // Core dot
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isActive
          ? `rgba(99,102,241,${0.8 + 0.2 * pulse})`
          : 'rgba(99,102,241,0.28)'
        ctx.fill()

        if (isActive) {
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 2.5, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(99,102,241,${0.5 + 0.3 * pulse})`
          ctx.lineWidth   = 1
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // IntersectionObserver to track active section
  useEffect(() => {
    const observers = []
    NEURONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) activeSRef.current = id
        },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <div
      className="fixed right-3 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center"
      style={{ width: W }}
    >
      {/* Layer labels */}
      <div
        className="flex justify-between w-full px-1 mb-1"
        style={{ width: W }}
      >
        {LAYER_LABELS.map(l => (
          <span key={l} className="text-[7px] font-mono text-accent-indigo/30 uppercase tracking-wider">
            {l}
          </span>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative" style={{ width: W, height: 280 }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={280}
          className="absolute inset-0"
        />

        {/* Invisible clickable overlays on each neuron */}
        {POSITIONS.map(n => (
          <button
            key={n.id}
            onClick={() => scrollTo(n.id)}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            className="absolute cursor-none"
            style={{
              left:      n.x - 10,
              top:       n.y - 10,
              width:     20,
              height:    20,
              borderRadius: '50%',
            }}
            title={n.label}
          />
        ))}

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && (() => {
            const n = POSITIONS.find(p => p.id === hovered)
            if (!n) return null
            return (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ top: n.y }}
              >
                <div className="text-[10px] font-mono text-accent-indigo bg-bg-secondary/90 border border-accent-indigo/25 px-2 py-0.5 rounded whitespace-nowrap -translate-y-1/2">
                  {n.label}
                </div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>

      {/* Active section label */}
      <div className="mt-1 text-[8px] font-mono text-accent-indigo/40 tracking-widest uppercase text-center">
        {NEURONS.find(n => n.id === activeSection)?.label ?? ''}
      </div>
    </div>
  )
}
