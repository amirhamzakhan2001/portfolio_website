import { useState, useCallback, useEffect, useRef } from 'react'
import { isAdvancedDemo } from '../../config/demoTier'
import { demoStream } from '../../services/demoApiService'

// ── RAG Pipeline ──────────────────────────────────────────────────────────────
const KNOWLEDGE_BASE = [
  { id: 1, text: 'Amir Hamza Khan is an AI/ML Engineer specializing in deep learning and NLP.' },
  { id: 2, text: 'Transformer architecture uses self-attention mechanisms to process sequences in parallel.' },
  { id: 3, text: 'RAG stands for Retrieval-Augmented Generation, combining search with LLMs.' },
  { id: 4, text: 'Embeddings are dense vector representations that capture semantic meaning of text.' },
  { id: 5, text: 'LangChain is a framework for building applications with large language models.' },
  { id: 6, text: 'Vector databases like Pinecone, Weaviate store embeddings for similarity search.' },
  { id: 7, text: 'Fine-tuning adapts a pre-trained model to a specific task using labeled data.' },
  { id: 8, text: 'GPT-4 and Claude are examples of large language models used for generation.' },
]

function RAGPipeline() {
  const [query, setQuery] = useState('What is RAG and how does it work?')
  const [step, setStep] = useState(0)
  const [retrieved, setRetrieved] = useState([])
  const [response, setResponse] = useState('')
  const [running, setRunning] = useState(false)

  const tokenize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
  const score = (q, doc) => {
    const qt = new Set(tokenize(q)), dt = new Set(tokenize(doc.text))
    let overlap = 0; qt.forEach(w => dt.has(w) && overlap++)
    return overlap / (qt.size || 1)
  }

  const run = async () => {
    setRunning(true); setStep(0); setRetrieved([]); setResponse('')
    await new Promise(r => setTimeout(r, 600)); setStep(1)
    await new Promise(r => setTimeout(r, 700)); setStep(2)
    const scored = KNOWLEDGE_BASE.map(doc => ({ ...doc, score: score(query, doc) }))
      .sort((a, b) => b.score - a.score).slice(0, 3)
    setRetrieved(scored); setStep(3)
    await new Promise(r => setTimeout(r, 800)); setStep(4)
    // Template response
    const context = scored.map(d => d.text).join(' ')
    const words = query.toLowerCase().includes('rag') ?
      'Based on the retrieved context: RAG (Retrieval-Augmented Generation) combines a retrieval system with a generative LLM. First, documents are embedded into vectors and stored in a vector database. At inference time, the query is embedded, relevant docs are retrieved via similarity search, then passed as context to the LLM for grounded generation.' :
      `Based on the retrieved context, ${scored[0]?.text ?? 'No relevant information found.'}`
    let out = ''
    for (const char of words) {
      out += char; setResponse(out)
      await new Promise(r => setTimeout(r, 18))
    }
    setStep(5); setRunning(false)
  }

  const STEPS = ['Idle', 'Query Embedding', 'Vector Search', 'Retrieve Top-K', 'Augment Prompt', 'LLM Generation']

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
          placeholder="Ask a question..." />
        <button onClick={run} disabled={running} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all">
          {running ? '…' : 'Run RAG'}
        </button>
      </div>

      {/* Pipeline steps */}
      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {STEPS.slice(1).map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`text-[9px] font-mono px-2 py-1 rounded whitespace-nowrap transition-all ${step > i ? 'bg-accent-indigo text-white' : step === i + 1 ? 'bg-accent-indigo/30 text-accent-indigo border border-accent-indigo/40 animate-pulse' : 'bg-white/5 text-text-muted'}`}>
              {i + 1}. {s}
            </div>
            {i < STEPS.length - 2 && <span className="text-text-muted text-xs">→</span>}
          </div>
        ))}
      </div>

      {/* Retrieved docs */}
      {retrieved.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-text-muted">Retrieved documents (Top-3):</div>
          {retrieved.map(d => (
            <div key={d.id} className="glass rounded-lg p-2 border border-accent-indigo/10 flex gap-2">
              <span className="text-[10px] font-mono text-accent-indigo w-12 shrink-0">score:{d.score.toFixed(2)}</span>
              <p className="text-[10px] text-text-secondary">{d.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generated response */}
      {response && (
        <div className="glass rounded-xl p-4 border border-accent-cyan/20">
          <div className="text-[10px] font-mono text-accent-cyan mb-2">LLM Response (grounded):</div>
          <p className="text-xs text-text-secondary leading-relaxed">{response}<span className={step < 5 ? 'animate-pulse' : 'hidden'}>▌</span></p>
        </div>
      )}
    </div>
  )
}

// ── Prompt Lab ────────────────────────────────────────────────────────────────
const TEMPLATES = {
  zeroshot: { label: 'Zero-Shot', template: 'Classify the sentiment of the following text:\n\n"{input}"\n\nSentiment:' },
  fewshot: { label: 'Few-Shot', template: 'Classify sentiment:\n\n"I love it!" → Positive\n"This is terrible!" → Negative\n"It\'s okay." → Neutral\n\n"{input}" →' },
  chain: { label: 'Chain-of-Thought', template: 'Let\'s think step by step about the sentiment of: "{input}"\n\nStep 1: Identify key words\nStep 2: Assess tone\nStep 3: Conclude sentiment\n\nAnswer:' },
  system: { label: 'System Role', template: '[System: You are a sentiment expert. Always respond with Positive, Negative, or Neutral.]\n[User]: What is the sentiment of "{input}"?\n[Assistant]:' },
}

function PromptLab() {
  const [style, setStyle] = useState('zeroshot')
  const [input, setInput] = useState('The new update completely broke everything I relied on.')
  const [output, setOutput] = useState('')

  const simulate = useCallback(() => {
    const words = input.toLowerCase()
    const isPos = ['love', 'great', 'amazing', 'good', 'excellent', 'fantastic', 'wonderful'].some(w => words.includes(w))
    const isNeg = ['broke', 'terrible', 'bad', 'awful', 'hate', 'worst', 'horrible', 'completely broke'].some(w => words.includes(w))
    const label = isNeg ? 'Negative' : isPos ? 'Positive' : 'Neutral'

    if (style === 'chain') {
      const pos = ['broken', 'completely broke', 'update broke', 'relied on'].filter(w => words.includes(w))
      setOutput(`Step 1: Key words found: "${pos.join(', ') || 'neutral terms'}"\nStep 2: Tone is ${isNeg ? 'frustrated/negative' : isPos ? 'enthusiastic/positive' : 'balanced/neutral'}\nStep 3: Conclude: ${label}`)
    } else {
      setOutput(` ${label}`)
    }
  }, [style, input])

  useEffect(() => { simulate() }, [simulate])

  const prompt = TEMPLATES[style].template.replace('{input}', input)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(TEMPLATES).map(([k, { label }]) => (
          <button key={k} onClick={() => setStyle(k)}
            className={`px-2 py-1 rounded text-xs font-mono transition-all ${style === k ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>
      <div>
        <label className="text-[10px] font-mono text-text-muted block mb-1">Input text:</label>
        <input value={input} onChange={e => setInput(e.target.value)}
          className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50" />
      </div>
      <div className="code-block pt-8 text-xs font-mono text-accent-indigo leading-relaxed whitespace-pre-wrap">
        <div className="absolute top-0 left-0 right-0 h-7 flex items-center gap-1.5 px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-text-muted text-[10px]">prompt</span>
        </div>
        {prompt}
        {output && <span className="text-accent-cyan">{output}</span>}
      </div>
    </div>
  )
}

// ── Temperature Effect ────────────────────────────────────────────────────────
const VOCAB = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'runs', 'fast', 'slow', 'big', 'small', 'happy']
const BASE_LOGITS = [2.1, 1.5, 0.8, 1.2, 0.6, 1.0, 0.4, 0.9, 1.1, 0.7, 0.5, 0.8, 0.6, 0.3]

function TemperatureEffect() {
  const [temp, setTemp] = useState(1.0)
  const [sampled, setSampled] = useState([])
  const [count, setCount] = useState(0)

  const softmax = t => {
    const scaled = BASE_LOGITS.map(l => l / t)
    const max = Math.max(...scaled)
    const exp = scaled.map(l => Math.exp(l - max))
    const sum = exp.reduce((a, b) => a + b)
    return exp.map(v => v / sum)
  }

  const sample = () => {
    const probs = softmax(temp)
    let r = Math.random(), cumul = 0
    for (let i = 0; i < probs.length; i++) {
      cumul += probs[i]
      if (r < cumul) { setSampled(prev => [...prev.slice(-15), VOCAB[i]]); break }
    }
    setCount(c => c + 1)
  }

  const probs = softmax(temp)
  const entropy = -probs.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-text-muted">Temperature: <span className={`font-bold ${temp < 0.5 ? 'text-red-400' : temp > 1.5 ? 'text-green-400' : 'text-accent-indigo'}`}>{temp.toFixed(1)}</span></span>
        <input type="range" min={0.1} max={3} step={0.1} value={temp} onChange={e => setTemp(+e.target.value)} className="flex-1 accent-indigo-500" />
        <span className="text-[10px] font-mono text-text-muted">{temp < 0.5 ? 'Greedy' : temp > 1.5 ? 'Creative' : 'Balanced'}</span>
      </div>

      {/* Probability bars */}
      <div className="space-y-1">
        {VOCAB.map((w, i) => (
          <div key={w} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted w-16">{w}</span>
            <div className="flex-1 h-4 bg-white/5 rounded overflow-hidden">
              <div className="h-full rounded transition-all duration-300"
                style={{ width: `${probs[i] * 100}%`, background: `rgba(99,102,241,${0.3 + probs[i] * 0.7})` }} />
            </div>
            <span className="text-[10px] font-mono text-accent-indigo w-10 text-right">{(probs[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-lg p-2 border border-white/5 text-center">
          <div className="text-[9px] font-mono text-text-muted">Entropy (diversity)</div>
          <div className="text-sm font-bold font-mono text-accent-cyan">{entropy.toFixed(2)} bits</div>
        </div>
        <div className="flex gap-2">
          <button onClick={sample} className="flex-1 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Sample Token</button>
          <button onClick={() => { setSampled([]); setCount(0) }} className="px-3 py-2 rounded-lg text-xs font-mono bg-white/5 text-text-muted border border-white/10 hover:bg-white/10 transition-all">Clear</button>
        </div>
      </div>

      {sampled.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-bg-primary/40 rounded-xl border border-white/5">
          {sampled.map((w, i) => (
            <span key={i} className="px-2 py-0.5 rounded text-xs font-mono bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20">{w}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Token Counter ─────────────────────────────────────────────────────────────
function TokenCounter() {
  const [text, setText] = useState('Hello! I am building an AI portfolio using React and Tailwind CSS. Large language models tokenize text differently than humans read it.')
  const [model, setModel] = useState('gpt4')

  const models = {
    gpt4: { label: 'GPT-4', costPer1k: 0.03, contextWindow: 128000 },
    gpt35: { label: 'GPT-3.5', costPer1k: 0.002, contextWindow: 16000 },
    claude: { label: 'Claude 3', costPer1k: 0.015, contextWindow: 200000 },
    llama: { label: 'Llama 3', costPer1k: 0.0, contextWindow: 8000 },
  }

  // Approximate BPE tokenization
  const tokenize = t => {
    // Simple approximation: ~4 chars per token for English
    const words = t.split(/\s+/).filter(Boolean)
    const tokens = []
    words.forEach(w => {
      if (w.length <= 4) tokens.push(w)
      else {
        let i = 0
        while (i < w.length) {
          tokens.push(w.slice(i, i + Math.ceil(Math.random() * 3 + 2)))
          i += Math.ceil(Math.random() * 3 + 2)
        }
      }
    })
    return tokens
  }

  const tokens = tokenize(text)
  const tokenCount = Math.round(text.length / 4) // rough approximation
  const { costPer1k, contextWindow } = models[model]
  const cost = (tokenCount / 1000 * costPer1k).toFixed(6)
  const pctContext = (tokenCount / contextWindow * 100).toFixed(2)

  const COLORS = ['#6366f1', '#06b6d4', '#a855f7', '#22c55e', '#f59e0b', '#ef4444']
  let wordIdx = 0

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
        className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none" />

      <div className="flex flex-wrap gap-2">
        {Object.entries(models).map(([k, { label }]) => (
          <button key={k} onClick={() => setModel(k)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${model === k ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Tokens (approx)', val: tokenCount, color: 'text-accent-indigo' },
          { label: 'Characters', val: text.length, color: 'text-accent-cyan' },
          { label: 'Estimated Cost', val: `$${cost}`, color: 'text-green-400' },
          { label: 'Context Used', val: `${pctContext}%`, color: parseFloat(pctContext) > 80 ? 'text-red-400' : 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="glass rounded-lg p-2 border border-white/5">
            <div className="text-[9px] font-mono text-text-muted">{s.label}</div>
            <div className={`text-lg font-bold font-mono ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-bg-primary/40 rounded-xl border border-white/5 flex flex-wrap gap-0.5 text-xs font-mono">
        {text.split(/\s+/).filter(Boolean).map((w, i) => (
          <span key={i} className="rounded px-0.5" style={{ background: COLORS[i % COLORS.length] + '30', color: COLORS[i % COLORS.length] }}>
            {w}{' '}
          </span>
        ))}
      </div>
      <p className="text-[10px] font-mono text-text-muted text-center">Approximate tokenization — actual results vary by model's BPE vocab</p>
    </div>
  )
}

// ── Embedding Space ───────────────────────────────────────────────────────────
function EmbeddingSpace() {
  const concepts = [
    { label: 'king', x: 0.8, y: 0.7, group: 'royalty' },
    { label: 'queen', x: 0.7, y: -0.7, group: 'royalty' },
    { label: 'prince', x: 0.6, y: 0.5, group: 'royalty' },
    { label: 'princess', x: 0.55, y: -0.55, group: 'royalty' },
    { label: 'python', x: -0.7, y: 0.8, group: 'tech' },
    { label: 'javascript', x: -0.6, y: 0.7, group: 'tech' },
    { label: 'react', x: -0.8, y: 0.6, group: 'tech' },
    { label: 'tensorflow', x: -0.65, y: 0.75, group: 'tech' },
    { label: 'pizza', x: -0.5, y: -0.8, group: 'food' },
    { label: 'pasta', x: -0.6, y: -0.7, group: 'food' },
    { label: 'burger', x: -0.3, y: -0.9, group: 'food' },
    { label: 'sushi', x: -0.7, y: -0.6, group: 'food' },
  ]
  const GROUPS = { royalty: '#6366f1', tech: '#06b6d4', food: '#22c55e' }
  const [hover, setHover] = useState(null)

  const xRange = [-1, 1], yRange = [-1, 1]
  const toX = v => 10 + (v - xRange[0]) / (xRange[1] - xRange[0]) * 280
  const toY = v => 10 + (1 - (v - yRange[0]) / (yRange[1] - yRange[0])) * 180

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        {Object.entries(GROUPS).map(([g, color]) => (
          <div key={g} className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span style={{ color }}>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 320, minHeight: 260 }}>
        {/* Axes */}
        <line x1={10} y1={100} x2={290} y2={100} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <line x1={150} y1={10} x2={150} y2={190} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <text x={285} y={97} fill="rgba(255,255,255,0.3)" fontSize={8}>d₁</text>
        <text x={152} y={14} fill="rgba(255,255,255,0.3)" fontSize={8}>d₂</text>

        {/* Points */}
        {concepts.map((c, i) => {
          const cx = toX(c.x), cy = toY(c.y)
          const color = GROUPS[c.group]
          const isHovered = hover === i
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <circle cx={cx} cy={cy} r={isHovered ? 8 : 5} fill={color} fillOpacity={0.8}
                stroke={isHovered ? 'white' : color} strokeWidth={isHovered ? 1.5 : 0.5} />
              <text x={cx + 7} y={cy + 3} fill={isHovered ? '#fff' : 'rgba(255,255,255,0.6)'} fontSize={isHovered ? 9 : 7} fontFamily="monospace">{c.label}</text>
            </g>
          )
        })}

        {/* Cluster hulls (simplified) */}
        {hover !== null && (
          <text x={150} y={200} fill="rgba(255,255,255,0.5)" fontSize={8} textAnchor="middle" fontFamily="monospace">
            {concepts[hover].label} → [{concepts[hover].x.toFixed(2)}, {concepts[hover].y.toFixed(2)}]
          </text>
        )}
      </svg>
      <p className="text-[10px] font-mono text-text-muted text-center">Semantically similar words cluster together in embedding space</p>
    </div>
  )
}

// ── Shared helper ─────────────────────────────────────────────────────────────
async function animateText(fullText, setter, delayMs = 13) {
  for (let i = 1; i <= fullText.length; i++) {
    await new Promise(r => setTimeout(r, delayMs))
    setter(fullText.slice(0, i))
  }
}

// ── Advanced: Prompt Lab (real LLM streaming) ─────────────────────────────────
function PromptLabAdvanced() {
  const [style, setStyle] = useState('zeroshot')
  const [input, setInput] = useState('The new update completely broke everything I relied on.')
  const [output, setOutput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)

  const prompt = TEMPLATES[style].template.replace('{input}', input)

  const run = useCallback(async () => {
    setStreaming(true); setOutput(''); setError(null)
    try {
      const { text, provider: p } = await demoStream({
        prompt,
        systemPrompt:
          'You are a language model completing prompts for educational AI demos. Follow the prompt format exactly. Respond concisely and directly without meta-commentary.',
        temperature: 0.35,
        maxTokens: 130,
      })
      setProvider(p)
      await animateText(text, setOutput)
    } catch (err) {
      setError(err.message)
    } finally {
      setStreaming(false)
    }
  }, [prompt])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {Object.entries(TEMPLATES).map(([k, { label }]) => (
          <button
            key={k}
            onClick={() => { setStyle(k); setOutput(''); setError(null) }}
            className={`px-2 py-1 rounded text-xs font-mono transition-all cursor-none ${style === k ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
          >
            {label}
          </button>
        ))}
        {provider && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {provider}
          </span>
        )}
      </div>

      <div>
        <label className="text-[10px] font-mono text-text-muted block mb-1">Input text:</label>
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setOutput(''); }}
          className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
        />
      </div>

      <div className="code-block pt-8 text-xs font-mono text-accent-indigo leading-relaxed whitespace-pre-wrap">
        <div className="absolute top-0 left-0 right-0 h-7 flex items-center gap-1.5 px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-text-muted text-[10px]">prompt → {provider || 'LLM'}</span>
        </div>
        {prompt}
        {output && <span className="text-accent-cyan"> {output}</span>}
        {streaming && !output && <span className="text-accent-cyan animate-pulse"> ▌</span>}
        {streaming && output && <span className="text-accent-cyan animate-pulse">▌</span>}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={run}
          disabled={streaming}
          className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all cursor-none"
        >
          {streaming ? '⟳ Generating…' : '▶ Run Real LLM'}
        </button>
        {error && (
          <span className="text-[10px] font-mono text-yellow-400">
            ⚠ {error.includes('No demo API') || error.includes('503') ? 'Set VITE_* keys or run vercel dev' : error}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Advanced: RAG Pipeline (real LLM generation) ───────────────────────────────
function RAGPipelineAdvanced() {
  const [query, setQuery] = useState('What is RAG and how does it work?')
  const [step, setStep] = useState(0)
  const [retrieved, setRetrieved] = useState([])
  const [response, setResponse] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)

  const tokenize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/)
  const score = (q, doc) => {
    const qt = new Set(tokenize(q)), dt = new Set(tokenize(doc.text))
    let overlap = 0; qt.forEach(w => dt.has(w) && overlap++)
    return overlap / (qt.size || 1)
  }

  const STEPS = ['Idle', 'Query Embedding', 'Vector Search', 'Retrieve Top-K', 'Augment Prompt', 'LLM Generation']

  const run = async () => {
    setRunning(true); setStep(0); setRetrieved([]); setResponse(''); setError(null)
    await new Promise(r => setTimeout(r, 500)); setStep(1)
    await new Promise(r => setTimeout(r, 600)); setStep(2)
    const scored = KNOWLEDGE_BASE.map(doc => ({ ...doc, score: score(query, doc) }))
      .sort((a, b) => b.score - a.score).slice(0, 3)
    setRetrieved(scored); setStep(3)
    await new Promise(r => setTimeout(r, 500)); setStep(4)

    const context = scored.map((d, i) => `[${i + 1}] ${d.text}`).join('\n')
    const ragPrompt = `Context documents:\n${context}\n\nQuestion: ${query}\n\nAnswer using only the provided context. Be concise (2-3 sentences).`
    try {
      const { text, provider: p } = await demoStream({
        prompt: ragPrompt,
        systemPrompt: 'You are a RAG assistant. Answer questions strictly using the provided context documents. Cite document numbers when relevant.',
        temperature: 0.2,
        maxTokens: 180,
      })
      setProvider(p); setStep(5)
      await animateText(text, setResponse, 11)
    } catch (err) {
      setError(err.message); setStep(5)
    }
    setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
          placeholder="Ask a question…"
        />
        <button
          onClick={run}
          disabled={running}
          className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all cursor-none"
        >
          {running ? '…' : 'Run RAG'}
        </button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-1">
        {STEPS.slice(1).map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`text-[9px] font-mono px-2 py-1 rounded whitespace-nowrap transition-all ${step > i ? 'bg-accent-indigo text-white' : step === i + 1 ? 'bg-accent-indigo/30 text-accent-indigo border border-accent-indigo/40 animate-pulse' : 'bg-white/5 text-text-muted'}`}>
              {i + 1}. {s}
            </div>
            {i < STEPS.length - 2 && <span className="text-text-muted text-xs">→</span>}
          </div>
        ))}
      </div>

      {retrieved.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-text-muted">Retrieved (keyword similarity):</div>
          {retrieved.map(d => (
            <div key={d.id} className="glass rounded-lg p-2 border border-accent-indigo/10 flex gap-2">
              <span className="text-[10px] font-mono text-accent-indigo w-12 shrink-0">score:{d.score.toFixed(2)}</span>
              <p className="text-[10px] text-text-secondary">{d.text}</p>
            </div>
          ))}
        </div>
      )}

      {(response || (step >= 5 && !error)) && (
        <div className="glass rounded-xl p-4 border border-accent-cyan/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[10px] font-mono text-accent-cyan">Real LLM Response</div>
            {provider && (
              <span className="text-[9px] font-mono text-green-400 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                {provider}
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {response}
            {running && step >= 4 && <span className="animate-pulse text-accent-cyan">▌</span>}
          </p>
        </div>
      )}

      {error && (
        <div className="text-[10px] font-mono text-yellow-400 text-center">
          ⚠ {error.includes('No demo API') || error.includes('503') ? 'Set VITE_* keys or run vercel dev' : error}
        </div>
      )}
    </div>
  )
}

// ── Registry ──────────────────────────────────────────────────────────────────
const COMPONENTS_MEDIUM = {
  RAGPipeline,
  PromptLab,
  TemperatureEffect,
  TokenCounter,
  EmbeddingSpace,
}

const COMPONENTS_ADVANCED = {
  RAGPipeline: RAGPipelineAdvanced,
  PromptLab: PromptLabAdvanced,
  TemperatureEffect,
  TokenCounter,
  EmbeddingSpace,
}

const COMPONENTS = isAdvancedDemo ? COMPONENTS_ADVANCED : COMPONENTS_MEDIUM

export default function GenAIDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
