import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillCategories } from '../../data/skills'
import ScrollReveal from '../ui/ScrollReveal'

const LEVEL_LABELS = ['', 'Familiar', 'Learning', 'Proficient', 'Advanced', 'Expert']

function SkillDots({ level }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 400 }}
          className={`w-2 h-2 rounded-full transition-colors ${
            i < level ? 'bg-accent-indigo shadow-glow-sm' : 'bg-bg-tertiary border border-text-muted/20'
          }`}
        />
      ))}
    </div>
  )
}

function SkillItem({ skill }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative glass rounded-xl p-3 flex items-center justify-between gap-3 group cursor-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-xs font-medium text-text-primary truncate">{skill.name}</div>
        {skill.production && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full whitespace-nowrap">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            prod
          </span>
        )}
      </div>
      <div className="flex-shrink-0">
        <SkillDots level={skill.level} />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 bg-bg-tertiary border border-accent-indigo/20 text-xs font-mono text-text-secondary px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
          >
            {LEVEL_LABELS[skill.level]} · {skill.tag}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Skills() {
  const [active, setActive] = useState('aiml')
  const activeCategory = skillCategories.find((c) => c.id === active)

  return (
    <section id="skills" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; tech_stack.json</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
            Tools I{' '}
            <span className="gradient-text">Build With</span>
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">
            Hover any skill to see depth. Green badges = used in production.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-none ${
                  active === cat.id
                    ? 'bg-accent-indigo text-white shadow-glow-sm'
                    : 'glass text-text-muted hover:text-text-primary hover:border-accent-indigo/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {activeCategory?.skills.map((skill) => (
              <SkillItem key={skill.name} skill={skill} />
            ))}
          </motion.div>
        </AnimatePresence>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-text-muted font-mono">
            {LEVEL_LABELS.slice(1).map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-1.5 h-1.5 rounded-full ${j <= i ? 'bg-accent-indigo' : 'bg-bg-tertiary'}`}
                    />
                  ))}
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
