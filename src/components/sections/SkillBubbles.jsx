import { useEffect, useRef } from 'react'
import { skillCategories } from '../../data/skills'

const CAT_COLORS = {
  languages: '#6366F1',
  aiml:      '#8B5CF6',
  genai:     '#06B6D4',
  data:      '#10B981',
  mlops:     '#A855F7',
}

const CAT_LABELS = {
  languages: 'Languages',
  aiml:      'AI / ML',
  genai:     'Gen AI',
  data:      'Data',
  mlops:     'MLOps',
}

const LEVEL_LABEL = ['', 'Familiar', 'Learning', 'Proficient', 'Advanced', 'Expert']

// Flat list sorted by level desc (bigger bubbles toward center)
const ALL_SKILLS = skillCategories
  .flatMap((cat) =>
    cat.skills.map((s) => ({ ...s, catColor: CAT_COLORS[cat.id], catId: cat.id }))
  )
  .sort((a, b) => b.level - a.level)

const SIZE = (level) => 36 + level * 9  // 1→45, 5→81

// Compute ring home positions
function computeHomes(W, H) {
  const cx = W / 2
  const cy = H / 2
  const scale = Math.min(W, H) / 520
  const rings = [
    { r: 0,                count: 1  },
    { r: 80  * scale,      count: 7  },
    { r: 155 * scale,      count: 14 },
    { r: 230 * scale,      count: 22 },
  ]
  const positions = []
  let idx = 0
  for (const ring of rings) {
    for (let i = 0; i < ring.count && idx < ALL_SKILLS.length; i++) {
      const angle = (2 * Math.PI * i) / ring.count - Math.PI / 2
      positions.push({
        x: cx + ring.r * Math.cos(angle) + (Math.random() - 0.5) * 16,
        y: cy + ring.r * Math.sin(angle) * 0.72 + (Math.random() - 0.5) * 12,
      })
      idx++
    }
  }
  return positions
}

export default function SkillBubbles() {
  const containerRef = useRef(null)
  const bubblesRef   = useRef([])
  const elRefs       = useRef([])          // store DOM nodes during render
  const mouseRef     = useRef({ x: -9999, y: -9999, inside: false })
  const animRef      = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const W = container.offsetWidth
    const H = container.offsetHeight

    const homes = computeHomes(W, H)

    // Build bubble data, linking to already-collected DOM refs
    bubblesRef.current = ALL_SKILLS.map((skill, i) => ({
      skill,
      size: SIZE(skill.level),
      homeX: homes[i]?.x ?? W / 2,
      homeY: homes[i]?.y ?? H / 2,
      x: homes[i]?.x ?? W / 2,
      y: homes[i]?.y ?? H / 2,
      vx: 0,
      vy: 0,
      el: elRefs.current[i] ?? null,
    }))

    // Set initial positions immediately
    bubblesRef.current.forEach((b) => {
      if (b.el) {
        b.el.style.transform = `translate(${b.x - b.size / 2}px, ${b.y - b.size / 2}px)`
      }
    })

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true }
    }
    const onMouseLeave = () => { mouseRef.current.inside = false }

    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('mouseleave', onMouseLeave)

    const SPRING   = 0.055
    const DAMPING  = 0.76
    const REPEL_R  = 110
    const REPEL_F  = 18000

    function tick() {
      const { x: mx, y: my, inside } = mouseRef.current

      for (const b of bubblesRef.current) {
        if (!b.el) continue

        // Spring toward home
        b.vx += SPRING * (b.homeX - b.x)
        b.vy += SPRING * (b.homeY - b.y)

        // Mouse repulsion
        if (inside) {
          const dx = b.x - mx
          const dy = b.y - my
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          if (dist < REPEL_R) {
            const force = REPEL_F / (dist * dist)
            b.vx += (dx / dist) * force
            b.vy += (dy / dist) * force
          }
        }

        // Soft repulsion from nearby bubbles (skip to keep perf — spring handles separation)

        b.vx *= DAMPING
        b.vy *= DAMPING
        b.x  += b.vx
        b.y  += b.vy

        b.el.style.transform = `translate(${b.x - b.size / 2}px, ${b.y - b.size / 2}px)`
      }

      animRef.current = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animRef.current)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: CAT_COLORS[cat.id] }}
            />
            {CAT_LABELS[cat.id]}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs font-mono text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          prod
        </div>
      </div>

      {/* Bubble canvas */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: '460px' }}
      >
        {ALL_SKILLS.map((skill, i) => {
          const size  = SIZE(skill.level)
          const color = skill.catColor
          return (
            <div
              key={skill.name}
              ref={(el) => { elRefs.current[i] = el }}
              className="absolute flex flex-col items-center justify-center rounded-full text-center cursor-none select-none transition-shadow duration-200 hover:shadow-glow-sm"
              style={{
                width:       size,
                height:      size,
                left:        0,
                top:         0,
                background:  `${color}16`,
                border:      `1px solid ${color}55`,
                color:       color,
                willChange:  'transform',
              }}
              title={`${skill.name} · ${LEVEL_LABEL[skill.level]}`}
            >
              <span
                className="font-mono font-semibold leading-tight px-1.5 text-center break-words"
                style={{ fontSize: size > 66 ? '10px' : '8.5px', lineHeight: 1.3 }}
              >
                {skill.name}
              </span>
              {skill.production && (
                <span
                  className="text-green-400 font-mono"
                  style={{ fontSize: '7px', opacity: 0.9, marginTop: '2px' }}
                >
                  ● prod
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs font-mono text-text-muted">
        hover to repel · bubble size = skill depth · {ALL_SKILLS.length} skills across {skillCategories.length} domains
      </p>
    </div>
  )
}
