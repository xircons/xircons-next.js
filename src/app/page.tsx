import Header from '@/components/Header'
import HomeSectionScroll from '@/components/HomeSectionScroll'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import AboutMe from '@/sections/AboutMe'
import HeroTransition from '@/sections/HeroTransition'
import AboutMeTransition from '@/sections/AboutMeTransition'
import Works from '@/sections/Works'
import Skills from '@/sections/Skills'
import Contact from '@/sections/Contact'
import { portfolioData } from '@/data/portfolio'

/**
 * Root page — Server Component.
 * All scroll/animation/interaction logic lives inside the 'use client'
 * section components; this file simply composes the layout.
 */
export default function PortfolioPage() {
  return (
    <main id="main-content" className="overflow-x-hidden">
      <Header />
      <HomeSectionScroll />

      {/* ── 100dvh sections ─────────────────────────── */}
      <Hero />
      <HeroTransition />
      <AboutMe data={portfolioData.about} />

      <AboutMeTransition />
      <Works projects={portfolioData.works} />

      <Skills skills={portfolioData.skills} />
      <Contact />
      {/* ──────────────────────────────────────────────── */}

      <Footer />
    </main>
  )
}
