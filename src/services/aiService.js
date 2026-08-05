// Frontend AI service
// Primary path:   calls /api/chat  (Vercel serverless — all providers, keys stay server-side)
// Fallback path:  direct browser calls for OpenAI/Gemini when running plain `npm run dev`
//                 (Claude requires `vercel dev` because Anthropic blocks browser CORS)

import { findResponse } from '../data/chatbotData'

const DIRECT_PROVIDERS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
  // Claude intentionally excluded — blocked by Anthropic CORS policy
}

const EXPLICIT_PROVIDER = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase().trim()

// Detect which provider to use for direct browser fallback
function detectDirectProvider() {
  if (EXPLICIT_PROVIDER === 'openai' && DIRECT_PROVIDERS.openai) return 'openai'
  if (EXPLICIT_PROVIDER === 'gemini' && DIRECT_PROVIDERS.gemini) return 'gemini'
  if (DIRECT_PROVIDERS.openai) return 'openai'
  if (DIRECT_PROVIDERS.gemini) return 'gemini'
  return null
}

// ─── Direct browser calls (fallback for local npm run dev) ───────────────────

async function directOpenAI(messages, systemPrompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIRECT_PROVIDERS.openai}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 400,
      temperature: 0.7,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data = await res.json()
  return { reply: data.choices[0].message.content.trim(), provider: 'openai (direct)' }
}

async function directGemini(messages, systemPrompt) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${DIRECT_PROVIDERS.gemini}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return { reply: data.candidates[0].content.parts[0].text.trim(), provider: 'gemini (direct)' }
}

