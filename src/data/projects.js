/**
 * ═══════════════════════════════════════════════════════════════════════
 *  PROJECTS — the only file you edit to add or change a project.
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  TWO LISTS:
 *    PROJECTS    — featured work, shown as full cards with Problem/Approach/Result
 *    FOUNDATIONS — earlier work, shown compactly as the progression strip
 *
 *  TO ADD A FEATURED PROJECT: copy this into the PROJECTS array.
 *  Order in the array = order on the page.
 *
 *  {
 *    id: 'unique-id', name: 'repo-style-name', title: 'Human title',
 *    kind: 'Product',            // Product | Applied | Research | Competition
 *    org: 'Where you built it', year: '2026',
 *    status: 'shipped',          // 'shipped' | 'wip'
 *    metric: 'The one headline result',
 *    stack: ['Python', 'FastAPI'],          // first 3 show in the table
 *    problem: '…', approach: '…', result: '…',
 *    links: [
 *      { label: 'Live site',     url: 'https://…' },   // first = solid button
 *      { label: 'Watch demo',    url: 'https://…' },
 *      { label: 'LinkedIn post', url: 'https://…' },
 *      { label: 'Source',        url: 'https://…' },
 *    ],
 *  }
 *
 *  ⚠ ONLY LINK PUBLIC REPOS. Models_list, Cognivo and roast_cum_chatbot are
 *  currently PRIVATE on GitHub — a visitor clicking them gets a 404, which
 *  reads worse than no link at all. Their live sites are linked instead.
 *  Make those repos public and I'll add the source links.
 * ═══════════════════════════════════════════════════════════════════════
 */

