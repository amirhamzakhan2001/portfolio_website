// Demo AI API — same pattern as aiService.js:
// 1) Prefer /api/demo/* (Vercel / vercel dev — keys server-side)
// 2) On 404 (plain `npm run dev`), fall back to direct browser calls using VITE_* keys

const VITE_OPENAI = import.meta.env.VITE_OPENAI_API_KEY
const VITE_GEMINI = import.meta.env.VITE_GEMINI_API_KEY
const EXPLICIT = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase().trim()

function detectDirectProvider() {
  if (EXPLICIT === 'openai' && VITE_OPENAI) return 'openai'
  if (EXPLICIT === 'gemini' && VITE_GEMINI) return 'gemini'
  if (VITE_OPENAI) return 'openai'
  if (VITE_GEMINI) return 'gemini'
  return null
}

const TOOL_SCHEMAS = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a mathematical expression. Use standard JS math syntax (e.g. Math.sqrt, *, +).',
      parameters: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'Math expression' },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'datetime',
      description: 'Get current date and time information.',
      parameters: {
        type: 'object',
        properties: {
          format: { type: 'string', enum: ['date', 'time', 'full'] },
        },
        required: ['format'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search',
      description: 'Look up general knowledge about a topic (returns a concise summary).',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
  },
]

function executeTool(name, args) {
  if (name === 'calculator') {
    try {
      const expr = String(args.expression || '')
      const safe = expr.replace(/[^0-9+\-*/.()%\sMathsqrtpowabsfloorceil,]/g, '')
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; const Math=globalThis.Math; return (' + safe + ')')()
      return String(result)
    } catch {
      return 'Error: could not evaluate expression'
    }
  }
  if (name === 'datetime') {
    const now = new Date()
    if (args.format === 'date') return now.toDateString()
    if (args.format === 'time') return now.toTimeString().split(' ')[0]
    return now.toString()
  }
  if (name === 'search') {
    const q = (args.query || '').toLowerCase()
    if (q.includes('machine learning') || q.includes(' ml ')) return 'Machine Learning enables computers to learn patterns from data without explicit programming. Core algorithms: linear regression, decision trees, SVMs, neural networks, ensemble methods (Random Forest, XGBoost).'
    if (q.includes('deep learning') || q.includes('neural network')) return 'Deep Learning uses multi-layer neural networks to learn hierarchical representations. Architectures: CNNs (images), RNNs/LSTMs (sequences), Transformers (NLP). Powers GPT, DALL-E, AlphaFold.'
    if (q.includes('transformer') || q.includes('attention')) return 'Transformer (Vaswani et al., 2017) uses self-attention to process sequences in parallel. Scaled Dot-Product Attention: Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. Foundation for BERT, GPT, T5, LLaMA.'
    if (q.includes('rag') || q.includes('retrieval')) return 'RAG (Retrieval-Augmented Generation) combines vector retrieval with LLMs. Pipeline: chunk → embed → store in vector DB → at query time: embed query → similarity search → retrieve top-K → augment LLM prompt.'
    if (q.includes('python')) return 'Python is the dominant language for AI/ML. Key libraries: NumPy (arrays), Pandas (dataframes), Matplotlib/Seaborn (plots), Scikit-learn (classical ML), PyTorch/TensorFlow (deep learning), Hugging Face (models).'
    if (q.includes('langchain') || q.includes('langgraph')) return 'LangChain is a framework for LLM applications. LangGraph adds stateful multi-agent workflows as directed graphs. Both support OpenAI, Anthropic, Gemini, and open-source models.'
    return `Knowledge about "${args.query}": A broad topic in computer science and AI. It encompasses theoretical foundations, practical algorithms, and real-world applications across domains like NLP, computer vision, and reinforcement learning.`
  }
  return 'Tool not found'
}

async function directStreamOpenAI(systemPrompt, prompt, temperature, maxTokens) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VITE_OPENAI}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data = await res.json()
  return { text: data.choices[0].message.content.trim(), provider: 'openai (direct)' }
}

async function directStreamGemini(systemPrompt, prompt, temperature, maxTokens) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${VITE_GEMINI}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return { text: data.candidates[0].content.parts[0].text.trim(), provider: 'gemini (direct)' }
}

/**
 * Completion for GenAI / NLP advanced demos.
 * @param {{ prompt: string, systemPrompt?: string, temperature?: number, maxTokens?: number }} opts
 */
