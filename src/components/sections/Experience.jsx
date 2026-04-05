import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { timelineItems, hackathons } from '../../data/experience'
import ScrollReveal from '../ui/ScrollReveal'

const TYPE_ICONS = { work: '🏢', education: '📚', achievement: '🏅' }
const COLOR_MAP = {
  'accent-indigo': { border: 'border-accent-indigo', dot: 'bg-accent-indigo', glow: 'shadow-glow-sm' },
  'accent-violet': { border: 'border-accent-violet', dot: 'bg-accent-violet', glow: 'shadow-glow-violet' },
  'accent-cyan': { border: 'border-accent-cyan', dot: 'bg-accent-cyan', glow: 'shadow-glow-cyan' },
  'accent-purple': { border: 'border-accent-purple', dot: 'bg-accent-purple', glow: '' },
}

function TimelineItem({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
  const colors = COLOR_MAP[item.color] || COLOR_MAP['accent-indigo']
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-start gap-0 md:gap-6 mb-8 relative`}>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="flex-1 max-w-md glass rounded-2xl p-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{item.icon}</span>
              <span className={`text-xs font-mono ${item.active ? 'text-green-400' : 'text-text-muted'}`}>
                {item.date}
                {item.active && <span className="ml-1 text-green-400">· Active</span>}
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-text-primary">{item.title}</h3>
            <p className="text-xs font-mono text-text-muted">{item.org} · {item.location}</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-3">{item.description}</p>

        {item.highlights.length > 0 && (
          <ul className="space-y-1 mb-3">
            {item.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                <span className="text-accent-indigo mt-0.5 flex-shrink-0">▸</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        {item.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tech.map((t) => (
              <span key={t} className="tech-chip text-[10px]">{t}</span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Center dot + line — only on md+ */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0 w-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.08 + 0.2 }}
          className={`w-4 h-4 rounded-full ${colors.dot} ${colors.glow} border-2 border-bg-primary`}
        />
        {index < timelineItems.length - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-accent-indigo/30 to-transparent min-h-[40px]" />
        )}
      </div>

      {/* Spacer for alternate side */}
      <div className="hidden md:block flex-1 max-w-md" />
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; git log --oneline</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-16">
            The{' '}
            <span className="gradient-text">Journey</span>
          </h2>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-indigo/30 via-accent-violet/20 to-transparent" />

          {timelineItems.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Hackathons section */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16">
            <h3 className="font-display font-semibold text-xl text-text-primary mb-6 text-center">
              ⚔️ Hackathons & Competitions
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {hackathons.map((h) => (
                <div key={h.name} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{h.name}</div>
                    <div className="text-xs text-text-muted font-mono">{h.org}</div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                    h.result.startsWith('Top') ? 'bg-accent-indigo/10 border border-accent-indigo/30 text-accent-indigo' : 'bg-bg-tertiary text-text-muted'
                  }`}>
                    {h.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