export const PROJECTS = [
  {
    id: 'voxa',
    name: 'voxa',
    title: 'Voice agent platform',
    kind: 'Product',
    org: 'Eyas Ventures',
    year: '2026',
    status: 'shipped',
    metric: '~1000ms end-to-end',
    stack: ['Python', 'FastAPI', 'LangChain', 'ElevenLabs', 'Cartesia', 'AssemblyAI', 'Qdrant'],
    problem:
      'Businesses want a voice agent that sounds like them, answers from their own documents, and can be reconfigured without an engineer — but every tenant needs a different speech stack, prompt and knowledge base.',
    approach:
      'Architected a multi-tenant voice agent with configurable STT, LLM and TTS pipelines per tenant, including voice cloning through ElevenLabs, Cartesia and AssemblyAI. Built the agent creation workflow — dynamic prompt generation, a RAG knowledge base for company-specific answers, calendar integration, and credit-based usage and billing.',
    result:
      '~1000ms end-to-end response latency. Integrated 5+ external voice platforms (Ringg, Retell, Vapi) over REST, 4-channel outbound campaigns across call, SMS, email and WhatsApp, plus automated recordings, transcripts and real-time analytics dashboards. Live in production.',
    links: [
      { label: 'Live product', url: 'https://prometrix.ai/voxa/' },
      // { label: 'Watch demo', url: 'PASTE LINKEDIN VIDEO POST URL' },
    ],
  },
  {
    id: 'modelspine',
    name: 'modelspine',
    title: 'ModelSpine — AI model discovery platform',
    kind: 'Product',
    org: 'Independent',
    year: '2026',
    status: 'shipped',
    metric: '13,517 models · 139,987 papers',
    stack: ['Python', 'Hugging Face API', 'arXiv', 'OpenAlex', 'Vercel'],
    problem:
      'Choosing an open AI model means wading through leaderboards, acronyms and benchmark tables that assume you already know what you are looking for — and nothing tells you whether a model will actually run on your hardware.',
    approach:
      'Built a daily-refreshed index that harvests models and papers from Hugging Face, arXiv and OpenAlex, then organises them by what they *do* rather than by architecture — 13 functional categories from speech-to-text to reranking. Added a memory calculator that computes runtime requirements directly from each model’s config.',
    result:
      '13,517 models and 139,987 papers indexed and updated daily. Built on three rules: data is harvested not hand-curated, metrics are quoted not estimated, and requirements are computed not guessed.',
    links: [{ label: 'Live site', url: 'https://modelspine.vercel.app/' }],
  },
  {
    id: 'cognivo',
    name: 'cognivo',
    title: 'Cognivo — dementia care companion',
    kind: 'Applied',
    org: 'Independent',
    year: '2026',
    status: 'shipped',
    metric: 'On-device face recognition',
    stack: ['React Native', 'Android', 'FastAPI', 'Computer Vision', 'Voice cloning'],
    problem:
      'People living with dementia lose the link between a face and who that person is to them — and their families lose any visibility into whether they are safe, medicated and eating.',
    approach:
      'Designed and built a cross-platform care app and caregiver web platform solo: face recognition that names familiar visitors and recalls the last visit, medication verification against the prescription list, geofenced safe-zone monitoring with automatic alerts, a companion voice for conversation, SOS, and role-based access so family and helpers see different things.',
    result:
      'Shipped and live. Faces never leave the phone — recognition runs on-device and encrypted, on the principle that “their memories are not our product.” Includes a daily care summary covering visits, medication adherence and wellbeing.',
    links: [{ label: 'Live site', url: 'https://cognivo-care.vercel.app/' }],
  },
  {
    id: 'workflow',
    name: 'workflow-automation',
    title: 'No-code workflow builder & CRM integration',
    kind: 'Product',
    org: 'Eyas Ventures',
    year: '2026',
    status: 'shipped',
    metric: '10+ apps integrated',
    stack: ['Python', 'FastAPI', 'Webhooks', 'OpenAI', 'Claude'],
    problem:
      'Non-technical teams need cross-platform automation but cannot write the glue code, and every business wants a different chain of steps.',
    approach:
      'Co-developed a no-code automation builder in a two-person team, then owned and extended it independently — conditional logic, scheduled and event-based triggers, webhooks, and multi-step automation chains.',
    result:
      'Integrated 10+ third-party applications and CRMs including Gmail, Google Calendar, Google Sheets, WhatsApp, Telegram, OpenAI and Claude, letting businesses automate across platforms without writing code.',
    links: [{ label: 'Live product', url: 'https://prometrix.ai/voxa/' }],
  },
  {
    id: 'widget',
    name: 'embeddable-widget',
    title: 'Embeddable website widget',
    kind: 'Product',
    org: 'Eyas Ventures',
    year: '2026',
    status: 'shipped',
    metric: 'One-line install',
    stack: ['JavaScript', 'FastAPI', 'RAG'],
    problem:
      'Adding AI support to an existing site normally means a front-end project and a developer on hand to maintain it.',
    approach:
      'Built a lightweight script-tag widget that drops AI-powered text and voice query support onto any site in one line, backed by the platform’s RAG knowledge base, plus an admin configuration layer for branding, appearance and behaviour.',
    result: 'Non-technical users can install and fully customise the widget without touching code.',
    links: [{ label: 'Live product', url: 'https://prometrix.ai/voxa/' }],
  },
  {
    id: 'jmi',
    name: 'jmi-university-chatbot',
    title: 'University AI chatbot & query management',
    kind: 'Applied',
    org: 'Jamia Millia Islamia',
    year: '2026',
    status: 'shipped',
    metric: '50+ departments',
    stack: ['Qwen', 'RAG', 'Python', 'FastAPI'],
    problem:
      'A university-wide query system has to answer students, faculty and prospective students across more than fifty departments, where a generic model answers confidently and wrongly.',
    approach:
      'Built the AI chatbot layer on a RAG architecture powered by Qwen LLMs, with backend services and chatbot orchestration in Python and FastAPI, plus a multi-level role-based admin portal for notices, circulars, documents and knowledge sources.',
    result:
      '~1500ms response latency, serving students, faculty and prospective students across 50+ departments.',
    links: [],
  },
  {
    id: 'email',
    name: 'email-categorisation',
    title: 'NLP email categorisation system',
    kind: 'Research',
    org: 'M.Sc. project',
    year: '2025',
    status: 'shipped',
    metric: '80–90% less manual sorting',
    stack: ['PyTorch', 'Transformers', 'PCA', 'Bisecting K-Means', 'MLP'],
    problem:
      '60,000+ Gmail messages, unstructured and continuously arriving, with no labelled training set to learn from.',
    approach:
      'An end-to-end pipeline using transformer-based embeddings with PCA for feature compression, then 4-level hierarchical clustering (bisecting k-means) to organise the corpus into 14 LLM-labelled clusters, and MLP classifiers trained for real-time categorisation of new mail.',
    result:
      'Cut manual sorting effort by an estimated 80–90%, with no manually labelled examples anywhere in the pipeline.',
    links: [
      { label: 'Source', url: 'https://github.com/amirhamzakhan2001/nlp-email-categorization' },
    ],
  },
  {
    id: 'amazon',
    name: 'amazon-ml-challenge',
    title: 'Amazon ML Challenge 2025',
    kind: 'Competition',
    org: 'Amazon',
    year: '2025',
    status: 'shipped',
    metric: 'Top 25% · SMAPE 54.6',
    stack: ['PyTorch', 'OpenCLIP', 'Sentence Transformers'],
    problem: 'Predict product price from images and copy together rather than either alone.',
    approach:
      'A multi-modal price prediction pipeline — OpenCLIP for the visual representation, sentence transformers for the text, fused for the regression head.',
    result: 'SMAPE 54.6, ranked in the top 25% of entrants.',
    links: [{ label: 'Source', url: 'https://github.com/amirhamzakhan2001/amazon_challange_2k25' }],
  },
]

