import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Work } from '@/components/sections/Work'
import { Problems } from '@/components/sections/Problems'
import { Projects } from '@/components/sections/Projects'
import { Toolkit } from '@/components/sections/Toolkit'
import { Contact } from '@/components/sections/Contact'

export default function App() {
  return (
    <div className="min-h-dvh bg-canvas">
      <ScrollProgress />
      <TopBar />

      <main>
        <Hero />
        <About />
        <Work />
        <Problems />
        <Projects />
        <Toolkit />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
