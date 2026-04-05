import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'hero',         label: 'Init',         icon: '⬡' },
  { id: 'about',        label: 'About',         icon: '◈' },
  { id: 'skills',       label: 'Stack',         icon: '◉' },
  { id: 'projects',     label: 'Projects',      icon: '◈' },
  { id: 'demos',        label: 'Demos',         icon: '▷' },
  { id: 'experience',   label: 'Experience',    icon: '◈' },
  { id: 'achievements', label: 'Wins',          icon: '◆' },
  { id: 'contact',      label: 'Contact',       icon: '◎' },
]

export default function AgentNavigator() {
  const [active, setActive]       = useState('hero')
  const [prevIdx, setPrevIdx]     = useState(0)
  const [traveling, setTraveling] = useState(false)
  const travelTimer               = useRef(null)

  useEffect(() => {
    const observers = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive((prev) => {
              if (prev !== id) {
                const prevI = SECTIONS.findIndex((s) => s.id === prev)
                setPrevIdx(prevI)
                setTraveling(true)
                clearTimeout(travelTimer.current)
                travelTimer.current = setTimeout(() => setTraveling(false), 600)
              }
              return id
            })
          }
        },
        { threshold: 0.3 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      observers.forEach((o) => o.disconnect())
      clearTimeout(travelTimer.current)
    }
  }, [])

  const activeIdx = SECTIONS.findIndex((s) => s.id === active)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-0">
      {/* Vertical connecting line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-px bg-accent-indigo/15" />

      {/* Traveling signal line (animated) */}
      <AnimatePresence>
        {traveling && (
          <motion.div
            key="signal"
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-accent-cyan to-transparent"
            style={{ top: `${Math.min(prevIdx, activeIdx) * 32 + 8}px` }}
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: Math.abs(activeIdx - prevIdx) * 32, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {SECTIONS.map((sec, i) => {
        const isActive = sec.id === active

        return (
          <div key={sec.id} className="relative flex items-center group" style={{ height: 32 }}>
            {/* Tooltip label */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="absolute right-8 whitespace-nowrap text-[10px] font-mono text-accent-indigo bg-bg-secondary/80 border border-accent-indigo/20 px-2 py-0.5 rounded"
                >
                  {sec.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hover tooltip */}
            <span className="absolute right-8 whitespace-nowrap text-[10px] font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {isActive ? null : sec.label}
            </span>

            {/* Dot */}
            <button
              onClick={() => scrollTo(sec.id)}
              className="relative w-5 h-5 flex items-center justify-center cursor-none"
              title={sec.label}
            >
              {isActive ? (
                <motion.div
                  layoutId="agent-dot"
                  className="w-3 h-3 rounded-full bg-accent-indigo shadow-glow-sm"
                  style={{ boxShadow: '0 0 10px rgba(99,102,241,0.8)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-accent-indigo/30 group-hover:bg-accent-indigo/60 transition-colors" />
              )}

              {/* Active pulse ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <div className="w-3 h-3 rounded-full border border-accent-indigo" />
                </motion.div>
              )}
            </button>
          </div>
        )
      })}

      {/* Agent label at bottom */}
      <div className="mt-2 text-[9px] font-mono text-accent-indigo/40 tracking-widest rotate-90 origin-center whitespace-nowrap" style={{ marginTop: 16 }}>
        agent
      </div>
    </div>
  )
}
