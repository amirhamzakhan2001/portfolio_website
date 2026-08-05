/**
 * The mark: five strokes of a level meter, weighted asymmetrically so it
 * reads as a captured moment of speech rather than a symmetrical icon.
 * Used at nav, footer and favicon — one glyph, three sizes.
 */
export default function Mark({ className = '' }) {
  return (
    <svg viewBox="0 0 28 16" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M1 8h1.5" />
        <path d="M7 3.5v9" />
        <path d="M13 1v14" />
        <path d="M19 5.5v5" />
        <path d="M26.5 8H25" />
      </g>
    </svg>
  )
}
