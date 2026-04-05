import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'

// ── Command responses ────────────────────────────────────────────────────────
const COMMANDS = {
  help: `Available commands:
  amir.skills()          list all skills by category
  amir.projects()        list all featured projects
  amir.voxa()            Voxa voice agent deep-dive
  amir.hire()            initiate hiring sequence
  amir.contact()         contact information
  amir.achievements()    key wins & recognitions
  amir.urdu()            an Iqbal verse (try it)
  amir.roast()           let the AI roast you
  whoami                 identify visitor
  ls                     list sections
  cat resume.txt         view resume summary
  ping amir              latency test
  sudo hire amir         shortcut to contact
  clear                  clear terminal`,

  'amir.skills()': `→ Languages    Python ████████░░  SQL ████████░░  FastAPI ██████░░░░
→ AI / ML      PyTorch ████████░░  HuggingFace ████████░░  Transformers ██████░░░░
→ Gen AI       LangChain ████████░░  Claude ████████░░  RAG Pipelines ████████░░
→ Data         Pandas ████████░░  Qdrant ██████░░░░  PostgreSQL ██████░░░░
→ MLOps        Docker ████████░░  MLflow ██████░░░░  Git ██████░░░░

44 skills across 5 domains. Type amir.skills('genai') for details.`,

  "amir.skills('genai')": `Gen AI & NLP Stack:
  LangChain        ████████░░  Advanced   [prod]
  Anthropic Claude ████████░░  Advanced   [prod]
  OpenAI API       ████████░░  Advanced   [prod]
  RAG Pipelines    ████████░░  Advanced   [prod]
  Voice AI STT/TTS ████████░░  Advanced   [prod]
  Text Embeddings  ████████░░  Advanced   [prod]
  Prompt Eng.      ████████░░  Advanced   [prod]
  LangGraph        ██████░░░░  Proficient
  Google Gemini    ██████░░░░  Proficient [prod]`,

  'amir.projects()': `9 projects shipped. Highlights:

  [LIVE]  Voxa               Real-time voice AI agent @ KreoHealth
  [LIVE]  Cognivo            AI cognitive assessment platform
  [PUB]   NLP Email          60K+ emails processed, 94.3% accuracy
  [PUB]   ChaaBot            University query AI (RAG + LangGraph)
  [PUB]   Roast-o-Meter      Sentiment roast generator
  [PROG]  Query Management   University administrative AI

Run amir.voxa() for the full Voxa architecture.`,

  'amir.voxa()': `╔══════════════════════════════════════════════╗
║          Voxa Voice Agent Pipeline           ║
╚══════════════════════════════════════════════╝

  Phone Call
     │
  Twilio (telephony)
     │
  Deepgram (STT — speech to text)
     │
  LangGraph (agent orchestration)
     ├─→ Qdrant (vector search — RAG context)
     └─→ Anthropic Claude (LLM response)
     │
  ElevenLabs (TTS — text to speech)
     │
  Audio response → caller

  Status:   LIVE @ KreoHealth
  Uptime:   99.8%
  Latency:  <800ms end-to-end
  Providers: Twilio + 5 telephony options`,

  'amir.hire()': `✓ Excellent choice.

  Role match: ML Engineer / AI Engineer
  p(mutual_fit) = 0.94

  Amir is actively seeking full-time roles in:
  → AI/ML Engineering  → LLM/GenAI Engineering
  → Voice AI & Agents  → NLP Research

  Initiating contact...
  → Email: amirhamzakhan2001@gmail.com
  → Or scroll to Contact section below ↓`,

  'amir.contact()': `Contact Information:
  Email:     amirhamzakhan2001@gmail.com
  LinkedIn:  linkedin.com/in/amirhamzakhan032001
  GitHub:    github.com/amirhamzakhan2001
  Location:  New Delhi, India 🇮🇳

  Response time: ~24 hours
  Preferred topics: AI projects, full-time roles, hackathons`,

  'amir.achievements()': `→ MSc AI/ML @ JMI      — CGPA 9.38 / 10 (top of cohort)
→ KreoHealth           — Built Voxa, live in production
→ Amazon ML Summer     — Top 2500 / 7000+ teams (2023)
→ Dataverse IIT Madras — Finalist
→ Neural.net IIITB     — Participant
→ IBM AI Cert          — Enterprise Workflow Certified
→ 5 LLM providers      — Integrated in production systems`,

  'amir.urdu()': `"ستاروں سے آگے جہاں اور بھی ہیں"

  Beyond the stars, there are more worlds still.
  ابھی عشق کے امتحاں اور بھی ہیں
  Still more trials of love lie ahead.

                              — Allama Iqbal`,

  'amir.roast()': `Analyzing visitor profile...

  > You opened a portfolio terminal instead of just reading the page.
  > Either you're a developer, or you're lost. Both are valid.

  > Based on your curiosity: nerd score = 94/100 ✓
  > Hire probability increased to 0.97 for noticing this exists.

  — Amir.AI v2.0`,

  whoami: `Visitor detected.

  Role:      Unknown (probably a recruiter or a curious dev)
  Clearance: Guest
  Tip:       Type \`amir.hire()\` to upgrade permissions.
  Fact:      You're ~3 commands away from being impressed.`,

  ls: `sections/
  hero/    about/    skills/    projects/    demos/
  terminal/    experience/    achievements/    contact/

  Type \`cd <section>\` or click the neural map →`,

  'cat resume.txt': `Name:        Amir Hamza Khan
Title:       AI/ML Engineer
Education:   MSc AI/ML @ JMI (CGPA 9.38)
Current:     AI Intern @ KreoHealth — building Voxa
Skills:      Python, PyTorch, LangChain, Claude, Qdrant, FastAPI
Projects:    9 shipped (2 production-live)
Achievements:Top 2500 in Amazon ML | IIT Madras finalist

Download full resume: /resume.pdf`,

  'ping amir': `PING amir.amirhamzakhan.dev (0.0.0.0): 56 data bytes
64 bytes: icmp_seq=0 ttl=255 time=0.042 ms
64 bytes: icmp_seq=1 ttl=255 time=0.038 ms
64 bytes: icmp_seq=2 ttl=255 time=0.041 ms

--- amir ping statistics ---
3 packets transmitted, 3 received, 0% loss
round-trip: avg 0.040ms | human response: ~24h`,

  'sudo hire amir': `[sudo] password for recruiter: ••••••••••••
Checking permissions...................... ✓
Verifying skills.......................... ✓
Cross-referencing portfolio............... ✓

✓ Permission granted. Welcome aboard.

Redirecting to /contact...
(scroll down or type amir.contact())`,
}

