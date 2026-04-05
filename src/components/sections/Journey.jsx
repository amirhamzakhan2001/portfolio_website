import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { JOURNEY_ITEMS, TYPE_META } from '../../data/journey'
import ScrollReveal from '../ui/ScrollReveal'

const ITEM_SPACING = 160
const TOP_PAD      = 80
const BOTTOM_PAD   = 120
const ROAD_HEIGHT  = TOP_PAD + JOURNEY_ITEMS.length * ITEM_SPACING + BOTTOM_PAD

const itemY = (i) => TOP_PAD + i * ITEM_SPACING + ITEM_SPACING / 2

function JourneyCard({ item, passed, isRight }) {
  const meta = TYPE_META[item.type]
  return (
    <motion.div
      animate={{ opacity: passed ? 1 : 0.18, scale: passed ? 1 : 0.96 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-2xl p-4 border transition-colors duration-300 ${
        passed ? meta.border : 'border-white/5'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-lg">{item.icon}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${meta.bg} ${meta.border} ${meta.color}`}>
            {meta.label}
          </span>
          {item.active && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Active
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-text-muted whitespace-nowrap shrink-0">{item.year}</span>
      </div>
      <h3 className="font-display font-semibold text-sm text-text-primary leading-tight mb-0.5">{item.title}</h3>
      <p className={`text-[11px] font-mono mb-1.5 ${meta.color}`}>{item.org}</p>
      <p className="text-xs text-text-muted leading-relaxed">{item.description}</p>
      {item.highlight && (
        <div className={`mt-2 inline-flex items-center gap-1 text-[10px] font-mono ${meta.bg} ${meta.border} border ${meta.color} px-2 py-0.5 rounded-full`}>
          ✦ {item.highlight}
        </div>
      )}
    </motion.div>
  )
}

export default function Journey() {
  const roadRef      = useRef(null)
  const lastScrollY  = useRef(0)
  const [passedCount, setPassedCount] = useState(0)
  const [carOpacity,  setCarOpacity]  = useState(0)
  const [scrollDir,   setScrollDir]   = useState('down')
  const [carLeft,     setCarLeft]     = useState('50%')
  const [filter,      setFilter]      = useState('all')

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastScrollY.current) > 2) {
        setScrollDir(currentY > lastScrollY.current ? 'down' : 'up')
        lastScrollY.current = currentY
      }

      const road = roadRef.current
      if (!road) return
      const rect       = road.getBoundingClientRect()
      const centerVH   = window.innerHeight / 2
      const carYInRoad = centerVH - rect.top
      // Track road's actual horizontal center so car stays on road on all screen sizes
      setCarLeft(rect.left + rect.width / 2)

      setCarOpacity(carYInRoad >= -30 && carYInRoad <= ROAD_HEIGHT + 50 ? 1 : 0)

      let count = 0
      JOURNEY_ITEMS.forEach((_, i) => {
        if (carYInRoad >= itemY(i)) count++
      })
      setPassedCount(count)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const allTypes = [...new Set(JOURNEY_ITEMS.map(i => i.type))]

  return (
    <section id="experience" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; git log --oneline</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
            The <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-text-muted text-center mb-4 max-w-xl mx-auto">
            Every milestone on the road — education, work, projects, hackathons, certifications.
          </p>
        </ScrollReveal>

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-mono px-3 py-1 rounded-full border transition cursor-none ${
              filter === 'all'
                ? 'bg-accent-indigo text-white border-accent-indigo'
                : 'glass text-text-muted border-white/10 hover:border-accent-indigo/30'
            }`}
          >All</button>
          {allTypes.map(t => {
            const m = TYPE_META[t]
            return (
              <button key={t} onClick={() => setFilter(t)}
                className={`text-xs font-mono px-3 py-1 rounded-full border transition cursor-none ${
                  filter === t
                    ? `${m.bg} ${m.border} ${m.color}`
                    : 'glass text-text-muted border-white/10 hover:border-accent-indigo/30'
                }`}
              >{m.label}</button>
            )
          })}
        </div>

        {/* Road */}
        <div ref={roadRef} className="relative mx-auto" style={{ height: ROAD_HEIGHT, maxWidth: 900 }}>

          {/* Road surface */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-10 rounded-full"
            style={{
              top: 0, height: ROAD_HEIGHT,
              background: 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.12) 50%, rgba(6,182,212,0.08) 100%)',
              border: '1px solid rgba(99,102,241,0.15)',
            }}
          />
          {/* Dashed center line */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: 0, width: 1, height: ROAD_HEIGHT,
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(99,102,241,0.35) 0px, rgba(99,102,241,0.35) 12px, transparent 12px, transparent 24px)',
            }}
          />

          {/* Start label */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center gap-1 -translate-y-8">
            <span className="text-[9px] font-mono text-accent-indigo/50 uppercase tracking-widest">Start</span>
            <div className="w-px h-6 bg-gradient-to-b from-accent-indigo/50 to-transparent" />
          </div>

          {/* Present label */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-gradient-to-t from-accent-cyan/50 to-transparent" />
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-accent-cyan/70">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              Present
            </div>
          </div>

          {/* Milestone dots */}
          {JOURNEY_ITEMS.map((item, i) => {
            if (filter !== 'all' && filter !== item.type) return null
            const meta   = TYPE_META[item.type]
            const passed = i < passedCount
            return (
              <div
                key={item.id}
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: itemY(i) - 8, zIndex: 2 }}
              >
                <motion.div
                  animate={{ scale: passed ? 1.4 : 1, opacity: passed ? 1 : 0.35 }}
                  transition={{ duration: 0.25 }}
                  className="w-4 h-4 rounded-full border-2 border-bg-primary"
                  style={{ background: passed ? meta.dot : 'rgba(99,102,241,0.25)' }}
                />
              </div>
            )
          })}

          {/* Cards */}
          {JOURNEY_ITEMS.map((item, i) => {
            if (filter !== 'all' && filter !== item.type) return null
            const isRight = i % 2 === 0
            const passed  = i < passedCount
            const y       = itemY(i)
            return (
              <div
                key={item.id}
                className="absolute"
                style={{
                  top:   y - 60,
                  left:  isRight ? '55%' : undefined,
                  right: isRight ? undefined : '55%',
                  width: '44%',
                  maxWidth: 340,
                }}
              >
                {/* Connector */}
                <div
                  className={`absolute top-[68px] h-px transition-all duration-500 ${passed ? 'opacity-50' : 'opacity-15'}`}
                  style={{
                    width: 28,
                    left:  isRight ? -28 : undefined,
                    right: isRight ? undefined : -28,
                    background: passed ? TYPE_META[item.type].dot : 'rgba(99,102,241,0.3)',
                  }}
                />
                <JourneyCard item={item} passed={passed} isRight={isRight} />
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { val: '9.38', label: 'MSc CGPA',  sub: 'Top of cohort' },
              { val: '7',    label: 'Hackathons', sub: 'IIT · IIIT · Amazon · More' },
              { val: '10+',  label: 'Projects',   sub: '2 in production' },
              { val: '3+',   label: 'Years ML',   sub: 'Since 2022' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="font-display font-bold text-2xl gradient-text">{s.val}</div>
                <div className="text-xs font-mono text-text-primary mt-1">{s.label}</div>
                <div className="text-[10px] text-text-muted">{s.sub}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Fixed car — stays at viewport center while road scrolls past it */}
      <div
        className="fixed pointer-events-none z-20 transition-opacity duration-500"
        style={{
          top: '50vh',
          left: carLeft,
          transform: 'translate(-50%, -50%)',
          opacity: carOpacity,
        }}
      >
        {/* Glow */}
        <div style={{
          position: 'absolute', bottom: -4, left: '50%',
          transform: 'translateX(-50%)',
          width: 60, height: 10, borderRadius: '50%',
          background: 'rgba(99,102,241,0.55)',
          filter: 'blur(6px)',
        }} />
        <img
          src="/car.png"
          alt=""
          style={{
            width: 72,
            height: 'auto',
            objectFit: 'contain',
            transform: scrollDir === 'down' ? 'rotate(90deg)' : 'rotate(-90deg)',
            transition: 'transform 0.35s ease',
          }}
        />
      </div>
    </section>
  )
}
