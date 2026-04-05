import { motion } from 'framer-motion'
import { ArrowDown, MessageCircle, Github, Linkedin } from 'lucide-react'
import TypedText from '../ui/TypedText'
import GlowButton from '../ui/GlowButton'

const ORGS = [
  { name: 'KreoHealth', color: '#6366F1' },
  { name: 'Outlier AI', color: '#8B5CF6' },
  { name: 'JMI', color: '#06B6D4' },
  { name: 'IBM', color: '#A855F7' },
  { name: 'IIT Madras', color: '#6366F1' },
  { name: 'IIIT Bangalore', color: '#06B6D4' },
]

// Floating code card representing Voxa's pipeline
function VoxaPipelineCard() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="hidden lg:block relative max-w-xs"
    >
      <div className="code-block pt-10 text-xs leading-relaxed">
        {/* Traffic lights */}
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-text-muted text-xs font-mono">voxa_pipeline.py</span>
        </div>
        <pre className="font-mono text-xs leading-6">
<span className="code-comment"># Voxa Voice Agent Pipeline</span>{'\n'}
<span className="code-keyword">async def</span> <span className="code-var">process_call</span>(audio_stream):{'\n'}
{'  '}<span className="code-comment"># Step 1: Speech → Text</span>{'\n'}
{'  '}text = <span className="code-keyword">await</span> deepgram.transcribe(audio){'\n'}
{'\n'}
{'  '}<span className="code-comment"># Step 2: Retrieve context</span>{'\n'}
{'  '}docs = <span className="code-keyword">await</span> qdrant.search(text){'\n'}
{'\n'}
{'  '}<span className="code-comment"># Step 3: LLM response</span>{'\n'}
{'  '}reply = <span className="code-keyword">await</span> claude.chat({'\n'}
{'    '}messages=[*context, text]{'\n'}
{'  '}){'\n'}
{'\n'}
{'  '}<span className="code-comment"># Step 4: Text → Voice</span>{'\n'}
{'  '}<span className="code-keyword">return</span> elevenlabs.speak(reply)
        </pre>
        {/* Glow accent */}
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent-indigo/10 rounded-full blur-2xl" />
      </div>

      {/* Live badge */}
      <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono px-3 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        LIVE @ KreoHealth
      </div>
    </motion.div>
  )
}

export default function Hero({ onOpenChatbot }) {
  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center z-10 px-6">
      <div className="max-w-7xl mx-auto w-full pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 max-w-2xl"
          >
            {/* Label */}
            <motion.div variants={itemVariants} className="section-label mb-4">
              &gt; AI / ML Engineer
            </motion.div>

            {/* Name */}
            <motion.h1 variants={itemVariants} className="font-display font-bold leading-tight mb-4">
              <span className="text-5xl md:text-6xl lg:text-7xl text-text-primary block">Hi, I'm</span>
              <span className="text-5xl md:text-6xl lg:text-7xl gradient-text block">Amir Hamza Khan</span>
            </motion.h1>

            {/* Typing line */}
            <motion.div variants={itemVariants} className="text-xl md:text-2xl font-display font-medium text-text-secondary mb-2">
              I build{' '}
              <TypedText className="gradient-text-indigo" />
            </motion.div>

            {/* Tagline */}
            <motion.p variants={itemVariants} className="text-text-muted text-base md:text-lg mb-3 max-w-xl">
              Transforming complex AI into real-world impact — from voice agents that listen and respond to RAG systems that know everything.
            </motion.p>

            {/* Urdu shayari */}
            <motion.div variants={itemVariants} className="mb-8">
              <p className="urdu-text text-sm">ستاروں سے آگے جہاں اور بھی ہیں</p>
              <p className="text-xs text-text-muted mt-1 font-mono">— Allama Iqbal</p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
              <GlowButton onClick={scrollToProjects} variant="primary">
                View Projects
                <ArrowDown size={16} className="animate-bounce" />
              </GlowButton>
              <GlowButton onClick={onOpenChatbot} variant="secondary">
                <MessageCircle size={16} />
                Ask My AI
              </GlowButton>
              <a
                href="https://github.com/amirhamzakhan2001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors cursor-none"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/amirhamzakhan032001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-[#0077B5] transition-colors cursor-none"
              >
                <Linkedin size={16} />
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
              {[
                { val: '9.38', label: 'MSc CGPA' },
                { val: '60K+', label: 'Emails Processed' },
                { val: 'Top 2500', label: '/ 7000+ Teams' },
                { val: '5', label: 'LLM Providers' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-bold text-xl gradient-text">{stat.val}</div>
                  <div className="text-xs text-text-muted font-mono">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — photo + code card stacked */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6"
          >
            {/* Profile photo */}
            <div className="relative flex-shrink-0">
              {/* Rotating gradient ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan animate-spin-slow opacity-70 blur-sm" />
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-bg-primary">
                <img
                  src="/ahk_profile_pic.png"
                  alt="Amir Hamza Khan"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-bg-secondary border border-green-500/30 text-green-400 text-xs font-mono px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Available for hire
              </div>
            </div>

            {/* Voxa code card below photo */}
            <VoxaPipelineCard />
          </motion.div>
        </div>

        {/* Org logos strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 pt-8 border-t border-accent-indigo/10"
        >
          <p className="text-xs font-mono text-text-muted mb-4 text-center">Worked with / competed at</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {ORGS.map((org) => (
              <div key={org.name} className="text-xs font-mono text-text-muted hover:text-text-secondary transition-colors">
                {org.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator — inside content flow, never overlaps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-2 text-text-muted mt-10"
        >
          <span className="text-xs font-mono">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
