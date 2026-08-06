/** @type {import('tailwindcss').Config} */

// ── CONSOLE design system ──────────────────────────────────────────────
// The portfolio as the tool an ML engineer actually lives in: an
// experiment console. Neutral chrome, dense-but-legible panels, real
// charts. All personality is spent on information design, not decoration.
//
// The five `series` colours are a validated categorical palette — they
// pass lightness band, chroma floor, CVD separation (worst adjacent
// ΔE 13.3 deutan), normal-vision separation and 3:1 contrast on #FCFCFB.
// Do not add a sixth by eye; fold extra categories into "Other".

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // chrome
        app: '#FCFCFB',
        panel: '#FFFFFF',
        rail: '#F4F4F1',
        sunk: '#F0F0EC',
        line: '#E5E5E0',
        line2: '#D2D2CB',

        // ink
        ink: '#14161A',
        ink2: '#565C66',
        ink3: '#8A9099',

        // primary action
        brand: {
          DEFAULT: '#2A5BD7',
          hover: '#1E45A8',
          wash: '#EDF2FE',
        },

        // semantic state — never reused as a series colour
        ok: '#0E9384',
        okWash: '#E6F6F3',
        warn: '#B54708',
        warnWash: '#FDF3E7',
        crit: '#BA2D5B',

        // validated categorical series
        s1: '#2A5BD7',
        s2: '#0E9384',
        s3: '#B54708',
        s4: '#7839EE',
        s5: '#BA2D5B',
      },

      fontFamily: {
        ui: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1.35', letterSpacing: '0.06em' }],
        meta: ['0.75rem', { lineHeight: '1.45' }],
        sm2: ['0.8125rem', { lineHeight: '1.5' }],
        base2: ['0.9375rem', { lineHeight: '1.6' }],
        lead: ['1.0625rem', { lineHeight: '1.6' }],
        kpi: ['clamp(1.9rem, 3.4vw, 2.9rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        h3: ['1.0625rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        h2: ['clamp(1.35rem, 2.4vw, 1.9rem)', { lineHeight: '1.18', letterSpacing: '-0.022em' }],
        h1: ['clamp(1.9rem, 4vw, 3.1rem)', { lineHeight: '1.05', letterSpacing: '-0.032em' }],
      },

      spacing: { rail: '15rem' },
      maxWidth: { content: '1320px', prose: '68ch' },
      borderRadius: { panel: '10px', ctl: '7px', chip: '5px' },

      boxShadow: {
        panel: '0 1px 2px rgba(20,22,26,.04), 0 1px 1px rgba(20,22,26,.03)',
        raise: '0 2px 4px rgba(20,22,26,.05), 0 12px 28px -10px rgba(20,22,26,.14)',
        focus: '0 0 0 3px rgba(42,91,215,.18)',
      },

      transitionTimingFunction: { sys: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      transitionDuration: { q: '130ms', m: '260ms' },

      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        drawIn: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
      },
      animation: { pulseDot: 'pulseDot 2.4s ease-in-out infinite' },
    },
  },
  plugins: [],
}
