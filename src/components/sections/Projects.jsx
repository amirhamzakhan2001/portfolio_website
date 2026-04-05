import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, X, ChevronRight, Linkedin, Play, Image } from 'lucide-react'
import { projects } from '../../data/projects'
import ScrollReveal from '../ui/ScrollReveal'
import GlowButton from '../ui/GlowButton'

const STATUS_COLORS = {
  production:   { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  dot: 'bg-green-400',  label: 'Live'        },
  public:       { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   dot: 'bg-blue-400',   label: 'Open Source' },
  'coming-soon':{ bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Coming Soon' },
  'in-progress':{ bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400', label: 'In Progress' },
}

// ── Project Modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  if (!project) return null
  const st = STATUS_COLORS[project.status]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[88vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary cursor-none">
          <X size={20} />
        </button>

        {/* Project image */}
        {project.image && (
          <div className="mb-5 rounded-xl overflow-hidden border border-white/10">
            <img
              src={project.image}
              alt={project.title}
              className="w-full object-cover"
              style={{ maxHeight: 220 }}
            />
          </div>
        )}
        {!project.image && (
          <div className="mb-5 rounded-xl border border-dashed border-accent-indigo/20 h-16 flex items-center justify-center text-text-muted/20">
            <Image size={20} />
          </div>
        )}

        {/* Status + icon */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`inline-flex items-center gap-1.5 text-xs font-mono ${st.bg} ${st.border} border ${st.text} px-3 py-1 rounded-full`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${project.status === 'production' ? 'animate-pulse' : ''}`} />
            {st.label}
          </div>
          <span className="text-2xl">{project.icon}</span>
        </div>

        <h3 className="font-display font-bold text-2xl text-text-primary mb-1">{project.title}</h3>
        <p className="text-xs font-mono text-text-muted mb-4">{project.subtitle}</p>
        <p className="text-text-secondary leading-relaxed mb-4 whitespace-pre-line">
          {project.longDescription || project.description}
        </p>

        {/* Badges + tech */}
        <div className="flex flex-wrap gap-2 mb-3">
          {project.badges.map(b => <span key={b} className="tech-chip">{b}</span>)}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map(t => (
            <span key={t} className="text-xs font-mono bg-bg-tertiary border border-accent-indigo/20 text-text-secondary px-2 py-1 rounded-lg">{t}</span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          {project.github && (
            <GlowButton href={project.github} variant="secondary">
              <Github size={14} /> GitHub
            </GlowButton>
          )}
          {project.demo && (
            <GlowButton href={project.demo} variant="cyan">
              <ExternalLink size={14} /> Live Demo
            </GlowButton>
          )}
          {project.linkedin && (
            <GlowButton href={project.linkedin} variant="secondary">
              <Linkedin size={14} /> LinkedIn Post
            </GlowButton>
          )}
          {project.video && (
            <GlowButton href={project.video} variant="secondary">
              <Play size={14} /> Watch Demo
            </GlowButton>
          )}
          {!project.github && !project.demo && !project.linkedin && project.status !== 'coming-soon' && (
            <span className="text-xs font-mono text-text-muted italic">Confidential — available on request</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onClick, index }) {
  const st      = STATUS_COLORS[project.status]
  const cardRef = useRef(null)

  const onMouseMove = useCallback(e => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    card.style.transition = 'transform 0.1s ease'
    card.style.transform  = `perspective(600px) rotateX(${-y * 9}deg) rotateY(${x * 11}deg) translateY(-5px)`
  }, [])

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.35s ease'
    card.style.transform  = ''
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass rounded-2xl overflow-hidden cursor-none group relative flex flex-col h-full"
      style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)', transformStyle: 'preserve-3d' }}
    >
      {/* Gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${project.gradient}`} />

      {/* Project image thumbnail */}
      {project.image && (
        <div className="relative overflow-hidden" style={{ height: 140 }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/80 to-transparent" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Status + icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl">{project.icon}</span>
          <div className="flex items-center gap-2">
            {/* Quick link icons */}
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-text-muted hover:text-text-primary transition-colors cursor-none">
                  <Github size={13} />
                </a>
              )}
              {project.linkedin && (
                <a href={project.linkedin} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-text-muted hover:text-[#0077B5] transition-colors cursor-none">
                  <Linkedin size={13} />
                </a>
              )}
              {project.video && (
                <a href={project.video} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-text-muted hover:text-accent-cyan transition-colors cursor-none">
                  <Play size={13} />
                </a>
              )}
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-mono ${st.bg} ${st.border} border ${st.text} px-2.5 py-1 rounded-full`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${project.status === 'production' ? 'animate-pulse' : ''}`} />
              {st.label}
            </div>
          </div>
        </div>

        <h3 className="font-display font-bold text-lg text-text-primary mb-1 leading-tight">{project.title}</h3>
        <p className="text-xs font-mono text-text-muted mb-3">{project.subtitle}</p>
        <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-3">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.badges.slice(0, 3).map(b => <span key={b} className="tech-chip text-[10px]">{b}</span>)}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 4).map(t => (
            <span key={t} className="text-[10px] font-mono bg-bg-primary/60 border border-white/5 text-text-muted px-2 py-0.5 rounded">{t}</span>
          ))}
          {project.tech.length > 4 && <span className="text-[10px] font-mono text-text-muted px-1">+{project.tech.length - 4}</span>}
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-white/5">
          <button className="flex items-center gap-1 text-xs text-text-muted group-hover:text-accent-indigo transition-colors cursor-none">
            View Details <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${project.glowColor}` }}
      />
    </motion.div>
  )
}

// ── Main Projects Section ─────────────────────────────────────────────────────
export default function Projects() {
  const [selected, setSelected] = useState(null)
  const featured = projects.filter(p => p.featured)
  const others   = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; ls ./projects</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
            Things I've{' '}
            <span className="gradient-text">Built</span>
          </h2>
          <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
            From production SaaS to competition ML — click any card for full details, images & links.
          </p>
        </ScrollReveal>

        {/* Featured (2 large) */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} index={i} />
          ))}
        </div>

        {/* Others grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {others.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <ProjectCard project={p} onClick={() => setSelected(p)} index={i + 2} />
            </motion.div>
          ))}
        </div>

        {/* Count strip */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-mono text-text-muted">
          {[
            { val: projects.filter(p => p.status === 'production').length, label: 'Live in production' },
            { val: projects.filter(p => p.status === 'public').length,     label: 'Open source' },
            { val: projects.filter(p => p.status === 'in-progress').length,label: 'In progress' },
            { val: projects.length, label: 'Total' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="font-bold text-text-primary">{s.val}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
