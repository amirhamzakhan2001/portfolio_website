import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_STEPS = [
  { label: 'Loading weights',        duration: 320  },
  { label: 'Calibrating skills',     duration: 280  },
  { label: 'Warming up inference',   duration: 340  },
  { label: 'Connecting knowledge',   duration: 260  },
  { label: 'Mounting RAG pipeline',  duration: 300  },
]

function ProgressBar({ label, pct, done }) {
  const filled = Math.min(12, Math.max(0, Math.round(pct / 100 * 12)))
  const bar    = '█'.repeat(filled) + '░'.repeat(12 - filled)
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 font-mono text-xs"
    >
      <span className="text-text-muted w-44 truncate">{label}</span>
      <span className={done ? 'text-accent-indigo' : 'text-text-muted/50'}>[{bar}]</span>
      <span className={`w-10 text-right ${done ? 'text-accent-cyan' : 'text-text-muted/50'}`}>
        {done ? '100%' : `${Math.round(pct)}%`}
      </span>
    </motion.div>
  )
}

export default function LoadingScreen({ onDone }) {
  const [stepIdx,  setStepIdx]  = useState(0)
  const [stepPct,  setStepPct]  = useState(0)
  const [doneSteps, setDone]    = useState([])
  const [finished, setFinished] = useState(false)
  const [exit,     setExit]     = useState(false)

  useEffect(() => {
    let raf
    let start = performance.now()

    function tick(now) {
      if (stepIdx >= BOOT_STEPS.length) {
        setFinished(true)
        setTimeout(() => { setExit(true); setTimeout(onDone, 650) }, 700)
        return
      }
      const elapsed = now - start
      const dur     = BOOT_STEPS[stepIdx].duration
      const pct     = Math.min(100, (elapsed / dur) * 100)
      setStepPct(pct)

      if (pct >= 100) {
        setDone(d => [...d, stepIdx])
        setStepIdx(i => i + 1)
        start = now
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [stepIdx, onDone])

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-bg-primary flex flex-col items-center justify-center"
        >
          {/* Monogram */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="mb-8 relative"
          >
            <div className="text-5xl font-display font-bold gradient-text tracking-widest">AHK</div>
            <div className="absolute -inset-4 bg-accent-indigo/10 rounded-full blur-xl" />
          </motion.div>

          {/* Terminal */}
          <div className="w-full max-w-md px-6">
            <div className="code-block pt-10">
              {/* Traffic lights */}
              <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-text-muted text-xs font-mono">model_init.sh</span>
              </div>

              {/* Header */}
              <div className="mb-3 font-mono text-xs text-accent-indigo">
                Initializing Amir.v2 — AI/ML Engineer Model
              </div>

              {/* Progress bars */}
              <div className="space-y-1.5">
                {BOOT_STEPS.map((step, i) => {
                  if (i > stepIdx) return null
                  const done = doneSteps.includes(i)
                  const pct  = done ? 100 : (i === stepIdx ? stepPct : 0)
                  return (
                    <ProgressBar key={step.label} label={step.label} pct={pct} done={done} />
                  )
                })}
              </div>

              {/* Stats line */}
              {doneSteps.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 font-mono text-[10px] text-text-muted/50 border-t border-accent-indigo/10 pt-2"
                >
                  Parameters: 847M &nbsp;·&nbsp; Architecture: Transformer+RAG &nbsp;·&nbsp; VRAM: 94%
                </motion.div>
              )}

              {/* Ready message */}
              {finished && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 font-mono text-sm text-accent-cyan font-semibold"
                >
                  Model ready. &nbsp;
                  <span className="text-green-400">p(hire) = 0.97</span>
                </motion.div>
              )}

              {!finished && (
                <span className="mt-2 inline-block font-mono text-xs text-accent-indigo animate-blink">█</span>
              )}
            </div>

            {/* Overall progress */}
            <div className="mt-3 h-0.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                animate={{ width: `${(doneSteps.length / BOOT_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-1.5 text-right font-mono text-xs text-text-muted">
              {Math.round((doneSteps.length / BOOT_STEPS.length) * 100)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
