import { useLenis } from './lib/useLenis'
import Nav from './components/shell/Nav'
import Hero from './components/sections/Hero'
import Specs from './components/sections/Specs'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Path from './components/sections/Path'
import Contact from './components/sections/Contact'

export default function App() {
  useLenis()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-2 focus:border-ink focus:bg-paper focus:px-4 focus:py-2 focus:font-mono focus:text-micro focus:uppercase"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Specs />
        <Projects />
        <Skills />
        <Path />
        <Contact />
      </main>
    </>
  )
}
