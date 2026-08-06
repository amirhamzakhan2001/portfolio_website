import { useCountUp } from '../../lib/useCountUp'

/**
 * Stat tile. A hero number carries the headline; the sub-line carries the
 * provenance, because an unattributed number in a portfolio is a claim
 * rather than evidence.
 */
export default function Kpi({ value, decimals = 0, prefix = '', suffix = '', label, sub, tone = 'ink' }) {
  const ref = useCountUp(value, { decimals, prefix, suffix })
  const toneCls = {
    ink: 'text-ink',
    brand: 'text-brand',
    ok: 'text-ok',
    warn: 'text-warn',
  }[tone]

  return (
    <div className="panel p-4">
      <p className="lab">{label}</p>
      <p ref={ref} className={`kpi mt-2 text-kpi font-semibold ${toneCls}`}>
        0
      </p>
      <p className="mt-1.5 text-[0.72rem] leading-snug text-ink3">{sub}</p>
    </div>
  )
}
