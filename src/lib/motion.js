import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

// useGSAP is the officially supported React integration: it wraps every
// animation in a gsap.context and reverts it on cleanup, which is what makes
// this survive React 18 StrictMode's double-mount. Plain useEffect +
// gsap.from() strands elements at their `from` values when the first mount
// is torn down mid-tween.
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin)

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin }

/**
 * Every tween the helpers create is registered here so it can be forced to
 * its end state.
 *
 * This matters because `.kin` starts at opacity 0 in CSS: if GSAP never
 * ticks, the page is blank. rAF stalls in background/throttled tabs, on
 * very slow devices, and any time an animation frame budget collapses — so
 * a page that depends on rAF to become *legible* is a page that can fail
 * closed. The failsafe makes it fail open instead.
 */
// Only load-sequence tweens (no ScrollTrigger) are tracked. Scroll-driven
// reveals must NOT be force-completed — that would burn every reveal further
// down the page before the visitor ever reaches it.
const LOAD_TWEENS = []
const track = (tween, isLoadSequence) => {
  if (tween && isLoadSequence) LOAD_TWEENS.push(tween)
  return tween
}

/** Let a section register its own load-sequence tween with the failsafe. */
export const trackLoad = (tween) => track(tween, true)

/** Jump the load sequence to its end state, immediately and synchronously. */
export function forceLoadComplete() {
  LOAD_TWEENS.forEach((t) => {
    try {
      t.progress(1)
    } catch {
      /* already killed */
    }
  })
  document.documentElement.classList.add('motion-done')
}

/**
 * Arm the failsafe. If the load sequence has not actually progressed within
 * `ms`, the frame loop is not running — reveal everything rather than leave
 * the visitor staring at a blank page.
 */
export function armFailsafe(ms = 3500) {
  const id = setTimeout(() => {
    const stalled = LOAD_TWEENS.some((t) => t.progress() < 0.99)
    if (stalled) forceLoadComplete()
  }, ms)
  return () => clearTimeout(id)
}

/** Everything obeys one curve, so the whole site reads as one system. */
export const EASE = 'power3.out'
export const EASE_IN_OUT = 'power2.inOut'

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Character-level heading reveal.
 *
 * Splits into lines → chars, then lifts each char from below with a small
 * stagger. Returns the SplitText instance so the caller can revert it —
 * leaving split markup in the DOM breaks text selection and screen readers.
 */
export function revealChars(el, opts = {}) {
  if (!el) return null
  const { trigger = el, start = 'top 85%', delay = 0, stagger = 0.014 } = opts

  if (reduced()) {
    gsap.set(el, { opacity: 1 })
    return null
  }

  // `words` is not optional here. Splitting straight to chars makes every
  // letter its own inline-block, so the browser will happily wrap mid-word
  // ("Amir H / amza"). Nesting chars inside word wrappers restores normal
  // word boundaries while still animating per character.
  const split = new SplitText(el, {
    type: 'lines,words,chars',
    linesClass: 'sp-line',
    wordsClass: 'sp-word',
  })

  gsap.set(el, { opacity: 1 })
  track(gsap.from(split.chars, {
    yPercent: 118,
    opacity: 0,
    duration: 0.9,
    ease: EASE,
    stagger,
    delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  }), !trigger)

  return split
}

/** Word-level reveal — calmer than chars, right for body copy and leads. */
export function revealWords(el, opts = {}) {
  if (!el) return null
  const { trigger = el, start = 'top 88%', delay = 0 } = opts

  if (reduced()) {
    gsap.set(el, { opacity: 1 })
    return null
  }

  const split = new SplitText(el, { type: 'lines,words', linesClass: 'sp-line' })
  gsap.set(el, { opacity: 1 })
  track(gsap.from(split.words, {
    yPercent: 90,
    opacity: 0,
    duration: 0.7,
    ease: EASE,
    stagger: 0.012,
    delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  }), !trigger)
  return split
}

/** Staggered rise for a group of elements. */
export function riseIn(targets, opts = {}) {
  if (!targets || (targets.length !== undefined && !targets.length)) return
  const { trigger, start = 'top 85%', y = 34, stagger = 0.07, delay = 0 } = opts

  if (reduced()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return
  }

  track(gsap.from(targets, {
    y,
    opacity: 0,
    duration: 0.85,
    ease: EASE,
    stagger,
    delay,
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  }), !trigger)
}

/** Scrub a number as the element crosses the viewport. */
export function countUp(el, value, opts = {}) {
  if (!el) return
  const { decimals = 0, suffix = '', prefix = '', trigger = el } = opts
  const fmt = (v) =>
    prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix

  if (reduced()) {
    el.textContent = fmt(value)
    return
  }

  const state = { v: 0 }
  el.textContent = fmt(0)
  gsap.to(state, {
    v: value,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate: () => (el.textContent = fmt(state.v)),
    scrollTrigger: { trigger, start: 'top 88%', once: true },
  })
}

/**
 * Magnetic pull toward the cursor. Reserved for real conversion targets —
 * scarcity is what makes it read as handcrafted rather than gimmicky.
 */
export function magnetic(el, strength = 0.32) {
  if (!el || reduced() || !window.matchMedia('(pointer: fine)').matches) return () => {}

  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    xTo((e.clientX - (r.left + r.width / 2)) * strength)
    yTo((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    xTo(0)
    yTo(0)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  }
}
