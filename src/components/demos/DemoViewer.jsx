import { useState, Suspense, lazy, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, ChevronRight, ArrowLeft } from 'lucide-react'
import { isAdvancedDemo } from '../../config/demoTier'

// ── Lazy-load all category demo modules ──────────────────────────────────────
const categoryModules = {
  'data-science': lazy(() => import('./DataScienceDemos')),
  'classical-ml': lazy(() => import('./ClassicalMLDemos')),
  'deep-learning': lazy(() => import('./DeepLearningDemos')),
  'nlp':          lazy(() => import('./NLPDemos')),
  'genai':        lazy(() => import('./GenAIDemos')),
  'agentic':      lazy(() => import('./AgenticDemos')),
  'sectors':      lazy(() => import('./SectorDemos')),
}

function TheorySection({ theory }) {
  if (!theory) return null
  return (
    <div className="mt-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">📖</span>
        <h4 className="font-display font-bold text-lg text-text-primary">Theory & Explanation</h4>
      </div>

      {theory.what && (
        <div className="glass rounded-xl p-4 border border-white/5">
          <h5 className="text-xs font-mono text-accent-indigo mb-2 uppercase tracking-wider">What is it?</h5>
          <p className="text-sm text-text-secondary leading-relaxed">{theory.what}</p>
        </div>
      )}

      {theory.how && (
        <div className="glass rounded-xl p-4 border border-white/5">
          <h5 className="text-xs font-mono text-accent-cyan mb-2 uppercase tracking-wider">How does it work?</h5>
          <p className="text-sm text-text-secondary leading-relaxed">{theory.how}</p>
        </div>
      )}

      {theory.math && (
        <div className="theory-formula text-sm font-mono text-accent-indigo leading-relaxed whitespace-pre-wrap">
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-1.5 px-3 rounded-t-xl border-b border-white/10 bg-[rgba(15,15,30,0.95)]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-text-muted text-[10px]">formula</span>
          </div>
          {theory.math}
        </div>
      )}

      {/* Image */}
      {theory.image && (
        <div className="rounded-xl overflow-hidden border border-white/10">
          <img
            src={theory.image}
            alt={theory.imageCaption ? '' : 'Concept diagram'}
            className="w-full object-contain bg-white/5 max-h-[min(70vh,520px)]"
            loading="lazy"
            referrerPolicy="no-referrer"
            decoding="async"
          />
          {theory.imageCaption && (
            <p className="text-[10px] font-mono text-text-muted/60 text-center py-2 bg-bg-tertiary/50">
              {theory.imageCaption}
            </p>
          )}
        </div>
      )}

      {theory.when && (
        <div className="glass rounded-xl p-4 border border-white/5">
          <h5 className="text-xs font-mono text-green-400 mb-2 uppercase tracking-wider">When to use it</h5>
          <p className="text-sm text-text-secondary leading-relaxed">{theory.when}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {theory.useCases?.length > 0 && (
          <div className="glass rounded-xl p-4 border border-white/5">
            <h5 className="text-xs font-mono text-accent-violet mb-2 uppercase tracking-wider">Use Cases</h5>
            <ul className="space-y-1">
              {theory.useCases.map((u, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-1.5">
                  <span className="text-accent-violet mt-0.5">▸</span>{u}
                </li>
              ))}
            </ul>
          </div>
        )}
        {theory.pros?.length > 0 && (
          <div className="glass rounded-xl p-4 border border-white/5">
            <h5 className="text-xs font-mono text-green-400 mb-2 uppercase tracking-wider">Advantages</h5>
            <ul className="space-y-1">
              {theory.pros.map((p, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-1.5">
                  <span className="text-green-400 mt-0.5">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {theory.cons?.length > 0 && (
          <div className="glass rounded-xl p-4 border border-white/5">
            <h5 className="text-xs font-mono text-red-400 mb-2 uppercase tracking-wider">Limitations</h5>
            <ul className="space-y-1">
              {theory.cons.map((c, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-1.5">
                  <span className="text-red-400 mt-0.5">✗</span>{c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DemoViewer({ category, demoMap, onClose }) {
  const demos = category.demos.map(id => demoMap[id]).filter(Boolean)
  const [selectedId, setSelectedId] = useState(demos[0]?.id)
  const selected = demoMap[selectedId]

  const CategoryModule = categoryModules[category.id]

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const overlay = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col"
      style={{ overflowY: 'hidden' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-viewer-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent-cyan transition-colors cursor-none px-3 py-2 rounded-xl border border-white/10 hover:border-accent-cyan/40 bg-white/5"
          >
            <ArrowLeft size={16} className="shrink-0" />
            <span className="hidden sm:inline">Back to categories</span>
            <span className="sm:hidden">Back</span>
          </button>
          <span className="text-2xl shrink-0">{category.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 id="demo-viewer-title" className="font-display font-bold text-lg text-text-primary truncate">{category.title}</h2>
              {isAdvancedDemo && (
                <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-text-muted">{demos.length} interactive demos</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close demos" className="text-text-muted hover:text-text-primary transition-colors cursor-none p-2 shrink-0">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 shrink-0 border-r border-white/10 overflow-y-auto py-3 px-2">
          {demos.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 cursor-none flex items-center gap-2 ${
                selectedId === d.id
                  ? 'bg-accent-indigo/20 border border-accent-indigo/40 text-text-primary'
                  : 'text-text-muted hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-base">{d.icon}</span>
              <span className="text-xs font-mono leading-tight">{d.title}</span>
              {selectedId === d.id && <ChevronRight size={12} className="ml-auto text-accent-indigo" />}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {selected && (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{selected.icon}</span>
                  <h3 className="font-display font-bold text-xl text-text-primary">{selected.title}</h3>
                </div>
                <p className="text-sm text-text-muted font-mono">{selected.tagline}</p>
              </div>

              {/* Interactive Demo */}
              <div className="glass rounded-2xl p-5 md:p-6 border border-white/8 mb-2 min-h-[min(62vh,720px)] flex flex-col">
                <div className="text-[10px] font-mono text-accent-indigo/60 uppercase tracking-wider mb-4">
                  ▶ Interactive Demo
                </div>
                <div className="flex-1 min-h-0 flex flex-col">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-[min(45vh,400px)] text-text-muted text-sm font-mono">
                    Loading demo…
                  </div>
                }>
                  {CategoryModule && (
                    <CategoryModule componentName={selected.component} />
                  )}
                </Suspense>
                </div>
              </div>

              {/* Theory */}
              <TheorySection theory={selected.theory} />
            </>
          )}
        </div>
      </div>
    </motion.div>
  )

  return typeof document !== 'undefined' ? createPortal(overlay, document.body) : null
}
