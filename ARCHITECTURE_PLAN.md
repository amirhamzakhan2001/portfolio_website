# The Neural Portfolio — Master Architecture Plan
## Amir Hamza Khan | AI/ML Engineer Portfolio v3.0

---

## CORE CONCEPT
The portfolio IS a neural network. Visitor = data being processed.
Sections = neurons arranged in real layers. Navigation = signal propagation.

```
INPUT LAYER         HIDDEN L1         HIDDEN L2         OUTPUT
  ○ Hero         ─→  ○ Skills      ─→  ○ Demos       ─→  ○ Contact
  ○ About        ─→  ○ Projects    ─→  ○ Experience
                                   ─→  ○ Achievements
```

---

## PHASE 1 — Background + Navigation (Core Architecture)

### 1A. Layered Neural Background (NeuralNetBg.jsx)
- Nodes in 4 fixed columns (input / hidden1 / hidden2 / output)
- Section-aware: active section's column glows 3x brighter, more signals
- Signals travel left→right on scroll down, right→left on scroll up
- Floating math equations: ∇L, σ(x), W·x+b, softmax, attention
- Background accent color smoothly shifts per section:
  - Hero/About → indigo (#6366F1)
  - Skills/Projects → violet (#8B5CF6)
  - Demos/Experience → purple (#A855F7)
  - Achievements/Contact → cyan (#06B6D4)

### 1B. Neural Architecture Map (right sidebar, replaces AgentNavigator)
- Actual mini neural network diagram showing all 8 sections as neurons
- Laid out in the INPUT/HIDDEN/OUTPUT column structure
- Active neuron glows with pulsing ring
- Signal animation travels through the diagram when navigating
- Click any neuron → signal propagates → smooth scroll to section
- Edge labels show section name (like annotated architecture diagrams)

### 1C. Synapse Section Transitions (replace plain dividers)
- Between sections: two facing "synaptic terminals"
- When section enters viewport: spark fires across the gap (400ms)
- Reinforces the "signal crossing a synapse" metaphor
- Unique visual — no portfolio does this

### 1D. Loading Screen Upgrade — "Model Initialization"
```
Initializing Amir.v2...
  Loading weights ........... [████████████] 100%
  Calibrating skills ......... [████████████] 100%
  Warming up inference ....... [████████░░░░]  85%

  Model ready. p(hire) = 0.97
```

---

## PHASE 2 — Unique Features (Nobody Else Has These)

### 2A. Training Log — Career as ML Experiment (Experience section upgrade)
- Career = actual ML training run
- epoch=1 (2019): BSc starts | loss=2.40 | acc=0.12
- epoch=2 (2021): First ML project | loss=1.60 | acc=0.38
- epoch=3 (2023): MSc + IBM cert | loss=0.34 | acc=0.78
- epoch=4 (2024): KreoHealth/Voxa | loss=0.08 | acc=0.94 ← current
- Animated loss/accuracy curves drawn on canvas as section scrolls into view
- Code display: model.fit(amir, optimizer='curiosity', callbacks=[KreoHealth])

### 2B. p(hire) Calculator — Hero Section Widget
- Small widget below CTA: "p(hire | your_role) = ?"
- Dropdown: ML Engineer / Backend / Recruiter / Startup Founder / Research Lab
- Value animates (0.82 → 0.94 → 0.76) with a confidence bar + brief reasoning
- Humorous but technically framed. Shows personality.

### 2C. Voxa System Architecture Diagram (Projects — Voxa card)
- Click Voxa → opens interactive system architecture diagram instead of plain text
- Animated data packets flow: Phone → Twilio → Deepgram → LangGraph → Qdrant → Claude → ElevenLabs
- Each component clickable for details
- Shows deep system-level thinking, not just "I built X"

### 2D. Embedding Space — Skills as Vectors (Skills section upgrade)
- All skills plotted in 2D t-SNE-style space
- Clusters: [NLP group], [MLOps group], [GenAI group], [Data group]
- Hover skill → nearest-neighbor skills glow
- Click a project → its skills orbit toward it and cluster
- Toggle between: Grid view (current) / Embedding view (new)

### 2E. Live Terminal Section (new section between Demos and Experience)
```bash
visitor@portfolio:~$ import amir
✓ Module loaded

visitor@portfolio:~$ amir.skills()
→ ['PyTorch', 'LangChain', 'Claude', 'Qdrant', 'FastAPI', ...]

visitor@portfolio:~$ amir.projects.voxa.status()
→ { status: 'live', uptime: '99.8%', users: 'KreoHealth patients' }

visitor@portfolio:~$ amir.hire(role='ML Engineer')
→ Excellent choice. Redirecting to contact...
```
- User can type real commands (scripted intelligent responses)
- Easter egg commands hidden (try: `amir.urdu()`, `amir.roast()`, `amir.turing_test()`)

### 2F. Turing Test Mini-Game (inside Demos section)
- 5 questions shown to user
- Each has 2 responses: one from Amir, one from his AI
- User guesses which is which
- End: "Score: 3/5 — Amir and his AI are indistinguishable. That's the point."
- Shows: personality + AI capability simultaneously

### 2G. Context Window Tracker (persistent HUD widget)
- Small corner widget: `⬡ Context: 1,240 / 4,096 tokens`
- Increments as user scrolls through sections
- When full (all sections viewed): "Context overflow → ask the AI"
- Subtle, nerdy, loved by ML engineers who interview you

### 2H. Neural Pathway Cursor Trail
- Cursor leaves branching axon/dendrite-like trails
- Thin forking lines that fade over 0.8s
- Much more unique than particle trails
- Color follows section accent

---

## PHASE 3 — Polish & Advanced Animations

### 3A. Magnetic Buttons
- CTA buttons attract cursor within 80px radius
- Button surface moves toward cursor (translateX/Y)
- Label: "within attention radius" as tooltip easter egg

### 3B. Text Scramble on Headings
- Section headings scramble (random chars) then resolve to correct text
- Matrix-style, triggered on scroll into view
- 400ms total

### 3C. Holographic Shimmer on Project Cards
- Iridescent sheen that shifts with mouse angle (CSS hue-rotate + gradient overlay)
- Makes cards look like holographic trading cards
- Nobody does this on portfolio project cards

### 3D. "Model Card" Resume Download
- Download button opens/downloads styled as HuggingFace model card
- Shows: Architecture, Training Data, Benchmarks, Intended Use, Limitations
- Completely unique framing of a CV

---

## PHASE 4 — New Skills & Content

### New Skills to Add:
Languages/Frameworks:
- asyncio / Async Python (production at KreoHealth)
- Pydantic (data validation, used everywhere)

AI/ML:
- Deepgram (STT, production)
- ElevenLabs (TTS, production)
- CrewAI (multi-agent, trending 2024-25)
- Ollama (local LLMs)
- Weights & Biases (MLOps tracking)

Data:
- Redis (caching)
- spaCy (NLP)

---

## SECRET EASTER EGGS

| Trigger | Effect |
|---------|--------|
| Type `voxa` anywhere | Chatbot opens and says "Voxa is listening" |
| Konami code ↑↑↓↓←→←→BA | Matrix rain effect with Urdu script |
| Click profile photo 3x | Debug mode: FPS counter, render stats |
| Type `iqbal` | Full-screen Urdu poetry animation |
| Terminal: `amir.roast()` | AI roasts visitor's tech stack |

---

## TECH STACK ADDITIONS NEEDED

| Library | Purpose |
|---------|---------|
| @react-three/fiber | 3D neural net (optional for Phase 1, needed for Phase 2 embedding space) |
| @react-three/drei | Three.js helpers |
| d3-force | Force-directed skill graph |
| gsap | Advanced timeline animations (text scramble, synapse) |

---

## IMPLEMENTATION ORDER

1. ✅ Fix black screen (done — NeuralNetBg TDZ bug)
2. ✅ Revert Skills to grid (done)
3. [ ] Phase 1A — Layered structured neural background
4. [ ] Phase 1B — Neural Architecture Map sidebar
5. [ ] Phase 1C — Synapse section transitions  
6. [ ] Phase 1D — Loading screen upgrade
7. [ ] Phase 2A — Training Log career view
8. [ ] Phase 2B — p(hire) calculator
9. [ ] Phase 2C — Voxa system diagram
10. [ ] Phase 2D — Embedding Space skills view
11. [ ] Phase 2E — Live Terminal section
12. [ ] Phase 2F — Turing Test game
13. [ ] Phase 2G — Context Window tracker
14. [ ] Phase 2H — Neural pathway cursor
15. [ ] Phase 3A-D — Polish pass
16. [ ] Phase 4 — New skills + Model Card
