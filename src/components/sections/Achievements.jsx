import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollReveal from '../ui/ScrollReveal'

const STATS = [
  { val: 60000, suffix: '+', label: 'Emails Processed', sub: 'NLP Pipeline', icon: '📧' },
  { val: 9.38, suffix: '', label: 'MSc CGPA', sub: 'Semester 3', icon: '🎓' },
  { val: 2500, suffix: '', label: 'Leaderboard Rank', sub: '/ 7000+ teams', icon: '🏆' },
  { val: 5, suffix: '', label: 'LLM Providers', sub: 'In production', icon: '🤖' },
]

const CERTS = [
  { name: 'IBM AI Agent Architect', org: 'IBM SkillBuild × CSRBOX', year: '2025', icon: '🏅', featured: true },
  { name: 'HackerRank SQL — 5 Star', org: 'HackerRank', year: '2025', icon: '⭐', featured: true },
  { name: 'Cisco Python Essentials 1 & 2', org: 'Cisco', year: '2025', icon: '🐍', featured: false },
  { name: 'Data Science Certificate', org: 'Internshala', year: '2021', icon: '📊', featured: false },
  { name: 'Introduction to Python', org: 'Udemy', year: '2021', icon: '🐍', featured: false },
]

const ACHIEVEMENTS = [
  { icon: '🥈', text: 'Ranked 2nd in Class — BSc Applied Mathematics', sub: 'CGPA 9.53 / 10' },
  { icon: '🥇', text: 'Ranked 1st after Year 1 of MSc AI/ML', sub: 'SGPA 9.41 — best in cohort' },
  { icon: '🏆', text: 'Amazon ML Challenge 2025', sub: 'Top 2500 / 7000+ teams · SMAPE 54.6' },
  { icon: '⭐', text: 'HackerRank SQL — All Levels Complete', sub: 'Basic · Intermediate · Advanced' },
  { icon: '🎙️', text: 'Built barge-in voice AI in production', sub: 'WebRTC + Silero-VAD · KreoHealth' },
  { icon: '🔬', text: 'Fine-tuned Qwen LLM with LoRA', sub: 'On domain-specific university dataset' },
]

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const isFloat = !Number.isInteger(target)

  return (
    <span ref={ref}>
      {inView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountUp target={target} suffix={suffix} duration={duration} isFloat={isFloat} />
        </motion.span>
      ) : '0'}
    </span>
  )
}

function CountUp({ target, suffix, duration, isFloat }) {
  const [current, setCurrent] = motion.useMotionValue ? [target] : useMotionValue(target)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const end = start + duration * 1000
    const tick = () => {
      const now = Date.now()
      const progress = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
      setVal(isFloat ? +(target * eased).toFixed(2) : Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, isFloat])

  return <>{isFloat ? val.toFixed(2) : val.toLocaleString()}{suffix}</>
}

// Simple counter without framer-motion hook
import { useState, useEffect } from 'react'

function SimpleCounter({ target, suffix = '', isFloat = false }) {
  const { ref, inView } = useInView({ triggerOnce: true })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = Date.now()
    const tick = () => {
      const progress = Math.min(1, (Date.now() - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = isFloat ? +(target * eased).toFixed(2) : Math.round(target * eased)
      setVal(current)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, isFloat])

  return (
    <span ref={ref}>
      {isFloat ? val.toFixed(2) : val.toLocaleString()}{suffix}
    </span>
  )
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; cat achievements.log</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-16">
            Numbers &{' '}
            <span className="gradient-text">Milestones</span>
          </h2>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.1}>
              <div className="glass rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-display font-bold text-3xl gradient-text">
                  <SimpleCounter
                    target={s.val}
                    suffix={s.suffix}
                    isFloat={!Number.isInteger(s.val)}
                  />
                </div>
                <div className="text-sm font-medium text-text-primary mt-1">{s.label}</div>
                <div className="text-xs text-text-muted font-mono">{s.sub}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Achievements list */}
          <ScrollReveal direction="left">
            <h3 className="font-display font-semibold text-xl text-text-primary mb-5">Key Achievements</h3>
            <div className="space-y-3">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 glass rounded-xl p-4"
                >
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{a.text}</div>
                    <div className="text-xs text-text-muted font-mono">{a.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Certifications */}
          <ScrollReveal direction="right">
            <h3 className="font-display font-semibold text-xl text-text-primary mb-5">Certifications</h3>
            <div className="space-y-3">
              {CERTS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`flex items-center gap-3 rounded-xl p-4 ${c.featured ? 'glass border border-accent-indigo/30' : 'bg-bg-secondary/40 border border-white/5'}`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${c.featured ? 'text-text-primary' : 'text-text-secondary'}`}>{c.name}</div>
                    <div className="text-xs text-text-muted font-mono">{c.org} · {c.year}</div>
                  </div>
                  {c.featured && (
                    <span className="text-[10px] font-mono bg-accent-indigo/10 border border-accent-indigo/30 text-accent-indigo px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
