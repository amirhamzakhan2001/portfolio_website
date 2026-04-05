import { useState, useCallback, useRef } from 'react'

// ── ReAct Agent ───────────────────────────────────────────────────────────────
const TOOLS = {
  search: { label: '🔍 Search', fn: q => `Found: "${q}" appears in 1,240 results. Top result: Wikipedia article on ${q}.` },
  calculator: { label: '🔢 Calculator', fn: expr => { try { return `Result: ${Function('"use strict"; return (' + expr + ')')()}` } catch { return 'Error: invalid expression' } } },
  weather: { label: '🌤 Weather', fn: city => `Weather in ${city}: 24°C, partly cloudy, humidity 65%.` },
  wiki: { label: '📖 Wikipedia', fn: topic => `Wikipedia: ${topic} — a concept in computer science/AI. See full article for details.` },
}

function ReactAgent() {
  const [task, setTask] = useState('What is 42 * 17 + the square root of 144?')
  const [trace, setTrace] = useState([])
  const [running, setRunning] = useState(false)

  const sleep = ms => new Promise(r => setTimeout(r, ms))

  const run = async () => {
    setRunning(true); setTrace([])
    const steps = [
      { type: 'thought', content: `I need to solve: "${task}". I'll break this into parts.` },
      { type: 'action', tool: 'calculator', input: '42 * 17' },
      { type: 'observation', content: TOOLS.calculator.fn('42 * 17') },
      { type: 'thought', content: 'Got 714. Now I need sqrt(144).' },
      { type: 'action', tool: 'calculator', input: 'Math.sqrt(144)' },
      { type: 'observation', content: TOOLS.calculator.fn('Math.sqrt(144)') },
      { type: 'thought', content: 'sqrt(144) = 12. Now add: 714 + 12 = 726.' },
      { type: 'action', tool: 'calculator', input: '714 + 12' },
      { type: 'observation', content: TOOLS.calculator.fn('714 + 12') },
      { type: 'answer', content: 'The final answer is 726. (42×17=714, √144=12, 714+12=726)' },
    ]
    for (const step of steps) {
      await sleep(600)
      setTrace(prev => [...prev, step])
    }
    setRunning(false)
  }

  const typeColors = {
    thought: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300',
    action: 'border-accent-indigo/30 bg-accent-indigo/5 text-accent-indigo',
    observation: 'border-green-500/30 bg-green-500/5 text-green-300',
    answer: 'border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan',
  }
  const typeLabels = { thought: '💭 Thought', action: '⚡ Action', observation: '👁 Observation', answer: '✅ Final Answer' }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={task} onChange={e => setTask(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50" />
        <button onClick={run} disabled={running} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all">
          {running ? '…' : 'Run Agent'}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {trace.map((step, i) => (
          <div key={i} className={`rounded-lg p-2.5 border text-xs font-mono ${typeColors[step.type]}`}>
            <div className="text-[9px] opacity-60 mb-1">{typeLabels[step.type]}</div>
            {step.type === 'action'
              ? <><span>{TOOLS[step.tool]?.label}: </span><span className="opacity-80">{step.input}</span></>
              : step.content}
          </div>
        ))}
        {running && <div className="text-xs font-mono text-text-muted animate-pulse">Agent thinking…</div>}
      </div>
    </div>
  )
}

// ── Tool Calling ──────────────────────────────────────────────────────────────
function ToolCalling() {
  const [query, setQuery] = useState('Search for Python tutorials and calculate 15% of 350')
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(0)

  const toolDefs = [
    { name: 'search', description: 'Search the web for information', params: { query: 'string' } },
    { name: 'calculator', description: 'Evaluate mathematical expressions', params: { expression: 'string' } },
    { name: 'weather', description: 'Get current weather for a city', params: { city: 'string' } },
  ]

  const run = async () => {
    setStep(1); setResult(null)
    await new Promise(r => setTimeout(r, 500))
    setStep(2)
    await new Promise(r => setTimeout(r, 600))

    // Simple intent detection
    const calls = []
    if (/search|find|look up/i.test(query)) {
      const match = query.match(/(?:search for|find|look up)\s+(.+?)(?:\s+and|\s*$)/i)
      calls.push({ tool: 'search', args: { query: match?.[1] ?? query }, result: TOOLS.search.fn(match?.[1] ?? 'topic') })
    }
    if (/calculate|%|\d+\s*[+\-*/]\s*\d+/i.test(query)) {
      const match = query.match(/(\d+(?:\.\d+)?%?\s*(?:of|[+\-*/])\s*\d+(?:\.\d+)?)/i)
      const expr = match?.[1]?.replace(/(\d+)%\s*of\s*(\d+)/i, '($1/100)*$2') ?? '1+1'
      calls.push({ tool: 'calculator', args: { expression: expr }, result: TOOLS.calculator.fn(expr) })
    }
    if (!calls.length) calls.push({ tool: 'search', args: { query }, result: TOOLS.search.fn(query) })

    setStep(3)
    await new Promise(r => setTimeout(r, 400))
    setResult(calls)
    setStep(4)
  }

  const steps = ['Idle', 'Parse Intent', 'Select Tools', 'Execute Calls', 'Return Results']

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50" />
        <button onClick={run} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Call Tools</button>
      </div>

      {/* Available tools */}
      <div className="grid grid-cols-3 gap-2">
        {toolDefs.map(t => (
          <div key={t.name} className="glass rounded-lg p-2 border border-white/5 text-center">
            <div className="text-[10px] font-mono text-accent-indigo">{TOOLS[t.name]?.label}</div>
            <div className="text-[9px] text-text-muted mt-0.5">{t.description}</div>
          </div>
        ))}
      </div>

      {step > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {steps.slice(1).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`text-[9px] font-mono px-2 py-1 rounded whitespace-nowrap transition-all ${step > i + 1 ? 'bg-accent-indigo text-white' : step === i + 1 ? 'bg-accent-indigo/30 text-accent-indigo animate-pulse' : 'bg-white/5 text-text-muted'}`}>
                {s}
              </div>
              {i < steps.length - 2 && <span className="text-text-muted">→</span>}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          {result.map((call, i) => (
            <div key={i} className="glass rounded-lg p-3 border border-accent-indigo/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-accent-indigo">{TOOLS[call.tool]?.label}</span>
                <span className="text-[10px] font-mono text-text-muted">({JSON.stringify(call.args)})</span>
              </div>
              <div className="text-xs text-text-secondary">{call.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Multi-Agent ───────────────────────────────────────────────────────────────
function MultiAgent() {
  const [topic, setTopic] = useState('AI safety and alignment')
  const [conversation, setConversation] = useState([])
  const [running, setRunning] = useState(false)

  const agents = {
    researcher: { name: 'Researcher', color: '#6366f1', icon: '🔬', style: 'analytical and fact-focused' },
    critic: { name: 'Critic', color: '#ef4444', icon: '⚡', style: 'skeptical and challenging' },
    synthesizer: { name: 'Synthesizer', color: '#22c55e', icon: '🧩', style: 'balanced and conclusive' },
  }

  const responses = {
    researcher: t => `Research shows that ${t} is a critical field. Key papers by Yann LeCun, Geoffrey Hinton, and Yoshua Bengio highlight fundamental challenges. Data suggests 73% of AI labs now have dedicated safety teams.`,
    critic: t => `While ${t} sounds important, current approaches are largely theoretical. Many safety benchmarks are easily gamed. Real-world deployment often reveals flaws not caught in research settings.`,
    synthesizer: t => `Balancing both views on ${t}: the research foundation is solid but critic's concerns about practical deployment gaps are valid. A hybrid approach—rigorous theory + real-world red-teaming—is most promising.`,
  }

  const run = async () => {
    setRunning(true); setConversation([])
    const order = ['researcher', 'critic', 'synthesizer']
    for (const agent of order) {
      await new Promise(r => setTimeout(r, 800))
      setConversation(prev => [...prev, { agent, text: responses[agent](topic) }])
    }
    setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={topic} onChange={e => setTopic(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
          placeholder="Discussion topic..." />
        <button onClick={run} disabled={running} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all">
          {running ? '…' : 'Debate'}
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        {Object.values(agents).map(a => (
          <div key={a.name} className="flex items-center gap-1.5 text-xs font-mono">
            <span>{a.icon}</span>
            <span style={{ color: a.color }}>{a.name}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {conversation.map((msg, i) => {
          const agent = agents[msg.agent]
          return (
            <div key={i} className="glass rounded-lg p-3 border border-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span>{agent.icon}</span>
                <span className="text-xs font-bold font-mono" style={{ color: agent.color }}>{agent.name}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{msg.text}</p>
            </div>
          )
        })}
        {running && conversation.length < 3 && (
          <div className="text-xs font-mono text-text-muted animate-pulse">Agent {['Researcher', 'Critic', 'Synthesizer'][conversation.length]} thinking…</div>
        )}
      </div>
    </div>
  )
}

// ── Memory Types ──────────────────────────────────────────────────────────────
function MemoryTypes() {
  const [active, setActive] = useState('buffer')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [k, setK] = useState(3)

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'assistant', text: `Response to: "${input}" — context remembered based on ${active} strategy.` }])
    setInput('')
  }

  const memoryTypes = {
    buffer: { label: 'Buffer (All)', description: 'Keeps full conversation history. Uses more tokens as chat grows.' },
    window: { label: `Window (K=${k})`, description: `Keeps only the last ${k} exchange(s). Fixed token usage.` },
    summary: { label: 'Summary', description: 'Periodically summarizes old messages to compress context.' },
    entity: { label: 'Entity', description: 'Extracts and tracks named entities separately. Efficient for long chats.' },
  }

  const visibleMessages = () => {
    if (active === 'buffer') return messages
    if (active === 'window') return messages.slice(-k * 2)
    if (active === 'summary') return messages.length > 4 ? [{ role: 'system', text: `[Summary of ${messages.length - 2} earlier messages]`, summary: true }, ...messages.slice(-2)] : messages
    return messages
  }

  const visible = visibleMessages()
  const tokensSaved = messages.length - visible.filter(m => !m.summary).length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(memoryTypes).map(([k2, { label }]) => (
          <button key={k2} onClick={() => setActive(k2)}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${active === k2 ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      {active === 'window' && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-muted">K (window size): <span className="text-accent-indigo">{k}</span></span>
          <input type="range" min={1} max={5} value={k} onChange={e => setK(+e.target.value)} className="flex-1 accent-indigo-500" />
        </div>
      )}

      <div className="glass rounded-lg p-3 border border-white/5 text-xs text-text-secondary">
        {memoryTypes[active].description}
      </div>

      {/* Chat area */}
      <div className="bg-bg-primary/40 rounded-xl border border-white/5 p-3 space-y-2 min-h-[100px] max-h-40 overflow-y-auto">
        {visible.length === 0 && <p className="text-xs font-mono text-text-muted text-center py-4">No messages yet. Start chatting!</p>}
        {visible.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-2.5 py-1.5 rounded-lg text-xs ${
              m.summary ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 font-mono text-[9px]'
              : m.role === 'user' ? 'bg-accent-indigo/20 text-text-primary'
              : 'bg-white/5 text-text-secondary'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
          placeholder="Type a message..." />
        <button onClick={send} className="px-3 py-1.5 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Send</button>
        <button onClick={() => setMessages([])} className="px-2 py-1.5 rounded-lg text-xs font-mono bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 transition-all">Clear</button>
      </div>

      {messages.length > 0 && (
        <div className="flex gap-4 text-xs font-mono text-text-muted">
          <span>Total: <span className="text-text-primary">{messages.length}</span> msgs</span>
          <span>In context: <span className="text-accent-indigo">{visible.filter(m => !m.summary).length}</span></span>
          {tokensSaved > 0 && <span>Compressed: <span className="text-green-400">{tokensSaved}</span></span>}
        </div>
      )}
    </div>
  )
}

// ── LangGraph Flow ────────────────────────────────────────────────────────────
function LangGraphFlow() {
  const [input, setInput] = useState('What is the weather in Mumbai and calculate 15% tip on ₹850?')
  const [state, setState] = useState(null)
  const [activeNode, setActiveNode] = useState(null)
  const [running, setRunning] = useState(false)

  const nodes = [
    { id: 'start', label: 'START', x: 150, y: 20, color: '#22c55e' },
    { id: 'router', label: 'Router', x: 150, y: 80, color: '#6366f1' },
    { id: 'weather', label: 'Weather Tool', x: 60, y: 150, color: '#06b6d4' },
    { id: 'calc', label: 'Calculator', x: 240, y: 150, color: '#f59e0b' },
    { id: 'merge', label: 'Merge', x: 150, y: 220, color: '#a855f7' },
    { id: 'end', label: 'END', x: 150, y: 280, color: '#22c55e' },
  ]
  const edges = [['start','router'],['router','weather'],['router','calc'],['weather','merge'],['calc','merge'],['merge','end']]

  const run = async () => {
    setRunning(true); setState(null); setActiveNode(null)
    const steps = ['start', 'router', 'weather', 'calc', 'merge', 'end']
    const parallel = 2 // weather and calc run "in parallel" visually
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setActiveNode(steps[i])
    }
    setState({
      weatherResult: 'Mumbai: 31°C, humid, partly cloudy',
      calcResult: '15% of ₹850 = ₹127.50',
      final: 'Weather: Mumbai 31°C. Tip: ₹127.50 on ₹850.',
    })
    setRunning(false)
  }

  const nodeById = id => nodes.find(n => n.id === id)
  const scaleX = v => v * 1.0
  const scaleY = v => v

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50" />
        <button onClick={run} disabled={running} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all">
          {running ? '…' : 'Run'}
        </button>
      </div>

      <svg viewBox="0 0 300 310" className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 240 }}>
        {edges.map(([a, b]) => {
          const na = nodeById(a), nb = nodeById(b)
          if (!na || !nb) return null
          return (
            <line key={`${a}-${b}`}
              x1={na.x} y1={na.y + 12} x2={nb.x} y2={nb.y - 12}
              stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="4 2" />
          )
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <rect x={n.x - 40} y={n.y - 12} width={80} height={24} rx={6}
              fill={activeNode === n.id ? n.color : n.color + '22'}
              stroke={n.color} strokeWidth={activeNode === n.id ? 2 : 1}
              style={{ transition: 'fill 0.3s' }} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill={activeNode === n.id ? '#fff' : n.color}
              fontSize={8} fontFamily="monospace" fontWeight={activeNode === n.id ? 'bold' : 'normal'}>{n.label}</text>
          </g>
        ))}
      </svg>

      {state && (
        <div className="space-y-2">
          {[
            { label: '🌤 Weather Node', val: state.weatherResult, color: 'text-accent-cyan' },
            { label: '🔢 Calculator Node', val: state.calcResult, color: 'text-yellow-400' },
            { label: '🧩 Final Output', val: state.final, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-lg p-2 border border-white/5">
              <span className="text-[10px] font-mono text-text-muted">{s.label}: </span>
              <span className={`text-xs font-mono ${s.color}`}>{s.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
const COMPONENTS = {
  ReactAgent,
  ToolCalling,
  MultiAgent,
  MemoryTypes,
  LangGraphFlow,
}

export default function AgenticDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
