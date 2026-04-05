export const skillCategories = [
  {
    id: 'languages',
    label: 'Languages',
    icon: '⌨️',
    skills: [
      { name: 'Python', level: 4, tag: 'primary', production: true },
      { name: 'SQL', level: 4, tag: 'primary', production: true },
      { name: 'FastAPI', level: 3, tag: 'framework', production: true },
      { name: 'HTML5', level: 2, tag: 'web' },
      { name: 'C', level: 2, tag: 'systems' },
    ],
  },
  {
    id: 'aiml',
    label: 'AI / ML / DL',
    icon: '🤖',
    skills: [
      { name: 'PyTorch', level: 4, tag: 'deep-learning', production: true },
      { name: 'Scikit-learn', level: 4, tag: 'ml' },
      { name: 'TensorFlow / Keras', level: 3, tag: 'deep-learning' },
      { name: 'Hugging Face', level: 4, tag: 'nlp', production: true },
      { name: 'Sentence Transformers', level: 4, tag: 'nlp', production: true },
      { name: 'OpenCLIP', level: 3, tag: 'vision' },
      { name: 'LoRA Fine-tuning', level: 3, tag: 'llm', production: true },
      { name: 'Model Training & Eval', level: 4, tag: 'ml' },
      { name: 'Transfer Learning', level: 4, tag: 'dl' },
      { name: 'Feature Engineering', level: 4, tag: 'ml' },
    ],
  },
  {
    id: 'genai',
    label: 'Gen AI & NLP',
    icon: '🧠',
    skills: [
      { name: 'LangChain', level: 4, tag: 'framework', production: true },
      { name: 'LangGraph', level: 3, tag: 'framework' },
      { name: 'OpenAI API', level: 4, tag: 'llm', production: true },
      { name: 'Anthropic Claude', level: 4, tag: 'llm', production: true },
      { name: 'Google Gemini', level: 3, tag: 'llm', production: true },
      { name: 'RAG Pipelines', level: 4, tag: 'architecture', production: true },
      { name: 'Prompt Engineering', level: 4, tag: 'llm', production: true },
      { name: 'Voice AI (STT/TTS)', level: 4, tag: 'voice', production: true },
      { name: 'Text Embeddings', level: 4, tag: 'nlp', production: true },
      { name: 'Transformers', level: 4, tag: 'architecture' },
    ],
  },
  {
    id: 'data',
    label: 'Data & Databases',
    icon: '📊',
    skills: [
      { name: 'Pandas', level: 4, tag: 'data' },
      { name: 'NumPy', level: 4, tag: 'data' },
      { name: 'Matplotlib / Seaborn', level: 3, tag: 'viz' },
      { name: 'PostgreSQL', level: 3, tag: 'db', production: true },
      { name: 'Supabase', level: 3, tag: 'db', production: true },
      { name: 'MongoDB', level: 3, tag: 'db' },
      { name: 'FAISS', level: 3, tag: 'vector', production: true },
      { name: 'Qdrant', level: 3, tag: 'vector', production: true },
      { name: 'Power BI', level: 2, tag: 'bi' },
      { name: 'Tableau', level: 2, tag: 'bi' },
    ],
  },
  {
    id: 'mlops',
    label: 'MLOps & Cloud',
    icon: '⚙️',
    skills: [
      { name: 'Docker', level: 4, tag: 'devops', production: true },
      { name: 'Kubernetes', level: 2, tag: 'devops', production: true },
      { name: 'MLflow', level: 3, tag: 'mlops' },
      { name: 'Git / GitHub', level: 3, tag: 'vcs' },
      { name: 'AWS', level: 2, tag: 'cloud' },
      { name: 'VS Code', level: 5, tag: 'tool' },
      { name: 'Jupyter Notebook', level: 4, tag: 'tool' },
      { name: 'WebRTC', level: 3, tag: 'realtime', production: true },
      { name: 'Twilio API', level: 3, tag: 'comms', production: true },
    ],
  },
]

// For the "used in production" highlight
export const productionSkills = skillCategories
  .flatMap((cat) => cat.skills)
  .filter((s) => s.production)
  .map((s) => s.name)
