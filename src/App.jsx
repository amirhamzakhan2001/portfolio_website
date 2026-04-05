import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Layout
import LoadingScreen from './components/layout/LoadingScreen'
import Navbar        from './components/layout/Navbar'
import Footer        from './components/layout/Footer'

// Background
import NeuralNetBg   from './components/background/NeuralNetBg'

// UI
import GlowCursor       from './components/ui/GlowCursor'
import SynapseTransition from './components/ui/SynapseTransition'

// Sections
import Hero          from './components/sections/Hero'
import About         from './components/sections/About'
import Skills        from './components/sections/Skills'
import Terminal      from './components/sections/Terminal'
import Projects      from './components/sections/Projects'
import Demos         from './components/sections/Demos'
import Journey       from './components/sections/Journey'
import Shayari       from './components/sections/Shayari'
import Contact       from './components/sections/Contact'

// Chatbot
import Chatbot from './components/chatbot/Chatbot'

const SECTION_IDS = [
  'hero', 'about', 'skills', 'terminal', 'projects',
  'demos', 'experience', 'contact',
]

export default function App() {
  const [loading,        setLoading]      = useState(true)
  const [chatOpen,       setChatOpen]     = useState(false)
  const [activeSection,  setActiveSection] = useState('hero')

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (loading) return
    const observers = []
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [loading])

  // Body scroll lock during loading
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => { window.scrollTo(0, 0); setLoading(false) }} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative min-h-screen bg-bg-primary"
        >
          <GlowCursor />
          <div className="noise-overlay" />

          {/* Section-aware neural background */}
          <NeuralNetBg activeSection={activeSection} />

          <Navbar />

          <main className="relative z-10">
            <Hero onOpenChatbot={() => setChatOpen(true)} />

            <SynapseTransition />

            <About />
            <SynapseTransition />

            <Terminal />
            <SynapseTransition />

            <Skills />
            <SynapseTransition />

            <Projects />
            <SynapseTransition />

            <Demos />
            <SynapseTransition />

            <Journey />
            <SynapseTransition />

            <Shayari />
            <SynapseTransition />

            <Contact onOpenChatbot={() => setChatOpen(true)} />
          </main>

          <Footer onOpenChatbot={() => setChatOpen(true)} />

          <Chatbot
            isOpen={chatOpen}
            onOpen={() => setChatOpen(true)}
            onClose={() => setChatOpen(false)}
          />
        </motion.div>
      )}
    </>
  )
}
