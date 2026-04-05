import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function GlassCard({ children, className = '', hover = true, onClick, glowColor }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -6, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={clsx(
        'glass rounded-2xl transition-all duration-300',
        hover && 'cursor-none hover:shadow-card-hover',
        className
      )}
      style={glowColor ? { '--glow': glowColor } : {}}
    >
      {children}
    </motion.div>
  )
}
