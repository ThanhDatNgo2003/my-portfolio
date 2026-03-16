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

const PhysicsScene = dynamic(() => import("@/components/physics-scene"), {
  ssr: false,
})

const MagneticCursor = dynamic(() => import("@/components/magnetic-cursor"), {
  ssr: false,
})

export default function Home() {
  return (
    <LenisProvider>
      {/* Custom magnetic cursor */}
      <MagneticCursor />
      
      {/* 3D Physics background */}
      <PhysicsScene />
      
      <main className="min-h-screen relative z-10">
        <Navbar />
        <Hero />
        
        {/* Parallax text divider */}
        <ParallaxText direction="left" speed={30}>
          DEVELOPER
        </ParallaxText>
        
        <About />
        
        {/* Section divider with particles */}
        <SectionDivider />
        
        <ParallaxText direction="right" speed={40}>
          DEVOPS
        </ParallaxText>
        
        <Projects3DEnhanced />
        
        <SectionDivider />
        
        <Contact />
        <Footer />
      </main>
    </LenisProvider>
  )
}