// System prompt for direct browser calls
const BROWSER_SYSTEM_PROMPT = `You are Amir.AI, a personal AI assistant on Amir Hamza Khan's portfolio website. Answer questions about Amir in first-person ("Amir is...") in a friendly, professional tone. If a question is genuinely unrelated to Amir (e.g. "What is the capital of France?"), say: "I can only answer questions about Amir Hamza Khan." Be concise (2-4 sentences max unless detail is needed).

FULL PROFILE OF AMIR HAMZA KHAN:

IDENTITY: Full name is Amir Hamza Khan. He goes by Amir, Hamza, or Khan — any of these names in a question refers to him. AI/ML Engineer, based in New Delhi, India. Currently working on-site at KreoHealth, Noida.

EDUCATION:
- MSc Artificial Intelligence & Machine Learning, Jamia Millia Islamia (JMI), Central University, New Delhi — Semester 4, CGPA 9.38, Ranked 1st after Year 1 (SGPA 9.41)
- BSc (Hons) Applied Mathematics, JMI — CGPA 9.53, Ranked 2nd in class

WORK EXPERIENCE:
- AI Intern @ KreoHealth, Noida (Feb 2026–Present): Building Voxa, a production AI omnichannel SaaS platform
- AI Evaluation Researcher @ Outlier AI (Oct 2025–Present, remote): Evaluating LLM outputs for hallucination, reasoning, and safety. 80-90+ evaluations done.
- Student Placement Coordinator @ JMI CS Department

VOXA (flagship project at KreoHealth):
- AI-powered omnichannel communication platform
- STT→LLM→TTS voice agent pipeline with 5 LLM providers and 9 telephony integrations
- RAG-powered knowledge base on Qdrant vector DB
- Multi-channel campaigns: calls, SMS, email, WhatsApp
- 3 CRM integrations: HubSpot, Salesforce, Zoho
- Solved barge-in detection using WebRTC + Silero-VAD

LLMs AMIR USES / HAS WORKED WITH:
- Production: GPT-4, Claude (Anthropic), Google Gemini, DeepSeek, AWS Bedrock — all used at KreoHealth
- Fine-tuned models: Qwen (LoRA fine-tuning for JMI chatbot), BERT, GPT-2, CLIP, Gemma
- Evaluates LLMs professionally at Outlier AI

SKILLS & TECH STACK:
- Languages: Python (Intermediate+), SQL, C, HTML
- AI/ML: PyTorch, Hugging Face Transformers, LangChain, LoRA fine-tuning, RAG, OpenAI/Claude/Gemini APIs
- Voice AI: Deepgram, Sarvam, Cartesia (STT); ElevenLabs, Sarvam, Cartesia (TTS); WebRTC, Silero-VAD
- Backend: FastAPI, Supabase, PostgreSQL, MongoDB
- Vector DBs: Qdrant, FAISS
- DevOps: Docker, Kubernetes, MLflow, Git
- Data: Pandas, NumPy, Scikit-learn

PROJECTS:
1. Voxa — production AI omnichannel platform @ KreoHealth
2. NLP Email Categorization — 60K+ Gmail emails, all-MiniLM-L6-v2 + Gemma + Qwen embeddings, Bisecting K-Means, MLP classifier with 96% accuracy, Dockerized with MLflow
3. Amazon ML Challenge 2025 — LAION CLIP + Gemma embeddings, NN + XGBoost ensemble, SMAPE 54.6, Top 2500/7000+ teams
4. Cognivo — dementia companion app using computer vision + Gemini API (coming soon on GitHub)
5. Transformer from Scratch — full encoder-decoder in PyTorch
6. Multi-task NLP Detection — emotion + hate speech + violence detection
7. JMI University Chatbot — LoRA fine-tuned Qwen on university data (in progress)
8. AI-Powered Quiz for Rural Learners — IBM certified project
9. RoastBot — fun chatbot project

ACHIEVEMENTS & CERTIFICATIONS:
- IBM AI Agent Architect Certificate (IBM SkillBuild × CSRBOX, 2025)
- HackerRank SQL 5-Star Badge (Basic, Intermediate, Advanced)
- Amazon ML Challenge 2025 — Top 2500/7000+ teams
- Ranked 2nd in BSc Applied Mathematics class
- Ranked 1st after Year 1 of MSc (SGPA 9.41)
- Cisco Python Essentials 1 & 2
- 7+ hackathons participated (IIT, IIIT, Solana, MongoDB, Dataverse, Neural.net, Face The Future, AI Genesis, IOA — all 2025)

PERSONAL:
- Plays chess ♟️ and football ⚽
- Loves cooking 👨‍🍳 (says he's a "very good cook")
- Enjoys exploring new places and cultures

CONTACT:
- Email: amirhamzakhan2001@gmail.com
- LinkedIn: linkedin.com/in/amirhamzakhan032001
- GitHub: github.com/amirhamzakhan2001
- Actively looking for full-time AI/ML Engineering roles`

// ─── Main exported function ──────────────────────────────────────────────────

/**
 * Send a chat message and get a response.
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages - conversation history
 * @returns {Promise<{reply: string, provider: string, source: 'api'|'direct'|'fallback'}>}
 */
export async function sendChatMessage(messages) {
  // 1. Try /api/chat serverless function (works on Vercel + vercel dev)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })

    // 404 means we're on plain npm run dev (no serverless runtime)
    if (res.status === 404) throw new Error('no-api')

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `API ${res.status}`)
    }

    const data = await res.json()
    return { ...data, source: 'api' }
  } catch (err) {
    if (err.message !== 'no-api') {
      // Real API error — log but try direct fallback anyway
      console.warn('[aiService] /api/chat failed:', err.message)
    }
  }

  // 2. Direct browser call fallback (local npm run dev with VITE_ keys)
  const directProvider = detectDirectProvider()
  if (directProvider) {
    try {
      let result
      if (directProvider === 'openai') result = await directOpenAI(messages, BROWSER_SYSTEM_PROMPT)
      if (directProvider === 'gemini') result = await directGemini(messages, BROWSER_SYSTEM_PROMPT)
      if (result) return { ...result, source: 'direct' }
    } catch (err) {
      console.warn('[aiService] Direct API call failed:', err.message)
    }
  }

  // 3. Rule-based fallback (always works, no API needed)
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || ''
  const reply = findResponse(lastUserMessage)
  return { reply, provider: 'rule-based', source: 'fallback' }
}
