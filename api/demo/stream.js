// Vercel Serverless — /api/demo/stream
// Educational AI completions for demo components.
// Keys stay server-side; never exposed to client.

function detectProvider() {
  const explicit = (process.env.AI_PROVIDER || '').toLowerCase().trim()
  if (explicit === 'openai' && process.env.OPENAI_API_KEY) return 'openai'
  if (explicit === 'gemini' && process.env.GEMINI_API_KEY) return 'gemini'
  if (explicit === 'claude' && process.env.CLAUDE_API_KEY) return 'claude'
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.CLAUDE_API_KEY) return 'claude'
  return null
}

async function complete(provider, systemPrompt, prompt, temperature, maxTokens) {
  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
    const data = await res.json()
    return { text: data.choices[0].message.content.trim(), provider: 'openai (gpt-4o-mini)' }
  }

  if (provider === 'gemini') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    return { text: data.candidates[0].content.parts[0].text.trim(), provider: 'gemini-2.0-flash' }
  }

  if (provider === 'claude') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error(`Claude ${res.status}`)
    const data = await res.json()
    return { text: data.content[0].text.trim(), provider: 'claude-haiku' }
  }

  throw new Error('Unknown provider')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const {
    prompt,
    systemPrompt = 'You are an educational AI assistant for interactive machine learning demos. Be concise and accurate.',
    temperature = 0.7,
    maxTokens = 250,
  } = req.body || {}

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'prompt string required' })
  }

  // Hard caps to limit cost per demo call
  const cappedTokens = Math.min(maxTokens, 400)
  const cappedTemp = Math.max(0, Math.min(2, temperature))

  const provider = detectProvider()
  if (!provider) {
    return res.status(503).json({ error: 'No AI provider configured. Set OPENAI_API_KEY, GEMINI_API_KEY, or CLAUDE_API_KEY.' })
  }

  try {
    const result = await complete(provider, systemPrompt, prompt, cappedTemp, cappedTokens)
    return res.status(200).json(result)
  } catch (err) {
    console.error('[api/demo/stream]', err.message)
    return res.status(500).json({ error: err.message || 'AI provider error' })
  }
}
