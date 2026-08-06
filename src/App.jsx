import { useGSAP, ScrollSmoother, ScrollTrigger, reduced, armFailsafe } from './lib/motion'
import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import Signal from './components/sections/Signal'
import Work from './components/sections/Work'
import Stack from './components/sections/Stack'
import Path from './components/sections/Path'
import Contact from './components/sections/Contact'

export default function App() {
  useGSAP(() => {
    // Fail open: if the frame loop never runs, show everything anyway.
    const disarm = armFailsafe(4000)

    // Smoothing is motion — anyone who opted out gets native scrolling.
    if (reduced()) return disarm

    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: true,
      normalizeScroll: true,
    })

    // fonts change text metrics, which changes every pinned distance
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return disarm
  })

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ctl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* Nav sits outside the smoother — fixed elements inside get transformed */}
      <Nav />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main">
            <Hero />
            <Signal />
            <Work />
            <Stack />
            <Path />
            <Contact />
          </main>
        </div>
      </div>
    </>
  )
}
