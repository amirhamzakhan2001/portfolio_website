import { useLenis } from './lib/useLenis'
import Nav from './components/shell/Nav'
import Reticle from './components/shell/Reticle'
import Hero from './components/hero/Hero'
import Approach from './components/movements/Approach'
import Voxa from './components/movements/Voxa'
import Work from './components/movements/Work'
import Instruments from './components/movements/Instruments'
import Trace from './components/movements/Trace'
import Contact from './components/movements/Contact'

export default function App() {
  useLenis()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-chip focus:border focus:border-signal focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-micro focus:uppercase focus:text-signal"
      >
        Skip to content
      </a>

      <Reticle />
      <Nav />

      <main id="main">
        <Hero />
        <Approach />
        <Voxa />
        <Work />
        <Instruments />
        <Trace />
        <Contact />
      </main>
    </>
  )
}