export async function demoStream(opts) {
  const {
    prompt,
    systemPrompt = 'You are an educational AI assistant for interactive machine learning demos. Be concise and accurate.',
    temperature = 0.7,
    maxTokens = 250,
  } = opts

  const cappedTokens = Math.min(maxTokens, 400)
  const cappedTemp = Math.max(0, Math.min(2, temperature))

  const tryApi = async () => {
    const res = await fetch('/api/demo/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        systemPrompt,
        temperature: cappedTemp,
        maxTokens: cappedTokens,
      }),
    })
    if (res.status === 404) throw new Error('no-api')
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `API ${res.status}`)
    }
    return res.json()
  }

  try {
    return await tryApi()
  } catch (err) {
    const isNoRoute =
      err.message === 'no-api' ||
      err.name === 'TypeError' ||
      (typeof err.message === 'string' && err.message.includes('Failed to fetch'))
    if (!isNoRoute) {
      throw err
    }
  }

  const direct = detectDirectProvider()
  if (direct === 'openai') {
    return directStreamOpenAI(systemPrompt, prompt, cappedTemp, cappedTokens)
  }
  if (direct === 'gemini') {
    return directStreamGemini(systemPrompt, prompt, cappedTemp, cappedTokens)
  }

  throw new Error(
    'No demo API: run `npx vercel dev` for /api/demo routes, or set VITE_OPENAI_API_KEY or VITE_GEMINI_API_KEY for plain npm run dev.'
  )
}

async function directAgentStepOpenAI(task, messages, availableTools) {
  const tools = TOOL_SCHEMAS.filter((t) => availableTools.includes(t.function.name))
  const systemPrompt =
    'You are a helpful ReAct agent demonstrating AI tool use. Think step by step. Use the available tools when needed. After getting tool results, provide a clear FINAL ANSWER. Be concise.'
  const msgs = messages.length > 0 ? messages : [{ role: 'user', content: task }]

  const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VITE_OPENAI}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...msgs],
      tools,
      tool_choice: 'auto',
      max_tokens: 300,
      temperature: 0.2,
    }),
  })
  if (!apiRes.ok) throw new Error(`OpenAI ${apiRes.status}`)
  const data = await apiRes.json()
  const choice = data.choices[0]
  const message = choice.message

  if (choice.finish_reason === 'tool_calls' && message.tool_calls?.length > 0) {
    const toolCall = message.tool_calls[0]
    const toolName = toolCall.function.name
    let toolArgs = {}
    try {
      toolArgs = JSON.parse(toolCall.function.arguments || '{}')
    } catch {}
    const toolResult = executeTool(toolName, toolArgs)
    return {
      step: {
        type: 'tool_call',
        thought: message.content || null,
        tool: toolName,
        toolArgs,
        toolResult,
        message: {
          role: 'assistant',
          content: message.content,
          tool_calls: message.tool_calls,
        },
        toolMessage: {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: toolResult,
        },
      },
      provider: 'openai (direct)',
    }
  }

  return {
    step: {
      type: 'final',
      content: message.content,
      message: { role: 'assistant', content: message.content },
    },
    provider: 'openai (direct)',
  }
}

async function directAgentStepGemini(task, messages) {
  const systemPrompt =
    'You are a helpful ReAct agent demonstrating AI tool use. Think step by step. Use the available tools when needed. After getting tool results, provide a clear FINAL ANSWER. Be concise.'
  const toolDesc = TOOL_SCHEMAS.map((t) => `${t.function.name}: ${t.function.description}`).join('; ')
  const msgs = messages.length > 0 ? messages : [{ role: 'user', content: task }]
  const geminiMsgs = msgs.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
  }))

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${VITE_GEMINI}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: `${systemPrompt}\n\nAvailable tools: ${toolDesc}` }],
        },
        contents: geminiMsgs,
        generationConfig: { maxOutputTokens: 300, temperature: 0.2 },
      }),
    }
  )
  if (!geminiRes.ok) throw new Error(`Gemini ${geminiRes.status}`)
  const gData = await geminiRes.json()
  const text = gData.candidates[0].content.parts[0].text
  return {
    step: { type: 'final', content: text, message: { role: 'assistant', content: text } },
    provider: 'gemini (direct)',
  }
}

/**
 * One ReAct agent step (tool call or final answer).
 */
export async function demoAgentStep(payload) {
  const tryApi = async () => {
    const res = await fetch('/api/demo/agent-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.status === 404) throw new Error('no-api')
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `API ${res.status}`)
    }
    return res.json()
  }

  try {
    return await tryApi()
  } catch (err) {
    const isNoRoute =
      err.message === 'no-api' ||
      err.name === 'TypeError' ||
      (typeof err.message === 'string' && err.message.includes('Failed to fetch'))
    if (!isNoRoute) {
      throw err
    }
  }

  const { task, messages = [], availableTools = ['calculator', 'datetime', 'search'] } = payload
  const direct = detectDirectProvider()

  if (direct === 'openai') {
    return directAgentStepOpenAI(task, messages, availableTools)
  }
  if (direct === 'gemini') {
    return directAgentStepGemini(task, messages)
  }

  throw new Error(
    'No agent API: run `npx vercel dev` or set VITE_OPENAI_API_KEY (recommended) or VITE_GEMINI_API_KEY.'
  )
}
