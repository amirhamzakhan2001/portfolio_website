/** @type {import('tailwindcss').Config} */

// ── MONOGRAPH design system ────────────────────────────────────────────
// Warm editorial. Cream ground, warm near-black ink, deep forest green as
// the single brand accent, burnt sienna as its foil. The feel is a printed
// monograph rather than a SaaS dashboard.
//
// The five stage/series colours are the same validated categorical palette,
// re-checked against this warmer surface (#F7F5F0) and re-ordered so warm
// hues lead and blue comes last — which also raised worst-adjacent tritan
// separation from ΔE 8.7 to 23.9.
//
// Text contrast on cream, measured:
//   ink 16.8:1 · ink2 7.8:1 · ink3 5.0:1 · brand 5.7:1 · sienna 6.1:1

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        sheet: '#FFFDF9',
        sunk: '#EFEBE2',
        line: '#E2DDD1',
        line2: '#CFC8B8',

        ink: '#16150F',
        ink2: '#514C41',
        ink3: '#6B6555',

        brand: { DEFAULT: '#0B6E4F', hover: '#085840', wash: '#E6F0EA' },
        sienna: { DEFAULT: '#98431F', wash: '#F7EAE2' },

        ok: '#0B6E4F',
        okWash: '#E6F0EA',
        warn: '#98431F',
        warnWash: '#F7EAE2',

        // validated categorical series — warm first, blue last
        st1: '#0E9384',
        st2: '#B54708',
        st3: '#7839EE',
        st4: '#BA2D5B',
        st5: '#2A5BD7',
      },

      fontFamily: {
        // Fraunces carries the personality; Archivo stays quiet underneath.
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.14em' }],
        meta: ['0.75rem', { lineHeight: '1.5' }],
        sm2: ['0.8125rem', { lineHeight: '1.5' }],
        base2: ['0.9375rem', { lineHeight: '1.65' }],
        lead: ['clamp(1.12rem, 1.7vw, 1.5rem)', { lineHeight: '1.6' }],
        mega: ['clamp(2.6rem, 8.4vw, 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.028em' }],
        d1: ['clamp(2.4rem, 7vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.024em' }],
        d2: ['clamp(1.9rem, 4.4vw, 3.6rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        d3: ['clamp(1.3rem, 2.3vw, 1.95rem)', { lineHeight: '1.18', letterSpacing: '-0.014em' }],
        num: ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.86', letterSpacing: '-0.035em' }],
      },

      spacing: { gutter: 'clamp(1.15rem, 5vw, 5rem)' },
      maxWidth: { shell: '1560px', prose: '60ch' },
      borderRadius: { xl2: '20px', panel: '14px', ctl: '10px', chip: '6px' },

      boxShadow: {
        // warm-tinted, layered — cool grey shadows look cheap on cream
        soft: '0 1px 2px rgba(22,21,15,.04), 0 10px 28px -12px rgba(22,21,15,.14)',
        lift: '0 2px 4px rgba(22,21,15,.05), 0 18px 40px -14px rgba(22,21,15,.20), 0 48px 90px -50px rgba(11,110,79,.35)',
        deep: '0 40px 110px -40px rgba(22,21,15,.34)',
        edge: 'inset 0 1px 0 rgba(255,255,255,.75)',
      },

      transitionTimingFunction: { sys: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      transitionDuration: { q: '160ms', m: '340ms' },
    },
  },
  plugins: [],
}
