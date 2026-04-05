import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Linkedin, Github, Send, CheckCircle, AlertCircle } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import GlowButton from '../ui/GlowButton'

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID

export default function Contact({ onOpenChatbot }) {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Job Opportunity', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    // If Formspree ID is set → use Formspree API
    if (FORMSPREE_ID && FORMSPREE_ID !== 'your_form_id_here') {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
            _subject: `${form.subject} — from ${form.name} (Portfolio)`,
          }),
        })

        if (res.ok) {
          setStatus('success')
          setForm({ name: '', email: '', subject: 'Job Opportunity', message: '' })
          setTimeout(() => setStatus('idle'), 6000)
        } else {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || `Formspree error ${res.status}`)
        }
      } catch (err) {
        console.error('[Contact] Formspree error:', err.message)
        setErrorMsg(err.message || 'Failed to send. Please email directly.')
        setStatus('error')
      }
      return
    }

    // Fallback: open mailto (no Formspree ID configured)
    const mailto = `mailto:amirhamzakhan2001@gmail.com?subject=${encodeURIComponent(
      form.subject + ' — from ' + form.name
    )}&body=${encodeURIComponent(
      form.message + '\n\nFrom: ' + form.name + '\nEmail: ' + form.email
    )}`
    window.location.href = mailto
    setStatus('success')
    setTimeout(() => setStatus('idle'), 4000)
  }

  const LINKS = [
    {
      icon: <Mail size={18} />,
      label: 'amirhamzakhan2001@gmail.com',
      href: 'mailto:amirhamzakhan2001@gmail.com',
      hoverColor: 'hover:text-accent-cyan',
    },
    {
      icon: <Linkedin size={18} />,
      label: 'linkedin.com/in/amirhamzakhan032001',
      href: 'https://www.linkedin.com/in/amirhamzakhan032001',
      hoverColor: 'hover:text-[#0077B5]',
    },
    {
      icon: <Github size={18} />,
      label: 'github.com/amirhamzakhan2001',
      href: 'https://github.com/amirhamzakhan2001',
      hoverColor: 'hover:text-text-primary',
    },
  ]

  return (
    <section id="contact" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; connect --open</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
            Let's Build Something{' '}
            <span className="gradient-text">Intelligent</span>
          </h2>
          <p className="text-text-muted text-center mb-16 max-w-xl mx-auto">
            Open to full-time AI/ML engineering roles, freelance AI projects, and interesting collaborations.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ── Left — info ── */}
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono text-green-400">Available for opportunities</span>
              </div>

              <p className="text-text-secondary leading-relaxed">
                Whether you're building an AI product, running a hackathon, or looking for an engineer who can ship
                production-grade AI systems — I'd love to talk.
              </p>

              <div className="space-y-3 mt-6">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-text-muted ${link.hoverColor} transition-colors cursor-none group`}
                  >
                    <div className="w-9 h-9 glass rounded-lg flex items-center justify-center group-hover:border-accent-indigo/40 transition-colors">
                      {link.icon}
                    </div>
                    <span className="text-sm font-mono">{link.label}</span>
                  </a>
                ))}
              </div>

              {/* Urdu shayari */}
              <div className="mt-8 pt-8 border-t border-accent-indigo/10">
                <p className="urdu-text text-base">ملنا ہو تو راستے نکل آتے ہیں</p>
                <p className="text-xs text-text-muted mt-1">If there's a will to meet, paths are always found.</p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-text-muted mb-3">Or skip the form —</p>
                <GlowButton onClick={onOpenChatbot} variant="secondary">
                  Ask My AI Instead
                </GlowButton>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right — form ── */}
          <ScrollReveal direction="right">
            <div className="glass rounded-2xl p-6">
              <AnimatePresence mode="wait">

                {/* Success state */}
                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-14 text-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    >
                      <CheckCircle size={52} className="text-green-400" />
                    </motion.div>
                    <div>
                      <div className="font-display font-bold text-xl text-text-primary">Message sent! 🎉</div>
                      <div className="text-sm text-text-muted mt-1">I'll reply within 24 hours.</div>
                    </div>
                  </motion.div>
                )}

                {/* Form state */}
                {status !== 'success' && (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-text-muted mb-1.5 block">Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="w-full bg-bg-primary border border-accent-indigo/20 rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-indigo/60 transition-colors"
                          style={{ cursor: 'text' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-text-muted mb-1.5 block">Email *</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full bg-bg-primary border border-accent-indigo/20 rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-indigo/60 transition-colors"
                          style={{ cursor: 'text' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-text-muted mb-1.5 block">Subject</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full bg-bg-primary border border-accent-indigo/20 rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-indigo/60 transition-colors"
                        style={{ cursor: 'pointer' }}
                      >
                        <option>Job Opportunity</option>
                        <option>Freelance Project</option>
                        <option>Collaboration</option>
                        <option>Hackathon / Competition</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-text-muted mb-1.5 block">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Tell me about the role / project..."
                        className="w-full bg-bg-primary border border-accent-indigo/20 rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-indigo/60 transition-colors resize-none"
                        style={{ cursor: 'text' }}
                      />
                    </div>

                    {/* Error banner */}
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-xs font-mono text-red-400"
                        >
                          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                          <span>{errorMsg || 'Something went wrong. Please try emailing directly.'}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <GlowButton
                      type="submit"
                      variant="primary"
                      className="w-full justify-center"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={15} />
                          Send Message
                        </span>
                      )}
                    </GlowButton>

                    {/* Formspree notice */}
                    <p className="text-[10px] font-mono text-text-muted text-center">
                      {FORMSPREE_ID && FORMSPREE_ID !== 'your_form_id_here'
                        ? '✓ Powered by Formspree — messages go directly to Amir'
                        : '⚠ Add VITE_FORMSPREE_ID to .env to enable direct delivery'}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
