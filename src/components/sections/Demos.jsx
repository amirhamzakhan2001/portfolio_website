import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEMO_CATEGORIES, DEMOS } from '../../data/demos'
import ScrollReveal from '../ui/ScrollReveal'
import DemoViewer from '../demos/DemoViewer'

export default function Demos() {
  const [activeCategory, setActiveCategory] = useState(null)

  const demoMap = Object.fromEntries(DEMOS.map(d => [d.id, d]))

  return (
    <section id="demos" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="section-label text-center">&gt; explore ./demos</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-center mb-4">
            AI / ML{' '}
            <span className="gradient-text">Interactive Demos</span>
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">
            42 hands-on demos across 7 domains. Click a category to explore — each demo includes a live interactive playground and a full theory breakdown.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DEMO_CATEGORIES.map((cat, i) => {
            const demosInCat = cat.demos.map(id => demoMap[id]).filter(Boolean)
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                onClick={() => setActiveCategory(cat)}
                className={`glass rounded-2xl p-5 border ${cat.border} cursor-none group relative overflow-hidden hover:scale-[1.02] transition-all duration-300`}
                style={{ boxShadow: `0 4px 32px ${cat.color}18` }}
              >
                {/* Gradient glow bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative">
                  {/* Icon + count */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-text-muted border-white/10 bg-bg-primary/40">
                      {cat.demos.length} demos
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-text-primary mb-2 leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Demo list */}
                  <div className="space-y-1 mb-4">
                    {demosInCat.slice(0, 5).map(d => (
                      <div key={d.id} className="flex items-center gap-1.5">
                        <span className="text-[10px]">{d.icon}</span>
                        <span className="text-[10px] font-mono text-text-muted/70">{d.title}</span>
                      </div>
                    ))}
                    {demosInCat.length > 5 && (
                      <div className="text-[10px] font-mono text-text-muted/40">
                        +{demosInCat.length - 5} more…
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono group-hover:text-white transition-colors duration-200"
                    style={{ color: cat.color }}>
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeCategory && (
          <DemoViewer
            category={activeCategory}
            demoMap={demoMap}
            onClose={() => setActiveCategory(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
