import { useState, useCallback, useEffect } from 'react'
import { isAdvancedDemo } from '../../config/demoTier'
import { demoStream } from '../../services/demoApiService'

// ── Tokenizer ─────────────────────────────────────────────────────────────────
function Tokenizer() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.')
  const [mode, setMode] = useState('word')

  const tokenize = useCallback(t => {
    if (mode === 'word') return t.trim().split(/\s+/).filter(Boolean)
    if (mode === 'char') return t.split('')
    if (mode === 'subword') {
      // Simple BPE-like: split by common suffixes
      return t.trim().split(/\s+/).flatMap(word => {
        const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 's', 'tion', 'ness']
        for (const s of suffixes) {
          if (word.toLowerCase().endsWith(s) && word.length > s.length + 2)
            return [word.slice(0, -s.length), '##' + s]
        }
        return [word]
      })
    }
    if (mode === 'sentence') return t.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
    return []
  }, [mode, text])

  const tokens = tokenize(text)
  const COLORS = ['#6366f1', '#06b6d4', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899']

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
        className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none" />

      <div className="flex flex-wrap gap-2">
        {['word', 'char', 'subword', 'sentence'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${mode === m ? 'bg-accent-indigo text-white' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-text-muted self-center">{tokens.length} tokens</span>
      </div>

      <div className="flex flex-wrap gap-1.5 p-3 bg-bg-primary/40 rounded-xl border border-white/5 min-h-[60px]">
        {tokens.map((tok, i) => (
          <span key={i} className="px-2 py-0.5 rounded text-xs font-mono text-white"
            style={{ background: COLORS[i % COLORS.length] + '55', border: `1px solid ${COLORS[i % COLORS.length]}66` }}>
            {tok === ' ' ? '·' : tok}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="glass rounded-lg p-2 border border-white/5">
          <span className="text-text-muted">Vocab size (unique): </span>
          <span className="text-accent-indigo">{new Set(tokens.map(t => t.toLowerCase())).size}</span>
        </div>
        <div className="glass rounded-lg p-2 border border-white/5">
          <span className="text-text-muted">Avg token length: </span>
          <span className="text-accent-cyan">{(tokens.reduce((s, t) => s + t.length, 0) / tokens.length || 0).toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

// ── TF-IDF ────────────────────────────────────────────────────────────────────
function TFIDF() {
  const [docs, setDocs] = useState([
    'machine learning algorithms are fascinating',
    'deep learning is a subset of machine learning',
    'natural language processing uses machine learning',
    'computer vision and image recognition deep learning',
  ])
  const [query, setQuery] = useState('machine learning')
  const [results, setResults] = useState(null)

  const compute = useCallback(() => {
    const tokenize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
    const tokenized = docs.map(tokenize)
    const N = docs.length

    // TF
    const tf = tokenized.map(tokens => {
      const freq = {}
      tokens.forEach(t => freq[t] = (freq[t] || 0) + 1)
      const max = Math.max(...Object.values(freq))
      const out = {}
      Object.entries(freq).forEach(([k, v]) => out[k] = v / tokens.length)
      return out
    })

    // IDF
    const allTerms = [...new Set(tokenized.flat())]
    const idf = {}
    allTerms.forEach(term => {
      const df = tokenized.filter(t => t.includes(term)).length
      idf[term] = Math.log((N + 1) / (df + 1)) + 1
    })

    // TF-IDF
    const tfidf = tf.map(docTf => {
      const out = {}
      Object.entries(docTf).forEach(([k, v]) => out[k] = v * (idf[k] || 0))
      return out
    })

    // Query scoring
    const qTerms = tokenize(query)
    const scores = tfidf.map((docVec, i) => ({
      doc: docs[i],
      score: qTerms.reduce((s, t) => s + (docVec[t] || 0), 0),
      topTerms: Object.entries(docVec).sort(([,a],[,b]) => b - a).slice(0, 3),
    })).sort((a, b) => b.score - a.score)

    setResults(scores)
  }, [docs, query])

  useEffect(() => { compute() }, [])

  const maxScore = results ? Math.max(...results.map(r => r.score), 0.01) : 1

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {docs.map((d, i) => (
          <input key={i} value={d} onChange={e => setDocs(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
            className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50" />
        ))}
      </div>
      <div className="flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-bg-primary/60 border border-accent-indigo/20 rounded-lg px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50"
          placeholder="Search query..." />
        <button onClick={compute} className="px-4 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Score</button>
      </div>

      {results && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`glass rounded-lg p-3 border transition-all ${i === 0 ? 'border-accent-indigo/30' : 'border-white/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-text-muted">#{i + 1}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-indigo rounded-full transition-all duration-500" style={{ width: `${(r.score / maxScore) * 100}%` }} />
                </div>
                <span className="text-xs font-mono text-accent-indigo w-14 text-right">{r.score.toFixed(4)}</span>
              </div>
              <p className="text-xs text-text-secondary">{r.doc}</p>
              <div className="flex gap-1 mt-1">
                {r.topTerms.map(([t, s]) => (
                  <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-text-muted">{t}:{s.toFixed(2)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Cosine Similarity ─────────────────────────────────────────────────────────
function CosineSimilarity() {
  const [textA, setTextA] = useState('I love machine learning and artificial intelligence')
  const [textB, setTextB] = useState('Deep learning is a part of artificial intelligence')
  const [similarity, setSimilarity] = useState(null)

  const compute = useCallback(() => {
    const tokenize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean)
    const a = tokenize(textA), b = tokenize(textB)
    const vocab = [...new Set([...a, ...b])]
    const vecA = vocab.map(w => a.filter(t => t === w).length)
    const vecB = vocab.map(w => b.filter(t => t === w).length)
    const dot = vecA.reduce((s, v, i) => s + v * vecB[i], 0)
    const normA = Math.sqrt(vecA.reduce((s, v) => s + v * v, 0))
    const normB = Math.sqrt(vecB.reduce((s, v) => s + v * v, 0))
    const cos = normA * normB > 0 ? dot / (normA * normB) : 0
    const shared = vocab.filter((_, i) => vecA[i] > 0 && vecB[i] > 0)
    setSimilarity({ cos, shared, vocab, vecA, vecB })
  }, [textA, textB])

  useEffect(() => { compute() }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div>
          <label className="text-[10px] font-mono text-accent-indigo mb-1 block">Document A</label>
          <textarea value={textA} onChange={e => setTextA(e.target.value)} rows={2}
            className="w-full bg-bg-primary/60 border border-accent-indigo/20 rounded-lg px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none" />
        </div>
        <div>
          <label className="text-[10px] font-mono text-accent-cyan mb-1 block">Document B</label>
          <textarea value={textB} onChange={e => setTextB(e.target.value)} rows={2}
            className="w-full bg-bg-primary/60 border border-accent-cyan/20 rounded-lg px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-cyan/50 resize-none" />
        </div>
      </div>
      <button onClick={compute} className="w-full py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Compute Similarity</button>

      {similarity && (
        <>
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="8"
                  strokeDasharray={`${similarity.cos * 251.2} 251.2`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-accent-indigo">{(similarity.cos * 100).toFixed(0)}%</span>
                <span className="text-[9px] font-mono text-text-muted">similarity</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-lg p-3 border border-white/5">
            <div className="text-[10px] font-mono text-text-muted mb-2">Shared terms ({similarity.shared.length}):</div>
            <div className="flex flex-wrap gap-1">
              {similarity.shared.map(w => (
                <span key={w} className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent-indigo/15 text-accent-indigo border border-accent-indigo/20">{w}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Sentiment Analysis ────────────────────────────────────────────────────────
const LEXICON = {
  positive: ['good','great','excellent','amazing','wonderful','love','best','happy','fantastic','awesome','brilliant','perfect','beautiful','joy','nice','pleasant','superb','outstanding'],
  negative: ['bad','terrible','awful','hate','worst','horrible','sad','disgusting','poor','disappointing','nasty','dreadful','ugly','boring','annoying','useless','failure'],
  intensifiers: { very: 1.5, extremely: 2, super: 1.5, really: 1.3, quite: 1.2, not: -1, never: -1 },
}

function Sentiment() {
  const [text, setText] = useState('This product is absolutely amazing and I really love it! Great quality.')
  const [result, setResult] = useState(null)

  const analyze = useCallback(() => {
    const words = text.toLowerCase().replace(/[^a-z\s!?]/g, '').split(/\s+/).filter(Boolean)
    let score = 0
    const hits = []
    let modifier = 1

    words.forEach((word, i) => {
      if (LEXICON.intensifiers[word] !== undefined) {
        modifier = LEXICON.intensifiers[word]
        hits.push({ word, type: 'modifier', score: 0 })
      } else if (LEXICON.positive.includes(word)) {
        const s = 1 * modifier
        score += s
        hits.push({ word, type: 'positive', score: s })
        modifier = 1
      } else if (LEXICON.negative.includes(word)) {
        const s = -1 * modifier
        score += s
        hits.push({ word, type: 'negative', score: s })
        modifier = 1
      } else {
        hits.push({ word, type: 'neutral', score: 0 })
        modifier = 1
      }
    })

    // Exclamation bonus
    const excl = (text.match(/!/g) || []).length
    score += excl * 0.2

    const label = score > 0.5 ? 'Positive' : score < -0.5 ? 'Negative' : 'Neutral'
    const emoji = score > 0.5 ? '😊' : score < -0.5 ? '😞' : '😐'
    setResult({ score, label, emoji, hits })
  }, [text])

  useEffect(() => { analyze() }, [])

  const colorFor = type => ({ positive: 'text-green-400', negative: 'text-red-400', modifier: 'text-yellow-400', neutral: 'text-text-muted' }[type])
  const bgFor = type => ({ positive: 'bg-green-500/10 border-green-500/20', negative: 'bg-red-500/10 border-red-500/20', modifier: 'bg-yellow-500/10 border-yellow-500/20', neutral: 'bg-transparent border-transparent' }[type])

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
        className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none" />
      <button onClick={analyze} className="w-full py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Analyze Sentiment</button>

      {result && (
        <>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">{result.emoji}</span>
            <div>
              <div className={`text-xl font-bold font-mono ${result.label === 'Positive' ? 'text-green-400' : result.label === 'Negative' ? 'text-red-400' : 'text-text-muted'}`}>
                {result.label}
              </div>
              <div className="text-xs font-mono text-text-muted">Score: {result.score.toFixed(2)}</div>
            </div>
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20" />
              {result.score > 0
                ? <div className="absolute h-full bg-green-500 rounded-full" style={{ left: '50%', width: `${Math.min(50, result.score * 10)}%` }} />
                : <div className="absolute h-full bg-red-500 rounded-full" style={{ right: '50%', width: `${Math.min(50, -result.score * 10)}%` }} />}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 bg-bg-primary/40 rounded-xl border border-white/5">
            {result.hits.map((h, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-xs font-mono border ${bgFor(h.type)} ${colorFor(h.type)}`}>
                {h.word}{h.score !== 0 ? ` (${h.score > 0 ? '+' : ''}${h.score.toFixed(1)})` : ''}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Word Embeddings ───────────────────────────────────────────────────────────
function WordEmbeddings() {
  const words = {
    king: [0.8, 0.9], queen: [0.75, -0.85], man: [0.7, 0.6], woman: [0.65, -0.7],
    cat: [-0.6, 0.5], dog: [-0.65, 0.6], paris: [-0.8, -0.8], france: [-0.85, -0.6],
    apple: [-0.4, 0.3], microsoft: [-0.3, -0.4], happy: [0.5, 0.2], sad: [0.4, -0.5],
  }
  const [sel1, setSel1] = useState('king')
  const [sel2, setSel2] = useState('queen')
  const [analogy, setAnalogy] = useState({ a: 'king', b: 'man', c: 'queen' })

  const cosineSim = (a, b) => {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0)
    const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
    const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
    return na * nb > 0 ? dot / (na * nb) : 0
  }

  const sim = cosineSim(words[sel1], words[sel2])

  // Analogy: a - b + c = ?
  const { a, b, c } = analogy
  const target = words[a] && words[b] && words[c]
    ? words[a].map((v, i) => v - words[b][i] + words[c][i]) : null
  const analogyResult = target ? Object.entries(words)
    .filter(([w]) => w !== a && w !== b && w !== c)
    .map(([w, v]) => ({ w, s: cosineSim(target, v) }))
    .sort((x, y) => y.s - x.s)[0] : null

  const allX = Object.values(words).map(v => v[0])
  const allY = Object.values(words).map(v => v[1])
  const xRange = [Math.min(...allX) - 0.2, Math.max(...allX) + 0.2]
  const yRange = [Math.min(...allY) - 0.2, Math.max(...allY) + 0.2]
  const toSX = v => 10 + (v - xRange[0]) / (xRange[1] - xRange[0]) * 280
  const toSY = v => 10 + (1 - (v - yRange[0]) / (yRange[1] - yRange[0])) * 180

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-bg-primary/40 border border-white/5" style={{ height: 320, minHeight: 260 }}>
        {Object.entries(words).map(([w, v]) => {
          const cx = toSX(v[0]), cy = toSY(v[1])
          const isSelected = w === sel1 || w === sel2
          return (
            <g key={w} onClick={() => sel1 === w ? null : sel2 === w ? null : setSel1(w)} className="cursor-pointer">
              <circle cx={cx} cy={cy} r={isSelected ? 6 : 4}
                fill={w === sel1 ? '#6366f1' : w === sel2 ? '#06b6d4' : 'rgba(255,255,255,0.2)'}
                stroke={isSelected ? 'white' : 'none'} strokeWidth={1} />
              <text x={cx + 6} y={cy + 4} fill={isSelected ? '#fff' : 'rgba(255,255,255,0.5)'} fontSize={8} fontFamily="monospace">{w}</text>
            </g>
          )
        })}
        {/* Similarity line */}
        {words[sel1] && words[sel2] && (
          <line x1={toSX(words[sel1][0])} y1={toSY(words[sel1][1])} x2={toSX(words[sel2][0])} y2={toSY(words[sel2][1])}
            stroke="rgba(99,102,241,0.4)" strokeWidth={1.5} strokeDasharray="4 2" />
        )}
      </svg>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Word A</label>
          <select value={sel1} onChange={e => setSel1(e.target.value)}
            className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-text-primary focus:outline-none">
            {Object.keys(words).map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-text-muted block mb-1">Word B</label>
          <select value={sel2} onChange={e => setSel2(e.target.value)}
            className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-text-primary focus:outline-none">
            {Object.keys(words).map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>

      <div className="glass rounded-lg p-3 border border-white/5 text-center">
        <div className="text-xs font-mono text-text-muted">Cosine Similarity</div>
        <div className={`text-2xl font-bold font-mono ${sim > 0.7 ? 'text-green-400' : sim > 0.3 ? 'text-yellow-400' : 'text-red-400'}`}>{sim.toFixed(3)}</div>
      </div>

      {analogyResult && (
        <div className="glass rounded-lg p-3 border border-accent-indigo/20">
          <div className="text-[10px] font-mono text-text-muted mb-1">Analogy: {a} − {b} + {c} = ?</div>
          <div className="text-sm font-bold font-mono text-accent-indigo">→ {analogyResult.w} <span className="text-text-muted font-normal">(score: {analogyResult.s.toFixed(3)})</span></div>
        </div>
      )}
    </div>
  )
}

// ── NER ───────────────────────────────────────────────────────────────────────
function NER() {
  const [text, setText] = useState('Elon Musk founded Tesla and SpaceX in California. He met Sundar Pichai in New York last Tuesday.')
  const [entities, setEntities] = useState(null)

  const ENTITIES = {
    PERSON: ['Elon Musk', 'Sundar Pichai', 'Jeff Bezos', 'Sam Altman', 'Amir Hamza', 'Barack Obama', 'Tim Cook'],
    ORG: ['Tesla', 'SpaceX', 'Google', 'Apple', 'Microsoft', 'OpenAI', 'Amazon', 'Meta'],
    LOC: ['California', 'New York', 'India', 'London', 'San Francisco', 'Silicon Valley', 'Seattle'],
    DATE: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'January', 'February', 'March', 'last week', 'yesterday', 'today'],
  }

  const analyze = () => {
    const found = []
    Object.entries(ENTITIES).forEach(([type, ents]) => {
      ents.forEach(ent => {
        let idx = text.indexOf(ent)
        while (idx !== -1) {
          found.push({ text: ent, type, start: idx, end: idx + ent.length })
          idx = text.indexOf(ent, idx + 1)
        }
      })
    })
    found.sort((a, b) => a.start - b.start)
    setEntities(found)
  }

  useEffect(() => { analyze() }, [])

  const TYPE_COLORS = { PERSON: '#6366f1', ORG: '#06b6d4', LOC: '#22c55e', DATE: '#f59e0b' }

  const renderHighlighted = () => {
    if (!entities) return text
    const parts = []
    let last = 0
    entities.forEach(({ text: t, type, start, end }) => {
      if (start >= last) {
        if (start > last) parts.push(<span key={`t${start}`} className="text-text-secondary">{text.slice(last, start)}</span>)
        parts.push(
          <span key={`e${start}`} className="rounded px-1 py-0.5 text-white text-xs font-bold mx-0.5"
            style={{ background: TYPE_COLORS[type] + '44', border: `1px solid ${TYPE_COLORS[type]}66`, color: TYPE_COLORS[type] }}>
            {t} <span className="text-[8px] opacity-70">[{type}]</span>
          </span>
        )
        last = end
      }
    })
    if (last < text.length) parts.push(<span key="tail" className="text-text-secondary">{text.slice(last)}</span>)
    return parts
  }

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
        className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none" />
      <button onClick={analyze} className="w-full py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 transition-all">Extract Entities</button>

      <div className="p-3 bg-bg-primary/40 rounded-xl border border-white/5 text-sm leading-8">
        {renderHighlighted()}
      </div>

      {entities && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_COLORS).map(([type, color]) => {
            const count = entities.filter(e => e.type === type).length
            return (
              <div key={type} className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span style={{ color }}>{type}</span>
                <span className="text-text-muted">({count})</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Advanced: Sentiment (real AI classification) ───────────────────────────────
function SentimentAdvanced() {
  const [text, setText] = useState('This product is absolutely amazing and I really love it! Great quality.')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)

  const analyze = async () => {
    setLoading(true); setResult(null); setError(null)
    try {
      const { text: raw, provider: p } = await demoStream({
        prompt:
          `Analyze the sentiment of this text: "${text}"\n\nRespond with ONLY valid JSON (no markdown, no explanation outside JSON):\n{"label":"Positive","confidence":0.95,"key_phrases":["love","amazing"],"brief":"One-sentence explanation."}`,
        systemPrompt: 'You are a sentiment analysis API. Output ONLY a single valid JSON object. No markdown code fences, no extra text.',
        temperature: 0.05,
        maxTokens: 140,
      })
      setProvider(p)
      const jsonStr = raw.replace(/```json\n?|\n?```/g, '').trim()
      setResult(JSON.parse(jsonStr))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { analyze() }, []) // auto-run on mount

  const emoji = result ? (result.label === 'Positive' ? '😊' : result.label === 'Negative' ? '😞' : '😐') : null

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={analyze}
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all cursor-none"
        >
          {loading ? '⟳ Analyzing with AI…' : '▶ Analyze Sentiment (Live AI)'}
        </button>
        {provider && <span className="text-[10px] font-mono text-green-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />{provider}</span>}
      </div>

      {result && (
        <>
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">{emoji}</span>
            <div>
              <div className={`text-xl font-bold font-mono ${result.label === 'Positive' ? 'text-green-400' : result.label === 'Negative' ? 'text-red-400' : 'text-text-muted'}`}>
                {result.label}
              </div>
              <div className="text-xs font-mono text-text-muted">Confidence: {Math.round((result.confidence ?? 0) * 100)}%</div>
            </div>
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20" />
              {result.label !== 'Negative'
                ? <div className="absolute h-full bg-green-500 rounded-full transition-all duration-700" style={{ left: '50%', width: `${result.label === 'Positive' ? (result.confidence ?? 0.5) * 50 : 0}%` }} />
                : <div className="absolute h-full bg-red-500 rounded-full transition-all duration-700" style={{ right: '50%', width: `${(result.confidence ?? 0.5) * 50}%` }} />}
            </div>
          </div>

          {result.key_phrases?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-3 bg-bg-primary/40 rounded-xl border border-white/5">
              {result.key_phrases.map((phrase, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-xs font-mono border ${
                    result.label === 'Positive' ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : result.label === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-white/5 border-white/10 text-text-muted'
                  }`}
                >
                  {phrase}
                </span>
              ))}
            </div>
          )}

          {result.brief && (
            <div className="glass rounded-lg p-3 border border-white/5">
              <div className="text-[10px] font-mono text-text-muted mb-1">AI Explanation:</div>
              <p className="text-xs text-text-secondary leading-relaxed">{result.brief}</p>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="text-[10px] font-mono text-yellow-400 text-center">
          ⚠ {error.includes('No demo API') || error.includes('503') ? 'Set VITE_* keys or run vercel dev' : error}
        </div>
      )}
    </div>
  )
}

// ── Advanced: NER (real AI entity extraction) ──────────────────────────────────
function NERAdvanced() {
  const [text, setText] = useState('Elon Musk founded Tesla and SpaceX in California. He met Sundar Pichai in New York last Tuesday.')
  const [entities, setEntities] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)

  const analyze = async () => {
    setLoading(true); setEntities(null); setError(null)
    try {
      const { text: raw, provider: p } = await demoStream({
        prompt:
          `Extract named entities from this text: "${text}"\n\nRespond with ONLY a JSON array (no markdown):\n[{"entity":"Elon Musk","type":"PERSON"},{"entity":"Tesla","type":"ORG"}]\nAllowed types: PERSON, ORG, LOC, DATE, MISC.`,
        systemPrompt: 'You are a named entity recognition API. Output ONLY a valid JSON array of entity objects. No markdown, no extra text.',
        temperature: 0.05,
        maxTokens: 200,
      })
      setProvider(p)
      const jsonStr = raw.replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(jsonStr)
      const found = []
      parsed.forEach(({ entity, type }) => {
        let idx = text.indexOf(entity)
        while (idx !== -1) {
          found.push({ text: entity, type, start: idx, end: idx + entity.length })
          idx = text.indexOf(entity, idx + 1)
        }
      })
      found.sort((a, b) => a.start - b.start)
      setEntities(found)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { analyze() }, [])

  const TYPE_COLORS = { PERSON: '#6366f1', ORG: '#06b6d4', LOC: '#22c55e', DATE: '#f59e0b', MISC: '#a855f7' }

  const renderHighlighted = () => {
    if (!entities) return <span className="text-text-secondary">{text}</span>
    const parts = []
    let last = 0
    entities.forEach(({ text: t, type, start, end }) => {
      if (start >= last) {
        if (start > last) parts.push(<span key={`t${start}`} className="text-text-secondary">{text.slice(last, start)}</span>)
        const color = TYPE_COLORS[type] || '#94a3b8'
        parts.push(
          <span
            key={`e${start}`}
            className="rounded px-1 py-0.5 mx-0.5 text-xs font-bold"
            style={{ background: color + '33', border: `1px solid ${color}55`, color }}
          >
            {t} <span className="text-[8px] opacity-70">[{type}]</span>
          </span>
        )
        last = end
      }
    })
    if (last < text.length) parts.push(<span key="tail" className="text-text-secondary">{text.slice(last)}</span>)
    return parts
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        className="w-full bg-bg-primary/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-indigo/50 resize-none"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={analyze}
          disabled={loading}
          className="flex-1 py-2 rounded-lg text-xs font-mono bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/30 hover:bg-accent-indigo/30 disabled:opacity-50 transition-all cursor-none"
        >
          {loading ? '⟳ Extracting entities…' : '▶ Extract Entities (Live AI)'}
        </button>
        {provider && <span className="text-[10px] font-mono text-green-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />{provider}</span>}
      </div>

      <div className="p-3 bg-bg-primary/40 rounded-xl border border-white/5 text-sm leading-8 min-h-16">
        {loading
          ? <span className="text-text-muted text-xs font-mono animate-pulse">Analyzing…</span>
          : renderHighlighted()}
      </div>

      {entities && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_COLORS).map(([type, color]) => {
            const count = entities.filter(e => e.type === type).length
            if (!count) return null
            return (
              <div key={type} className="flex items-center gap-1.5 text-xs font-mono">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span style={{ color }}>{type}</span>
                <span className="text-text-muted">({count})</span>
              </div>
            )
          })}
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
  Tokenizer,
  TFIDF,
  CosineSimilarity,
  Sentiment,
  WordEmbeddings,
  NER,
}

const COMPONENTS_ADVANCED = {
  Tokenizer,
  TFIDF,
  CosineSimilarity,
  Sentiment: SentimentAdvanced,
  WordEmbeddings,
  NER: NERAdvanced,
}

const COMPONENTS = isAdvancedDemo ? COMPONENTS_ADVANCED : COMPONENTS_MEDIUM

export default function NLPDemos({ componentName }) {
  const Demo = COMPONENTS[componentName]
  if (!Demo) return <div className="text-text-muted text-sm font-mono py-8 text-center">Demo not found: {componentName}</div>
  return <Demo />
}