/**
 * FOUNDATIONS — how the capability was actually built, in order.
 * This is the Excel → SQL → BI → ML → NLP → GenAI → production arc.
 * `step` groups them on the progression strip.
 */
export const FOUNDATIONS = [
  {
    step: 'Generative AI',
    year: '2025',
    title: 'Roast × friendly chatbot',
    note: 'Dual-personality bot on the Gemini API',
    links: [{ label: 'Live site', url: 'https://roastmasterbot.vercel.app/' }],
  },
  {
    step: 'Generative AI',
    year: '2025',
    title: 'AI quiz for rural learners',
    note: 'IBM SkillsBuild · multilingual, auto-graded',
    links: [
      { label: 'Live site', url: 'https://ai-powered-quiz-afq1.onrender.com' },
      { label: 'Source', url: 'https://github.com/amirhamzakhan2001/AI-Powered-Quiz' },
    ],
  },
  {
    step: 'NLP',
    year: '2025',
    title: 'Multi-task text classification',
    note: 'Emotion, hate speech and violence from one shared encoder',
    links: [{ label: 'Source', url: 'https://github.com/amirhamzakhan2001/nlp_emotion_detection' }],
  },
  {
    step: 'Machine learning',
    year: '2025',
    title: 'Transformer from scratch',
    note: 'Full encoder–decoder in plain PyTorch',
    links: [{ label: 'Source', url: 'https://github.com/amirhamzakhan2001/Transformer_scratch' }],
  },
  {
    step: 'Machine learning',
    year: '2025',
    title: 'Machine learning notebooks',
    note: 'Core algorithms worked end to end',
    links: [{ label: 'Source', url: 'https://github.com/amirhamzakhan2001/Machine_Learning' }],
  },
  {
    step: 'Analytics',
    year: '2025',
    title: 'Tableau dashboards',
    note: 'Visual analytics and storytelling',
    links: [{ label: 'Source', url: 'https://github.com/amirhamzakhan2001/Tableau_Dashboard' }],
  },
  {
    step: 'Analytics',
    year: '2025',
    title: 'Power BI dashboards',
    note: 'Interactive business reporting',
    links: [{ label: 'Source', url: 'https://github.com/amirhamzakhan2001/PowerBI_dashboards' }],
  },
  {
    step: 'Analytics',
    year: '2024',
    title: 'SQL analysis',
    note: 'Airline data with Python; Netflix on PostgreSQL',
    links: [
      { label: 'Airline SQL', url: 'https://github.com/amirhamzakhan2001/Airline-SQL-Python-Project' },
      { label: 'Netflix SQL', url: 'https://github.com/amirhamzakhan2001/Netflix-SQL-Analysis-Using-PostgreSQL' },
    ],
  },
  {
    step: 'Analytics',
    year: '2024',
    title: 'Excel dashboards',
    note: 'Sales, coffee and e-commerce analysis',
    links: [
      { label: 'Adventure Works', url: 'https://github.com/amirhamzakhan2001/Adventure-Works-Sales-Dashboard' },
      { label: 'Coffee Sales', url: 'https://github.com/amirhamzakhan2001/Coffee-Sales-Analysis' },
      { label: 'E-commerce', url: 'https://github.com/amirhamzakhan2001/Ecommerce_Sales_Analysis' },
    ],
  },
]

/** The arc, in order, for the progression strip. */
export const PROGRESSION = [
  { step: 'Analytics', label: 'Excel · SQL · BI', color: '#2A5BD7' },
  { step: 'Machine learning', label: 'ML · deep learning', color: '#0E9384' },
  { step: 'NLP', label: 'Language models', color: '#B54708' },
  { step: 'Generative AI', label: 'LLM apps · agents', color: '#7839EE' },
  { step: 'Production', label: 'Shipped products', color: '#BA2D5B' },
]

export const PROJECT_COUNT = PROJECTS.length + FOUNDATIONS.length
export const FEATURED_COUNT = PROJECTS.length
export const SHIPPED_COUNT = PROJECTS.filter((p) => p.status === 'shipped').length
export const WIP_COUNT = PROJECTS.filter((p) => p.status === 'wip').length
export const PRODUCTION_COUNT = PROJECTS.filter((p) => p.kind === 'Product').length
/** Everything with a working public URL — live sites and public repos. */
export const LIVE_COUNT =
  PROJECTS.filter((p) => p.links.some((l) => /Live/i.test(l.label))).length +
  FOUNDATIONS.filter((f) => f.links.some((l) => /Live/i.test(l.label))).length
