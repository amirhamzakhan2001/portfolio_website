import { useCountUp } from '../../lib/useCountUp'
import { useReveal } from '../../lib/useReveal'

/** Spec sheet. The numbers do the talking, the way a product page opens. */

function Spec({ value, decimals = 0, suffix = '', prefix = '', label, sub }) {
  const ref = useCountUp(value, { decimals, suffix, prefix })
  return (
    <div className="rv border-t-2 border-ink pt-4">
      <p ref={ref} className="tnum mega text-num text-ink">
        0
      </p>
      <p className="mt-2 font-ui text-[0.95rem] font-semibold uppercase leading-tight tracking-wide">
        {label}
      </p>
      <p className="mt-1 font-mono text-[0.66rem] uppercase leading-relaxed tracking-wider text-ink3">
        {sub}
      </p>
    </div>
  )
}

export default function Specs() {
  const ref = useReveal({ selector: '.rv' })

  return (
    <section id="specs" className="beat border-b-2 border-ink" ref={ref}>
      <div className="shell">
        <p className="eyebrow rv mb-8">The numbers</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          <Spec value={9.38} decimals={2} label="MSc CGPA" sub="AI & ML · Jamia Millia Islamia" />
          <Spec value={60} suffix="K" label="Emails sorted" sub="Zero manual labels" />
          <Spec value={96} suffix="%" label="Classifier accuracy" sub="Unsupervised pipeline" />
          <Spec value={9} label="Telephony integrations" sub="Shipped in Voxa" />
          <Spec value={2500} label="Rank, Amazon ML" sub="Of 7000+ teams" />
        </div>
      </div>
    </section>
  )
}
