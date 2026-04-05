import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { MY_SHAYARI } from '../../data/poetry'
import ScrollReveal from '../ui/ScrollReveal'

const URDU_FONT = "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif"

const LANG_TABS = [
  { key: 'urdu',     label: 'اردو',    rtl: true  },
  { key: 'hindi',    label: 'हिन्दी',   rtl: false },
  { key: 'hinglish', label: 'Roman',   rtl: false },
]

// Word meaning pill
function WordPill({ w, r, m }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition cursor-none ${
          open
            ? 'bg-accent-indigo/20 border-accent-indigo/50 text-accent-indigo'
            : 'bg-bg-tertiary border-white/10 text-text-muted hover:border-accent-indigo/30'
        }`}
      >
        {w} <span className="text-[9px] opacity-50">({r})</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1.5 z-10 glass border border-accent-indigo/30 rounded-xl px-3 py-2 shadow-lg"
            style={{ minWidth: 190 }}
          >
            <div className="text-xs">
              <span className="text-accent-indigo font-semibold">{w}</span>
              <span className="text-text-muted mx-1">·</span>
              <span className="italic text-text-muted">{r}</span>
            </div>
            <div className="text-[11px] text-text-secondary mt-0.5">{m}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

// Full poem modal
function PoemModal({ poem, onClose }) {
  const [lang, setLang] = useState('urdu')

  const lines  = poem[lang]
  const isRtl  = lang === 'urdu'
  const isUrdu = lang === 'urdu' || lang === 'hindi'

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
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="glass rounded-2xl p-6 max-w-lg w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary cursor-none">
          <X size={18} />
        </button>

        {/* Theme + number */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono bg-bg-tertiary border border-white/5 text-text-muted/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {poem.theme}
          </span>
          <span className="text-[10px] font-mono text-accent-indigo/40">#{poem.id}</span>
        </div>

        {/* Language tabs */}
        <div className="flex gap-2 mb-5">
          {LANG_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setLang(t.key)}
              className={`text-xs px-3 py-1 rounded-full border transition cursor-none ${
                lang === t.key
                  ? 'bg-accent-indigo text-white border-accent-indigo'
                  : 'glass text-text-muted border-white/10 hover:border-accent-indigo/30'
              } ${t.key === 'urdu' ? '' : 'font-mono'}`}
              style={t.key === 'urdu' ? { fontFamily: URDU_FONT } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Verses */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={lang === 'urdu' ? 'ur' : lang === 'hindi' ? 'hi' : 'en'}
            className="mb-5 space-y-1"
            style={isUrdu ? { fontFamily: URDU_FONT, lineHeight: 2.4 } : { lineHeight: 1.9 }}
          >
            {lines.map((line, i) => (
              <p
                key={i}
                className={`${isRtl ? 'text-right' : 'text-left'} ${
                  i % 2 === 0 ? 'text-text-primary text-base' : 'text-text-secondary text-sm'
                }`}
              >
                {line}
              </p>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Attribution */}
        <div className="border-t border-white/5 pt-3 mb-4">
          <span
            className="text-[11px] text-text-muted/60"
            style={{ fontFamily: URDU_FONT }}
          >
            — امیر حمزہ خان
          </span>
        </div>

        {/* Word meanings */}
        {poem.words.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-text-muted/50 mb-2">Difficult words:</p>
            <div className="flex flex-wrap gap-1.5">
              {poem.words.map(w => <WordPill key={w.w} {...w} />)}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Poem card (click to open modal)
function PoemCard({ poem, index }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        onClick={() => setOpen(true)}
        className="glass rounded-2xl p-5 border border-white/8 hover:border-accent-indigo/25 transition-all duration-300 cursor-none group relative overflow-hidden flex flex-col"
      >
        {/* Subtle gradient hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/0 to-accent-indigo/0 group-hover:from-accent-indigo/5 group-hover:to-accent-violet/5 transition-all duration-500 rounded-2xl pointer-events-none" />

        {/* Theme + number */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-text-muted/50 bg-bg-tertiary border border-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {poem.theme}
          </span>
          <span className="text-[10px] font-mono text-accent-indigo/30">#{poem.id}</span>
        </div>

        {/* First two lines preview — Urdu */}
        <div
          dir="rtl"
          lang="ur"
          className="mb-3 flex-1"
          style={{ fontFamily: URDU_FONT, lineHeight: 2.2 }}
        >
          {poem.urdu.slice(0, 2).map((line, i) => (
            <p key={i} className={`text-right ${i === 0 ? 'text-text-primary text-sm' : 'text-text-secondary text-xs'}`}>
              {line}
            </p>
          ))}
          {poem.urdu.length > 2 && (
            <p className="text-right text-[10px] text-text-muted/40 mt-1">…</p>
          )}
        </div>

        {/* Attribution */}
        <div className="border-t border-white/5 pt-2.5 flex items-center justify-between">
          <span
            className="text-[10px] text-text-muted/50"
            style={{ fontFamily: URDU_FONT }}
          >
            امیر حمزہ خان
          </span>
          <span className="text-[10px] font-mono text-accent-indigo/50 group-hover:text-accent-indigo transition-colors">
            اردو · हिन्दी · Roman →
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && <PoemModal poem={poem} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default function Shayari() {
  return (
    <section id="shayari" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">شاعری</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-3">
            Words &amp;{' '}
            <span className="gradient-text">Verses</span>
          </h2>
          <p className="text-text-muted text-center mb-2 max-w-xl mx-auto">
            Between neural networks and deployment pipelines, I write Urdu poetry.
          </p>
          <p
            dir="rtl"
            lang="ur"
            className="text-center text-text-muted/40 mb-10 text-sm"
            style={{ fontFamily: URDU_FONT, lineHeight: 2 }}
          >
            کچھ باتیں لفظوں میں بہتر کہی جاتی ہیں۔
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MY_SHAYARI.map((poem, i) => (
            <PoemCard key={poem.id} poem={poem} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
