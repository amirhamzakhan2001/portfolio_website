import { useState } from 'react'

/**
 * Horizontal stacked bar.
 *
 * Built to the house chart rules: thin marks, a 2px surface gap between
 * every segment, 4px rounded ends on the outer edges only, a legend
 * whenever there are two or more series, selective direct labels rather
 * than a number on every segment, and a hover layer by default.
 *
 * @param {{label:string, value:number, color:string}[]} series
 */
export default function StackBar({
  series,
  total,
  unit = '',
  showLegend = true,
  height = 'h-7',
  labelInside = true,
}) {
  const [hot, setHot] = useState(null)
  const sum = total ?? series.reduce((a, s) => a + s.value, 0)

  return (
    <div>
      <div className={`relative flex w-full ${height} gap-[2px] overflow-hidden rounded-[4px]`}>
        {series.map((s, i) => {
          const pct = sum > 0 ? (s.value / sum) * 100 : 0
          const first = i === 0
          const last = i === series.length - 1
          const dim = hot !== null && hot !== i
          return (
            <div
              key={s.label}
              role="img"
              aria-label={`${s.label}: ${s.value}${unit}`}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
              tabIndex={0}
              className="relative grid place-items-center transition-opacity duration-q"
              style={{
                width: `${pct}%`,
                background: s.color,
                opacity: dim ? 0.42 : 1,
                borderTopLeftRadius: first ? 4 : 0,
                borderBottomLeftRadius: first ? 4 : 0,
                borderTopRightRadius: last ? 4 : 0,
                borderBottomRightRadius: last ? 4 : 0,
              }}
            >
              {/* direct label only where the segment is wide enough to hold it */}
              {labelInside && pct > 11 && (
                <span className="tnum select-none px-1 font-mono text-[0.62rem] font-medium text-white/95">
                  {s.value}
                  {unit}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {showLegend && series.length >= 2 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {series.map((s, i) => (
            <li
              key={s.label}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              className="flex items-center gap-1.5 text-[0.75rem] text-ink2 transition-opacity duration-q"
              style={{ opacity: hot !== null && hot !== i ? 0.45 : 1 }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              {s.label}
              <span className="tnum font-mono text-[0.68rem] text-ink3">
                {s.value}
                {unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
