import { useLenis } from './lib/useLenis'
import Sidebar from './components/app/Sidebar'
import Topbar from './components/app/Topbar'
import Overview from './components/views/Overview'
import Projects from './components/views/Projects'
import Foundations from './components/views/Foundations'
import Skills from './components/views/Skills'
import Timeline from './components/views/Timeline'
import Contact from './components/views/Contact'

export default function App() {
  useLenis()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ctl focus:bg-brand focus:px-4 focus:py-2 focus:text-sm2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Topbar />
      <Sidebar />

      <main
        id="main"
        className="px-4 pb-16 pt-[calc(var(--top-h)+3.25rem)] lg:pl-[calc(var(--rail-w)+1.5rem)] lg:pr-6 lg:pt-[calc(var(--top-h)+1.25rem)]"
      >
        <div className="mx-auto w-full max-w-content">
          <Overview />
          <Projects />
          <Foundations />
          <Skills />
          <Timeline />
          <Contact />
        </div>
      </main>
    </>
  )
}
