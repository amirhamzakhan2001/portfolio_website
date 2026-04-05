import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Footer({ onOpenChatbot }) {
  return (
    <footer className="relative border-t border-accent-indigo/10 bg-bg-secondary/50 py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-xl gradient-text mb-1">Amir Hamza Khan</div>
            <div className="text-xs font-mono text-text-muted">AI/ML Engineer · New Delhi, India</div>
          </div>

          {/* Urdu shayari */}
          <div className="text-center">
            <p className="urdu-text text-sm opacity-60">ستاروں سے آگے جہاں اور بھی ہیں</p>
            <p className="text-xs text-text-muted mt-1">— Allama Iqbal</p>
          </div>

          {/* Social */}
          <div className="flex items-center gap-5">
            <a href="https://github.com/amirhamzakhan2001" target="_blank" rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors cursor-none">
              <FaGithub size={18} />
            </a>
            <a href="https://www.linkedin.com/in/amirhamzakhan032001" target="_blank" rel="noopener noreferrer"
              className="text-text-muted hover:text-[#0077B5] transition-colors cursor-none">
              <FaLinkedin size={18} />
            </a>
            <a href="mailto:amirhamzakhan2001@gmail.com"
              className="text-text-muted hover:text-accent-cyan transition-colors cursor-none">
              <FaEnvelope size={18} />
            </a>
          </div>
        </div>

        <div className="section-divider my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <span>© 2026 Amir Hamza Khan · All rights reserved</span>
          <span>
            Built with React + Tailwind +{' '}
            <motion.button
              onClick={onOpenChatbot}
              className="gradient-text font-semibold cursor-none hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.05 }}
              title="Click to open the AI chatbot"
            >
              AI
            </motion.button>
            {' '}✨
          </span>
        </div>
      </div>
    </footer>
  )
}
