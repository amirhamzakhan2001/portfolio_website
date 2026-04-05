// Vercel Serverless — /api/demo/agent-step
// Executes one step of a ReAct-style agent loop.
// Allowed tools: calculator, datetime, search (allowlisted, no arbitrary exec).

const TOOL_SCHEMAS = [
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a mathematical expression. Use standard JS math syntax (e.g. Math.sqrt, *, +).',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Math expression, e.g. "42 * 17", "Math.sqrt(144)", "15 * 0.18"',
          },
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
          format: {
            type: 'string',
            enum: ['date', 'time', 'full'],
            description: 'Format of the datetime response',
          },
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
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
    },
  },
]

function executeTool(name, args) {
  if (name === 'calculator') {
    try {
      const expr = String(args.expression || '')
      // Allow only safe math characters
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

function detectProvider() {
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.GEMINI_API_KEY) return 'gemini'
  return null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { task, messages = [], availableTools = ['calculator', 'datetime', 'search'] } = req.body || {}

  if (!task && messages.length === 0) {
    return res.status(400).json({ error: 'task or messages required' })
  }

  const provider = detectProvider()
  if (!provider) {
    return res.status(503).json({ error: 'No AI provider configured.' })
  }

  const tools = TOOL_SCHEMAS.filter(t => availableTools.includes(t.function.name))
  const systemPrompt = 'You are a helpful ReAct agent demonstrating AI tool use. Think step by step. Use the available tools when needed. After getting tool results, provide a clear FINAL ANSWER. Be concise.'
  const msgs = messages.length > 0 ? messages : [{ role: 'user', content: task }]

  try {
    let step = null

    if (provider === 'openai') {
      const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
      if (!apiRes.ok) throw new Error(`OpenAI ${apiRes.status}: ${await apiRes.text()}`)
      const data = await apiRes.json()
      const choice = data.choices[0]
      const message = choice.message

      if (choice.finish_reason === 'tool_calls' && message.tool_calls?.length > 0) {
        const toolCall = message.tool_calls[0]
        const toolName = toolCall.function.name
        let toolArgs = {}
        try { toolArgs = JSON.parse(toolCall.function.arguments || '{}') } catch {}
        const toolResult = executeTool(toolName, toolArgs)

        step = {
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
        }
      } else {
        step = {
          type: 'final',
          content: message.content,
          message: { role: 'assistant', content: message.content },
        }
      }
    } else if (provider === 'gemini') {
      // Gemini: text-based reasoning (no structured tool_calls in all models)
      const toolDesc = tools.map(t => `${t.function.name}: ${t.function.description}`).join('; ')
      const geminiMsgs = msgs.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
      }))
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      step = { type: 'final', content: text, message: { role: 'assistant', content: text } }
    }

    return res.status(200).json({ step, provider: provider === 'openai' ? 'openai (gpt-4o-mini)' : 'gemini-2.0-flash' })
  } catch (err) {
    console.error('[api/demo/agent-step]', err.message)
    return res.status(500).json({ error: err.message || 'Agent step error' })
  }
}
