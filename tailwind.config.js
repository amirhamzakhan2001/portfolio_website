/** @type {import('tailwindcss').Config} */

// ── LAUNCH design system ───────────────────────────────────────────────
// Product-launch energy on a light ground. Heavy black type, near-white
// chassis, one blaze accent that does all the shouting, electric blue for
// data. High contrast, big scale jumps, nothing timid.

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1F1EE',   // chassis
        sheet: '#FFFFFF',
        wash: '#E4E4DF',
        ink: '#0A0A0A',     // heavy black — impact type
        ink2: '#4A4A4A',
        ink3: '#8C8C87',
        line: '#D6D6D0',
        line2: '#BFBFB7',

        blaze: {            // the accent that shouts
          DEFAULT: '#FF3D00',
          deep: '#CC2E00',
          wash: '#FFEDE7',
        },
        volt: {             // data / secondary
          DEFAULT: '#2B2BFF',
          wash: '#E8E8FF',
        },
        moss: '#00A05A',
      },

      fontFamily: {
        // three faces, three jobs, huge contrast between them
        mega: ['Anton', 'Impact', 'sans-serif'],          // headlines only
        ui: ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.16em' }],
        label: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
        body: ['1.0625rem', { lineHeight: '1.6' }],
        lead: ['clamp(1.15rem, 1.8vw, 1.5rem)', { lineHeight: '1.5' }],
        // the big jumps — this is where the energy comes from
        d1: ['clamp(3.5rem, 13vw, 12rem)', { lineHeight: '0.88', letterSpacing: '-0.03em' }],
        d2: ['clamp(2.6rem, 8vw, 7rem)', { lineHeight: '0.86', letterSpacing: '-0.025em' }],
        d3: ['clamp(1.9rem, 4.4vw, 3.6rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        num: ['clamp(3rem, 9vw, 8rem)', { lineHeight: '0.8', letterSpacing: '-0.04em' }],
      },

      spacing: {
        gutter: 'clamp(1.1rem, 4vw, 3.5rem)',
        beat: 'clamp(4.5rem, 11vh, 8.5rem)',
      },

      maxWidth: { measure: '58ch', shell: '1560px' },
      borderRadius: { panel: '6px', chip: '3px' },

      boxShadow: {
        hard: '6px 6px 0 0 #0A0A0A',
        hardBlaze: '6px 6px 0 0 #FF3D00',
        lift: '0 2px 4px rgba(10,10,10,.06), 0 16px 40px -12px rgba(10,10,10,.18)',
      },

      transitionTimingFunction: {
        snap: 'cubic-bezier(0.2, 0.9, 0.1, 1)',   // fast, decisive
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: { fast: '140ms', mid: '380ms' },

      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.25' } },
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        blink: 'blink 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
