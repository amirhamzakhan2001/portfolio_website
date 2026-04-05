import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

export default function SynapseTransition({ label = '' }) {
  const [fired, setFired] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })

  useEffect(() => {
    if (inView && !fired) setFired(true)
  }, [inView, fired])

  return (
    <div ref={ref} className="relative w-full max-w-4xl mx-auto flex items-center gap-0 py-6 px-6">
      {/* Left axon line */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent-indigo/25" />

      {/* Left terminal */}
      <motion.div
        animate={fired ? { boxShadow: '0 0 8px rgba(99,102,241,0.7)', borderColor: 'rgba(99,102,241,0.7)' } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-2 h-2 rounded-full border border-accent-indigo/30 bg-bg-primary flex-shrink-0"
      />

      {/* Gap with signal */}
      <div className="relative flex items-center justify-center mx-3" style={{ width: 64 }}>
        {/* Gap dashes */}
        <div className="w-full flex items-center justify-between">
          <div className="w-3 h-px border-t border-dashed border-accent-indigo/20" />
          <div className="text-[9px] font-mono text-accent-indigo/25 select-none">synapse</div>
          <div className="w-3 h-px border-t border-dashed border-accent-indigo/20" />
        </div>

        {/* Signal spark */}
        {fired && (
          <motion.div
            initial={{ x: -28, opacity: 0, scale: 0.3 }}
            animate={{ x: 28, opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 0.9, 0.2] }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeInOut' }}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,1) 0%, rgba(6,182,212,0) 100%)',
              boxShadow:  '0 0 12px rgba(6,182,212,0.9)',
            }}
          />
        )}
      </div>

      {/* Right terminal */}
      <motion.div
        animate={fired ? { boxShadow: '0 0 8px rgba(6,182,212,0.8)', borderColor: 'rgba(6,182,212,0.7)' } : {}}
        transition={{ duration: 0.3, delay: 0.65 }}
        className="w-2 h-2 rounded-full border border-accent-indigo/30 bg-bg-primary flex-shrink-0"
      />

      {/* Right axon line */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent-cyan/20" />

      {/* Optional label */}
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-[9px] font-mono text-text-muted/40 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  )
}
