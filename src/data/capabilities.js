/**
 * ═══════════════════════════════════════════════════════════════════════
 *  CAPABILITIES — the only file you edit to change the skills panel.
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  Each item is [name, shipped] where shipped is:
 *    1 = used in completed work that is public or live (renders filled)
 *    0 = working knowledge, not yet in a shipped project (renders outlined)
 *
 *  That marker is the whole point of the panel, so keep it honest — a
 *  filled chip is a claim someone can interview you on.
 *
 *  Five groups, five validated categorical hues (lightness band, chroma
 *  floor, CVD separation, 3:1 contrast on #FCFCFB). A sixth group needs a
 *  tinted step of an existing hue, not a new colour.
 *
 *  DELIBERATELY NOT LISTED (confirm before adding — these get probed hard):
 *    JavaScript · React      — removed at Amir's request, Aug 2026
 *    Kubernetes · AWS · Supabase · WebRTC · Silero-VAD
 * ═══════════════════════════════════════════════════════════════════════
 */

export const CAPABILITY_GROUPS = [
  {
    id: 'lang',
    label: 'Languages, tools & delivery',
    color: '#B54708',
    items: [
      ['Python', 1], ['SQL', 1], ['FastAPI', 1], ['React Native', 1], ['Docker', 1],
      ['Git', 1], ['REST APIs', 1], ['Webhooks', 1], ['Vercel', 1], ['Render', 1],
      ['MLflow', 0],
    ],
  },
  {
    id: 'ml',
    label: 'ML & deep learning',
    color: '#0E9384',
    items: [
      ['PyTorch', 1], ['Hugging Face', 1], ['Scikit-learn', 1], ['TensorFlow / Keras', 1],
      ['Transformers', 1], ['Attention mechanisms', 1], ['OpenCLIP', 1],
      ['Sentence Transformers', 1], ['Computer vision', 1], ['Face recognition', 1],
      ['Multi-modal fusion', 1], ['Clustering (K-Means)', 1], ['Dimensionality reduction', 1],
      ['Model evaluation', 1], ['Feature engineering', 1],
      ['Transfer learning', 0], ['Hyperparameter tuning', 0],
    ],
  },
  {
    id: 'genai',
    label: 'Generative AI & LLMs',
    color: '#BA2D5B',
    items: [
      ['LangChain', 1], ['LangGraph', 1], ['Agentic AI', 1], ['Multi-agent systems', 1],
      ['RAG', 1], ['Knowledge bases', 1], ['Chunking strategies', 1], ['Text embeddings', 1],
      ['Vector search', 1], ['Prompt engineering', 1], ['LoRA fine-tuning', 1],
      ['LLM evaluation', 1], ['Hallucination detection', 1], ['Conversation state', 1],
      ['OpenAI', 1], ['Claude', 1], ['Google Gemini', 1], ['Qwen', 1],
      ['MLOps', 0],
    ],
  },
  {
    id: 'voice',
    label: 'Voice & speech',
    color: '#7839EE',
    items: [
      ['Speech-to-text', 1], ['Text-to-speech', 1], ['Real-time streaming', 1],
      ['Voice agent orchestration', 1], ['Voice cloning', 1], ['Latency optimisation', 1],
      ['Call transcripts & analytics', 1],
      ['Deepgram', 1], ['AssemblyAI', 1], ['ElevenLabs', 1], ['Cartesia', 1], ['Sarvam', 1],
      ['Ringg · Retell · Vapi', 1],
    ],
  },
  {
    id: 'data',
    label: 'Data, analytics & databases',
    color: '#2A5BD7',
    items: [
      ['Pandas', 1], ['NumPy', 1], ['PostgreSQL', 1], ['MongoDB', 1], ['FAISS', 1],
      ['Qdrant', 1], ['Power BI', 1], ['Tableau', 1], ['Excel', 1],
      ['Matplotlib / Seaborn', 0],
    ],
  },
]

export const CAPABILITY_TOTAL = CAPABILITY_GROUPS.reduce((a, g) => a + g.items.length, 0)
export const CAPABILITY_PROD = CAPABILITY_GROUPS.reduce(
  (a, g) => a + g.items.filter(([, p]) => p).length,
  0
)
