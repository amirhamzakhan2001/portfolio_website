import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const CODE_LINES = [
  { type: 'keyword', text: 'class ' },
  { type: 'var', text: 'AmirHamzaKhan' },
  { type: 'bracket', text: ':' },
  { type: 'newline' },
  { type: 'indent', text: '    ' },
  { type: 'keyword', text: 'def ' },
  { type: 'var', text: '__init__' },
  { type: 'bracket', text: '(self):' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'key', text: 'self.role ' },
  { type: 'bracket', text: '= ' },
  { type: 'string', text: '"AI/ML Engineer"' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'key', text: 'self.education ' },
  { type: 'bracket', text: '= ' },
  { type: 'string', text: '"MSc AI/ML @ JMI (9.38)"' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'key', text: 'self.building ' },
  { type: 'bracket', text: '= ' },
  { type: 'string', text: '"Voxa @ KreoHealth"' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'key', text: 'self.passion ' },
  { type: 'bracket', text: '= ' },
  { type: 'bracket', text: '[' },
  { type: 'string', text: '"Voice AI"' },
  { type: 'bracket', text: ', ' },
  { type: 'string', text: '"RAG"' },
  { type: 'bracket', text: ', ' },
  { type: 'string', text: '"LLMs"' },
  { type: 'bracket', text: ']' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'key', text: 'self.math_roots ' },
  { type: 'bracket', text: '= ' },
  { type: 'string', text: '"BSc Applied Math, Rank 2 🥈"' },
  { type: 'newline' },
  { type: 'newline' },
  { type: 'indent', text: '    ' },
  { type: 'keyword', text: 'def ' },
  { type: 'var', text: 'get_superpowers' },
  { type: 'bracket', text: '(self) -> list:' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'keyword', text: 'return ' },
  { type: 'bracket', text: '[' },
  { type: 'newline' },
  { type: 'indent', text: '            ' },
  { type: 'string', text: '"Ship production AI systems"' },
  { type: 'bracket', text: ',' },
  { type: 'newline' },
  { type: 'indent', text: '            ' },
  { type: 'string', text: '"Solve hard real-world problems"' },
  { type: 'bracket', text: ',' },
  { type: 'newline' },
  { type: 'indent', text: '            ' },
  { type: 'string', text: '"Build AI that actually works"' },
  { type: 'newline' },
  { type: 'indent', text: '        ' },
  { type: 'bracket', text: ']' },
]

const colorMap = {
  keyword: 'text-purple-400',
  var: 'text-blue-400',
  string: 'text-green-400',
  bracket: 'text-text-secondary',
  key: 'text-text-primary',
  comment: 'text-text-muted italic',
  indent: 'text-transparent',
  newline: '',
}

const FUN_FACTS = [
  { icon: '♟️', label: 'Chess Player', sub: 'Strategic thinker' },
  { icon: '⚽', label: 'Footballer', sub: 'Team player' },
  { icon: '👨‍🍳', label: 'Home Chef', sub: 'Surprise talent' },
  { icon: '🌍', label: 'Explorer', sub: 'New places & cultures' },
]

const STATS = [
  { val: '9.38', label: 'MSc CGPA', sub: 'Semester 3' },
  { val: '9.53', label: 'BSc CGPA', sub: 'Ranked 2nd' },
  { val: '60K+', label: 'Emails', sub: 'Processed' },
  { val: '5', label: 'LLMs', sub: 'In production' },
]

export default function About() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="about" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; about_me.py</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-16">
            Not just an ML engineer.{' '}
            <span className="gradient-text">A problem solver.</span>
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Story */}
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <p className="text-text-secondary text-lg leading-relaxed">
                I started with{' '}
                <span className="text-text-primary font-medium">Applied Mathematics</span> — not because it was easy, but because I loved the precision of it. When I first saw how data could reveal patterns invisible to the naked eye, I knew that was what I wanted to do.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Today, I'm building{' '}
                <span className="gradient-text font-semibold">Voxa</span> at KreoHealth — a production AI platform where I architected an intelligent voice agent that handles real phone calls, a RAG system that answers questions from company documents in milliseconds, and a multi-channel campaign engine.
              </p>
              <p className="text-text-secondary leading-relaxed">
                My approach: <span className="text-text-primary">break complex problems into smaller pieces</span>, understand each piece deeply, then build something that actually works. I don't fear hard problems — I dive into them.
              </p>

              {/* Urdu shayari */}
              <div className="border-l-2 border-accent-indigo/40 pl-4 mt-6">
                <p className="urdu-text text-base">ہر مشکل ایک نئی منزل کی راہ ہے</p>
                <p className="text-xs text-text-muted mt-1">Every difficulty is a path to a new destination.</p>
              </div>

              {/* Fun facts */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {FUN_FACTS.map((fact) => (
                  <div key={fact.label} className="glass rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{fact.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{fact.label}</div>
                      <div className="text-xs text-text-muted">{fact.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Photo + Code block */}
          <ScrollReveal direction="right">
            {/* Profile photo card */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-cyan opacity-30 blur-lg" />
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-accent-indigo/30">
                  <img
                    src="/ahk_profile_pic.png"
                    alt="Amir Hamza Khan"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                {/* Name tag */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-bg-secondary border border-accent-indigo/30 text-xs font-mono text-text-secondary px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  Amir Hamza Khan · AI Engineer
                </div>
              </div>
            </div>

            <div ref={ref} className="code-block pt-10 mt-6">
              {/* Traffic lights */}
              <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-text-muted text-xs font-mono">amir.py</span>
              </div>

              <pre className="font-mono text-xs md:text-sm leading-7 overflow-x-auto">
                {CODE_LINES.map((token, i) => {
                  if (token.type === 'newline') return <br key={i} />
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: i * 0.018, duration: 0.1 }}
                      className={colorMap[token.type] || 'text-text-secondary'}
                    >
                      {token.text}
                    </motion.span>
                  )
                })}
                {isVisible && <span className="animate-blink text-accent-cyan">█</span>}
              </pre>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {STATS.map((s) => (
                <div key={s.label} className="glass rounded-xl p-3 text-center">
                  <div className="font-display font-bold text-lg gradient-text">{s.val}</div>
                  <div className="text-xs text-text-primary">{s.label}</div>
                  <div className="text-xs text-text-muted">{s.sub}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
