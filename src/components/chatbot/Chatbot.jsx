import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { botPersonality } from '../../data/chatbotData'
import { sendChatMessage } from '../../services/aiService'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          className="w-2 h-2 rounded-full bg-accent-indigo"
        />
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full overflow-hidden border border-accent-indigo/30 mr-2 flex-shrink-0 mt-1">
          <img src="/ahk_profile_pic.png" alt="Amir.AI" className="w-full h-full object-cover object-center" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? 'glass text-text-secondary rounded-tl-sm'
            : 'bg-gradient-to-r from-accent-indigo to-accent-violet text-white rounded-tr-sm'
        }`}
      >
        {msg.text}
        <div className={`text-[10px] mt-1 font-mono ${isBot ? 'text-text-muted' : 'text-white/50'} flex items-center gap-1.5`}>
          {msg.time}
          {msg.provider && (
            <span className="opacity-60">· {msg.provider}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-3 mb-2 px-3 py-2 bg-red-500/10 border border-red-500/25 rounded-lg text-xs font-mono text-red-400 flex items-center justify-between"
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100 cursor-none">✕</button>
    </motion.div>
  )
}

const QUICK_QUESTIONS = [
  'Tell me about Voxa',
  'What LLMs does Amir use?',
  'What are his best projects?',
  'How to contact him?',
]

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Chatbot({ isOpen, onClose, onOpen }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: botPersonality.greeting, time: now(), provider: null },
  ])
  // Full conversation history for the API (role: user | assistant)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [error, setError] = useState(null)
  const [providerInfo, setProviderInfo] = useState(null)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    setError(null)
    setInput('')

    // Add user message to display
    setMessages((prev) => [...prev, { role: 'user', text: trimmed, time: now() }])

    // Build API history (user + assistant turns only)
    const newHistory = [...history, { role: 'user', content: trimmed }]
    setHistory(newHistory)
    setIsTyping(true)

    try {
      const { reply, provider, source } = await sendChatMessage(newHistory)

      // Update conversation history with assistant reply
      setHistory((h) => [...h, { role: 'assistant', content: reply }])

      // Show provider info once (first real API response)
      if (source !== 'fallback' && !providerInfo) {
        setProviderInfo(provider)
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: reply,
          time: now(),
          provider: source === 'fallback' ? null : provider,
        },
      ])

      // TTS if enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utt = new SpeechSynthesisUtterance(reply)
        utt.rate = 1.05
        utt.pitch = 1.0
        window.speechSynthesis.speak(utt)
      }
    } catch (err) {
      console.error('[Chatbot] send error:', err)
      setError('Something went wrong. Check your API key or try again.')
      // Still add a graceful message
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: "I'm having trouble connecting right now. Please try again in a moment.", time: now(), provider: null },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError('Voice input requires Chrome or Edge.')
      return
    }

    const recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      sendMessage(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => {
      setIsListening(false)
      setError('Voice recognition failed. Try again.')
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const toggleVoiceOutput = () => {
    if (voiceEnabled) window.speechSynthesis?.cancel()
    setVoiceEnabled(!voiceEnabled)
  }

  const clearChat = () => {
    setMessages([{ role: 'bot', text: botPersonality.greeting, time: now(), provider: null }])
    setHistory([])
    setError(null)
    setProviderInfo(null)
  }

  return (
    <>
      {/* Floating bubble */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet shadow-glow-md flex items-center justify-center cursor-none"
          title="Chat with Amir.AI"
        >
          <MessageCircle size={22} className="text-white" />
          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-cyan border-2 border-bg-primary animate-pulse" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed bottom-6 right-6 z-40 w-80 sm:w-96 flex flex-col glass rounded-2xl overflow-hidden shadow-glow-md"
            style={{ maxHeight: '75vh' }}
          >
            {/* ── Header ── */}
            <div className="flex items-center gap-3 p-4 border-b border-accent-indigo/15 bg-bg-secondary/60 flex-shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-accent-indigo/40 flex-shrink-0">
                <img src="/ahk_profile_pic.png" alt="Amir.AI" className="w-full h-full object-cover object-center" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-sm text-text-primary flex items-center gap-1.5">
                  Amir.AI
                  {providerInfo && (
                    <span className="text-[10px] font-mono text-accent-cyan opacity-70">
                      · {providerInfo}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <span className="truncate">Ask me anything about Amir</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Voice output toggle */}
                <button
                  onClick={toggleVoiceOutput}
                  className={`p-1.5 rounded-lg transition-colors cursor-none ${voiceEnabled ? 'text-accent-cyan bg-accent-cyan/10' : 'text-text-muted hover:text-text-primary'}`}
                  title={voiceEnabled ? 'Mute voice' : 'Enable voice responses'}
                >
                  {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                {/* Clear chat */}
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-none text-xs font-mono"
                  title="Clear chat"
                >
                  ↺
                </button>
                {/* Close */}
                <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-none">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Error banner ── */}
            <AnimatePresence>
              {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
            </AnimatePresence>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ minHeight: 180 }}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-accent-indigo/30 mr-2 flex-shrink-0">
                    <img src="/ahk_profile_pic.png" alt="Amir.AI" className="w-full h-full object-cover object-center" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Quick questions (shown on first load) ── */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isTyping}
                    className="text-[11px] font-mono bg-accent-indigo/10 border border-accent-indigo/25 text-accent-indigo px-2.5 py-1 rounded-full hover:bg-accent-indigo/20 transition disabled:opacity-40 cursor-none"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input ── */}
            <div className="p-3 border-t border-accent-indigo/10 bg-bg-secondary/40 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? 'Listening...' : 'Ask about Amir...'}
                  disabled={isTyping}
                  className="flex-1 bg-bg-primary/60 border border-accent-indigo/20 rounded-xl px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-indigo/50 disabled:opacity-50 font-sans transition-colors"
                  style={{ cursor: 'text' }}
                />
                {/* Voice input */}
                <button
                  onClick={toggleVoiceInput}
                  disabled={isTyping}
                  className={`p-2 rounded-xl transition-colors cursor-none flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : 'text-text-muted hover:text-accent-indigo hover:bg-accent-indigo/10'
                  } disabled:opacity-40`}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
                {/* Send */}
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-accent-indigo text-white hover:bg-accent-violet transition disabled:opacity-40 cursor-none flex-shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="text-[10px] font-mono text-text-muted mt-1.5 text-center">
                Guardrailed · Only answers about Amir · AI-powered
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