const INTRO_LINES = [
  { text: 'visitor@amir-portfolio:~$ ', delay: 0 },
  { text: 'ssh amir@amirhamzakhan.dev', delay: 0, cmd: true },
  { text: 'Connecting...', delay: 600, output: true },
  { text: '✓ Connected. Welcome to Amir\'s terminal.', delay: 900, output: true },
  { text: 'Type `help` to see available commands.', delay: 1200, output: true },
]

function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    if (!text) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(iv)
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed])
  return displayed
}

function OutputLine({ text, isCmd }) {
  const typed = useTypewriter(isCmd ? text : '', 18)
  return (
    <div className={`font-mono text-xs leading-relaxed whitespace-pre-wrap ${
      isCmd ? 'text-text-primary' : 'text-text-secondary/80'
    }`}>
      {isCmd ? typed : text}
    </div>
  )
}

export default function Terminal() {
  const [history, setHistory]     = useState([])  // {type:'input'|'output', text}
  const [input, setInput]         = useState('')
  const [cmdHistory, setCmdHist]  = useState([])
  const [histIdx, setHistIdx]     = useState(-1)
  const [ready, setReady]         = useState(false)
  const outputRef = useRef(null)
  const inputRef  = useRef(null)

  // Intro sequence
  useEffect(() => {
    const timers = []
    timers.push(setTimeout(() => {
      setHistory([
        { type: 'output', text: 'Amir.AI Terminal v2.0 — session started' },
        { type: 'output', text: '─────────────────────────────────────────' },
        { type: 'input',  text: 'ssh amir@amirhamzakhan.dev' },
        { type: 'output', text: 'Connecting to amir@amirhamzakhan.dev...' },
        { type: 'output', text: '✓ Connected. Type `help` for commands.' },
        { type: 'output', text: '' },
      ])
      setReady(true)
    }, 300))
    return () => timers.forEach(clearTimeout)
  }, [])

  // Scroll only within the terminal box — never the page
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])

  const runCommand = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    const newHistory = [
      ...history,
      { type: 'input', text: raw.trim() },
    ]

    if (cmd === 'clear') {
      setHistory([{ type: 'output', text: 'Terminal cleared.' }])
      return
    }

    const response = COMMANDS[cmd] ?? COMMANDS[raw.trim()] ?? `Command not found: ${cmd}\nType \`help\` for available commands.`
    newHistory.push({ type: 'output', text: response })
    setHistory(newHistory)
    setCmdHist(h => [raw.trim(), ...h.slice(0, 49)])
    setHistIdx(-1)

    // Special: hire / contact → scroll to contact after delay
    if (cmd === 'amir.hire()' || cmd === 'sudo hire amir') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 1800)
    }
  }, [history])

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Autocomplete
      const matches = Object.keys(COMMANDS).filter(k => k.startsWith(input))
      if (matches.length === 1) setInput(matches[0])
    }
  }

  return (
    <section id="terminal" className="relative z-10 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; ./terminal.sh</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
            Interactive{' '}
            <span className="gradient-text">Terminal</span>
          </h2>
          <p className="text-text-muted text-center mb-10 max-w-xl mx-auto">
            Type commands to explore Amir's profile. Try <code className="text-accent-indigo font-mono text-sm">amir.voxa()</code> or <code className="text-accent-indigo font-mono text-sm">help</code>.
          </p>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="code-block pt-10"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Traffic lights */}
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-text-muted text-xs font-mono">amir@portfolio ~ terminal</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-green-400">live</span>
            </div>
          </div>

          {/* Output */}
          <div
            ref={outputRef}
            className="overflow-y-auto space-y-1 pr-1"
            style={{ minHeight: '320px', maxHeight: '420px' }}
          >
            {history.map((line, i) => (
              <div key={i} className="flex gap-2">
                {line.type === 'input' && (
                  <span className="font-mono text-xs text-accent-indigo whitespace-nowrap flex-shrink-0">
                    visitor@amir:~$
                  </span>
                )}
                <OutputLine text={line.text} isCmd={line.type === 'input'} />
              </div>
            ))}

            {/* Input line */}
            {ready && (
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs text-accent-indigo whitespace-nowrap flex-shrink-0">
                  visitor@amir:~$
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent font-mono text-xs text-text-primary outline-none caret-accent-cyan"
                  style={{ cursor: 'text' }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="font-mono text-xs text-accent-cyan animate-blink">█</span>
              </div>
            )}

          </div>
        </motion.div>

        {/* Quick command chips */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['help', 'amir.voxa()', 'amir.hire()', 'amir.urdu()', 'whoami'].map(cmd => (
            <button
              key={cmd}
              onClick={() => { runCommand(cmd); inputRef.current?.focus() }}
              className="text-[10px] font-mono bg-accent-indigo/10 border border-accent-indigo/25 text-accent-indigo px-2.5 py-1 rounded-full hover:bg-accent-indigo/20 transition cursor-none"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
