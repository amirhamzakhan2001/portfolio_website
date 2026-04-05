import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function GlowButton({ children, onClick, href, variant = 'primary', className = '', ...props }) {
  const base = 'relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold text-sm transition-all duration-300 cursor-none select-none'

  const variants = {
    primary: 'bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-glow-sm hover:shadow-glow-md hover:-translate-y-0.5',
    secondary: 'border border-accent-indigo/40 text-accent-indigo hover:bg-accent-indigo/10 hover:border-accent-indigo hover:shadow-glow-sm',
    cyan: 'bg-gradient-to-r from-accent-cyan to-accent-indigo text-white shadow-glow-cyan hover:shadow-glow-md hover:-translate-y-0.5',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
  }

  const Comp = href ? 'a' : motion.button

  return (
    <Comp
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
      {variant === 'primary' && (
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-indigo to-accent-violet opacity-0 group-hover:opacity-100 blur transition-opacity" />
      )}
    </Comp>
  )
}
