"use client"

import dynamic from "next/dynamic"
import LenisProvider from "@/components/lenis-provider"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects3DEnhanced from "@/components/projects-3d-enhanced"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import ParallaxText from "@/components/parallax-text"
import SectionDivider from "@/components/section-divider"
import ScrollProgressBar from "@/components/scroll-progress-bar"

const PhysicsScene = dynamic(() => import("@/components/physics-scene"), {
  ssr: false,
})

const MagneticCursor = dynamic(() => import("@/components/magnetic-cursor"), {
  ssr: false,
})

const SkillsPhysics = dynamic(() => import("@/components/skills-physics"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  ),
})

export default function Home() {
  return (
    <LenisProvider>
      {/* Scroll progress indicator */}
      <ScrollProgressBar />
      
      {/* Custom magnetic cursor */}
      <MagneticCursor />
      
      {/* 3D Physics background */}
      <PhysicsScene />
      
      <main className="min-h-screen relative z-10">
        <Navbar />
        <Hero />
        
        {/* Parallax text divider - velocity-reactive */}
        <ParallaxText direction="left" speed={40} scrollBased>
          DEVELOPER
        </ParallaxText>
        
        <About />
        
        {/* Wave divider */}
        <SectionDivider variant="wave" />
        
        <ParallaxText direction="right" speed={50} scrollBased>
          SKILLS
        </ParallaxText>
        
        <SkillsPhysics />
        
        {/* Grid divider */}
        <SectionDivider variant="grid" />
        
        <ParallaxText direction="left" speed={45} scrollBased>
          PROJECTS
        </ParallaxText>
        
        <Projects3DEnhanced />
        
        {/* Orbs divider */}
        <SectionDivider variant="orbs" />
        
        <Contact />
        <Footer />
      </main>
    </LenisProvider>
  )
}
