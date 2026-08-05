/** @type {import('tailwindcss').Config} */

// ── SIGNAL design system ───────────────────────────────────────────────
// Concept: instrumentation. The palette is an audio measurement panel —
// cool near-black chassis, warm phosphor amber for the signal itself,
// steel blue for machine-reported data, one green reserved for live state.
// Nothing here is inherited from any previous theme.

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // chassis
        void: '#08090B',
        panel: '#0E1014',
        raised: '#15181E',
        edge: '#1E222A',

        // ink
        ink: '#E8E6E1',      // warm white — primary text
        dim: '#9B9DA3',      // secondary text
        mute: '#61646B',     // tertiary / labels

        // signal — the single accent. amber phosphor.
        signal: {
          DEFAULT: '#F0A340',
          hot: '#FFC170',
          deep: '#B9762A',
        },

        // machine-reported data
        steel: {
          DEFAULT: '#7E96B8',
          deep: '#4A5B75',
        },

        // semantic, kept separate from the accent
        live: '#46C98B',
        halt: '#E4614A',
      },

      fontFamily: {
        display: ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // fluid scale — minor third, clamped
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        label: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.1em' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        lead: ['clamp(1.15rem, 1.6vw, 1.4rem)', { lineHeight: '1.55' }],
        h3: ['clamp(1.35rem, 2.2vw, 1.85rem)', { lineHeight: '1.2' }],
        h2: ['clamp(2rem, 4.4vw, 3.4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.6rem, 6.8vw, 5.25rem)', { lineHeight: '0.96', letterSpacing: '-0.032em' }],
      },

      spacing: {
        gutter: 'clamp(1.15rem, 4vw, 3.25rem)',
        movement: 'clamp(6rem, 14vh, 11rem)',
      },

      maxWidth: {
        measure: '64ch',
        shell: '1360px',
      },

      borderRadius: {
        // instrument panels have tight, machined corners — never pill-shaped
        panel: '3px',
        chip: '2px',
      },

      transitionTimingFunction: {
        // one easing authority: fast attack, long settle. Matches an envelope.
        signal: 'cubic-bezier(0.16, 1, 0.3, 1)',
        gate: 'cubic-bezier(0.7, 0, 0.2, 1)',
      },

      transitionDuration: {
        attack: '180ms',
        settle: '620ms',
      },

      keyframes: {
        // ambient breath — the only looping animation in the system
        breathe: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        breathe: 'breathe 4.5s ease-in-out infinite',
        sweep: 'sweep 2.4s cubic-bezier(0.4,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
}
