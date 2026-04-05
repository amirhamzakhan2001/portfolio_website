// Smart rule-based chatbot data for "Ask Amir.AI"
// Upgrade to real API by setting VITE_OPENAI_KEY or VITE_CLAUDE_KEY in .env

export const botPersonality = {
  name: 'Amir.AI',
  avatar: 'AHK',
  greeting: "Salam! I'm Amir.AI — I know everything about Amir Hamza Khan. Ask me about his work, skills, projects, or anything professional. What would you like to know?",
  offTopic: [
    "I can only answer questions about Amir Hamza Khan. Try asking about his projects, skills, or experience!",
    "That's outside what I know. Ask me about Amir's work in AI/ML, his projects, or how to contact him.",
    "Interesting question, but I'm specialized in Amir's professional profile. What would you like to know about him?",
  ],
  urduEasterEgg: "خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے، خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے — Allama Iqbal. Amir lives by this: rise so high that God himself asks what you desire.",
  thinking: ['Thinking...', 'Let me check...', 'Processing...', 'One moment...'],
}

export const qaDatabase = [
  // Identity — all name variations
  {
    patterns: [
      'who is amir', 'who are you', 'tell me about amir', 'introduce', 'about amir',
      'who is hamza', 'tell me about hamza', 'about hamza',
      'who is khan', 'tell me about khan',
      'who is amir hamza', 'about amir hamza',
      'who is hamza khan', 'about hamza khan',
      'who is amir hamza khan', 'about amir hamza khan',
      'amir hamza khan', 'amir hamza', 'hamza khan',
    ],
    answer: "Amir Hamza Khan is an AI/ML Engineer currently building Voxa — a production AI omnichannel platform at KreoHealth, Noida. He's completing his MSc in AI/ML from Jamia Millia Islamia (CGPA: 9.38) and holds a BSc in Applied Mathematics (9.53 CGPA, Ranked 2nd). He specializes in voice AI, RAG pipelines, LLM applications, and NLP systems.",
  },
  {
    patterns: ['where is amir', 'location', 'city', 'where does he live'],
    answer: "Amir is based in New Delhi, India. He's currently working on-site at KreoHealth in Noida.",
  },
  {
    patterns: ['education', 'degree', 'university', 'college', 'jmi', 'jamia', 'cgpa', 'marks'],
    answer: "Amir holds an MSc in Artificial Intelligence & Machine Learning from Jamia Millia Islamia, Central University, New Delhi — currently in Semester 4 with a CGPA of 9.38. Before that, he completed a BSc (Hons) in Applied Mathematics from the same university, graduating with 9.53 CGPA and Ranked 2nd in his class.",
  },
  // Work
  {
    patterns: ['work', 'job', 'internship', 'experience', 'kreoh', 'kreohealth'],
    answer: "Amir is currently an AI Intern at KreoHealth (Noida, Feb 2026–Present) where he's building Voxa — a production AI omnichannel SaaS. He's also an AI Evaluation Researcher at Outlier AI (Oct 2025–Present, remote) evaluating LLM outputs for hallucination, reasoning quality, and safety. He's also a Student Placement Coordinator at JMI's CS department.",
  },
  {
    patterns: ['voxa', 'voice agent', 'ai platform', 'kreoh project'],
    answer: "Voxa is an AI-powered omnichannel communication platform Amir built at KreoHealth. It features: intelligent voice agents using STT→LLM→TTS pipeline (5 LLM providers, 9 telephony integrations), a RAG-powered knowledge base on Qdrant, multi-channel campaigns (calls, SMS, email, WhatsApp), 3 CRM integrations (HubSpot, Salesforce, Zoho), and multi-tenant customization. The hardest problem he solved was barge-in detection using WebRTC + Silero-VAD.",
  },
  {
    patterns: ['outlier', 'llm evaluation', 'model evaluation'],
    answer: "At Outlier AI, Amir evaluates LLM outputs across coding, reasoning, and math tasks. He's done 80–90+ evaluations and noticed LLMs particularly struggle with multi-step math and losing context in complex coding tasks. He assesses hallucination, faithfulness, instruction-following, and safety compliance.",
  },
  // Projects
  {
    patterns: ['project', 'built', 'what has amir made', 'portfolio', 'work samples'],
    answer: "Amir's key projects: 1) Voxa (production AI platform @ KreoHealth), 2) NLP Email Categorization (60K+ emails, 96% accuracy), 3) Amazon ML Challenge 2025 (Top 2500/7000+ teams), 4) AI-Powered Quiz for Rural Learners (IBM certified), 5) Transformer from Scratch (full encoder-decoder), 6) Multi-task NLP Detection (emotion + hate speech + violence), 7) Cognivo (dementia companion app — coming soon), 8) JMI University Chatbot (LoRA fine-tuned Qwen — in progress). Want details on any specific one?",
  },
  {
    patterns: ['email', 'nlp email', 'categorization', 'gmail'],
    answer: "The NLP Email Categorization System is Amir's MSc minor project — an end-to-end pipeline that processes 60K+ Gmail emails. It uses all-MiniLM-L6-v2 + Gemma + Qwen embeddings, Bisecting K-Means clustering, LLM-based label generation (no manual labeling), and a trained MLP classifier with 96% accuracy for real-time inference. Dockerized with MLflow for incremental updates. Available on GitHub!",
  },
  {
    patterns: ['amazon', 'ml challenge', 'hackathon', 'competition'],
    answer: "Amir participated in the Amazon ML Challenge 2025 with a team of 4 (Amir, Amir Pasha, Mohd Ahamad, Syed Taiyabullah). They built a multi-modal price prediction pipeline using LAION CLIP + Gemma embeddings, neural networks + XGBoost in a meta-model ensemble. Result: SMAPE of 54.6, ranked Top 2500 out of 7000+ teams.",
  },
  {
    patterns: ['cognivo', 'dementia', 'healthcare'],
    answer: "Cognivo is Amir's healthcare AI app designed for dementia patients — it uses computer vision and AI to help patients remember people's names, relationships, and important locations. It includes a family alert and location sharing system. Built with Gemini API. Going public on GitHub soon!",
  },
  {
    patterns: ['transformer', 'from scratch', 'attention'],
    answer: "Amir implemented a full encoder-decoder Transformer architecture from scratch in PyTorch — covering multi-head self-attention, positional encoding, feed-forward layers, masking, and the complete forward pass. This project shows his understanding of how LLMs work under the hood.",
  },
  {
    patterns: ['jmi chatbot', 'university chatbot', 'qwen', 'lora'],
    answer: "Amir and two classmates are building an AI chatbot and query management system for Jamia Millia Islamia. What makes it special: they fine-tuned Qwen using LoRA on JMI department-specific data, so it actually knows the university's curriculum, faculty, and processes. This is Amir's first model fine-tuning deployed for a real use case.",
  },
  // Skills
  {
    patterns: ['skill', 'technology', 'stack', 'know', 'technical'],
    answer: "Amir's core stack: Python, FastAPI, LangChain, PyTorch, Hugging Face Transformers, Qdrant, Supabase, Docker, Kubernetes. For AI: OpenAI/Claude/Gemini APIs, RAG, voice AI (Deepgram, ElevenLabs, Sarvam), LoRA fine-tuning. For data: Pandas, NumPy, PostgreSQL, MongoDB, FAISS. MLOps: MLflow, Docker, Git. He's also familiar with SQL, HTML, and C.",
  },
  {
    patterns: ['python', 'how good python', 'python level'],
    answer: "Amir rates himself Intermediate+ in Python. He uses it daily for production code at KreoHealth — building FastAPI backends, LangChain pipelines, data processing scripts, and ML training loops. His Python work spans async programming, OOP design patterns, and API integrations.",
  },
  {
    patterns: ['llm', 'large language model', 'gpt', 'claude', 'gemini'],
    answer: "Amir works with GPT-4, Claude (Anthropic), Google Gemini, DeepSeek, and AWS Bedrock in production at KreoHealth. He also fine-tuned Qwen using LoRA, and fine-tuned BERT, GPT-2, CLIP, and Gemma for various tasks. He evaluates LLMs professionally at Outlier AI.",
  },
  {
    patterns: ['rag', 'retrieval', 'vector', 'qdrant', 'faiss'],
    answer: "RAG (Retrieval-Augmented Generation) is central to Amir's work. He built production RAG systems at KreoHealth using Qdrant for vector storage. His NLP Email project used FAISS. He can implement the full pipeline: document chunking, embedding generation, similarity search, context augmentation, and LLM generation.",
  },
  {
    patterns: ['voice', 'speech', 'tts', 'stt', 'deepgram', 'elevenlabs'],
    answer: "Voice AI is Amir's specialty at KreoHealth. He worked with Deepgram, Sarvam, Cartesia (STT), and ElevenLabs, Sarvam, Cartesia (TTS) in production. He solved the hardest voice AI problem — barge-in detection — using WebRTC + Silero-VAD for real-time noise handling and mid-speech interruption.",
  },
  // Achievements
  {
    patterns: ['achievement', 'rank', 'award', 'certification', 'certificate'],
    answer: "Amir's achievements: 🏅 IBM AI Agent Architect Certificate (IBM SkillBuild × CSRBOX, 2025) | ⭐ HackerRank SQL 5-Star Badge (all levels: Basic, Intermediate, Advanced) | 🏆 Amazon ML Challenge 2025 — Top 2500/7000+ teams | 🥈 Ranked 2nd in Class — BSc Applied Mathematics | 🥇 Ranked 1st after Year 1 of MSc (SGPA 9.41) | Cisco Python Essentials 1 & 2",
  },
  {
    patterns: ['hackerrank', 'sql', 'sql badge'],
    answer: "Amir completed all SQL challenges on HackerRank — Basic, Intermediate, and Advanced levels — earning the 5-Star badge.",
  },
  // Personal
  {
    patterns: ['hobby', 'interest', 'outside work', 'personal', 'fun', 'play'],
    answer: "Outside of AI/ML, Amir plays chess ♟️ and football ⚽, loves cooking 👨‍🍳 (especially for friends and family), and enjoys exploring new places and cultures 🌍. He says he's a 'very good cook' — which apparently surprises people who know him only from GitHub!",
  },
  {
    patterns: ['chess', 'football', 'sport', 'game'],
    answer: "Amir plays both chess and football. Chess keeps his strategic thinking sharp — which probably explains his approach to complex ML system architecture. Football for the team coordination skills!",
  },
  {
    patterns: ['urdu', 'shayari', 'poetry', 'iqbal'],
    answer: botPersonality.urduEasterEgg,
  },
  // Contact
  {
    patterns: ['contact', 'email', 'reach', 'hire', 'available', 'job', 'opportunity'],
    answer: "You can reach Amir at: 📧 amirhamzakhan2001@gmail.com | 🔗 LinkedIn: linkedin.com/in/amirhamzakhan032001 | 🐙 GitHub: github.com/amirhamzakhan2001 | He's actively looking for full-time AI/ML Engineering roles and is open to interesting projects!",
  },
  {
    patterns: ['resume', 'cv', 'download'],
    answer: "You can download Amir's latest resume using the 'Download Resume' button in the top navbar. It covers all his experience at KreoHealth and Outlier AI, projects, education, and certifications.",
  },
  // GitHub
  {
    patterns: ['github', 'code', 'repository', 'open source'],
    answer: "Amir's GitHub is github.com/amirhamzakhan2001 — public projects include nlp-email-categorization, amazon_challange_2k25, AI-Powered-Quiz, Transformer_scratch, and nlp_emotion_detection. More projects (Cognivo, Roast Chatbot) are being made public soon.",
  },
]

// Name variants that all refer to Amir Hamza Khan
const NAME_VARIANTS = ['amir hamza khan', 'amir hamza', 'hamza khan', 'amir', 'hamza', 'khan']

// Find best matching response
export function findResponse(input) {
  const lower = input.toLowerCase().trim()

  // Normalize: replace any name variant with 'amir' so patterns always match
  let normalized = lower
  for (const name of NAME_VARIANTS) {
    normalized = normalized.split(name).join('amir')
  }

  // Check all patterns against both original and normalized input
  let bestMatch = null
  let bestScore = 0

  for (const qa of qaDatabase) {
    for (const pattern of qa.patterns) {
      const words = pattern.split(' ')
      let score = 0
      for (const word of words) {
        if (normalized.includes(word) || lower.includes(word)) score++
      }
      const normalizedScore = score / words.length
      if (normalizedScore > bestScore && score > 0) {
        bestScore = normalizedScore
        bestMatch = qa
      }
    }
  }

  // Threshold: at least 30% pattern match
  if (bestMatch && bestScore >= 0.3) {
    return bestMatch.answer
  }

  // Off-topic fallback
  const fallbacks = botPersonality.offTopic
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}
