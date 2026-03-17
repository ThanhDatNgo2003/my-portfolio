"use client"

import dynamic from "next/dynamic"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

// Dynamically import the 3D model to avoid SSR issues
const DesktopPCModel = dynamic(() => import("./desktop-pc-model"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto md:mx-0 w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden bg-primary/5 animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  ),
})

// Animated counter for stats
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const statRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.5 }
    )

    if (statRef.current) observer.observe(statRef.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div 
      ref={statRef}
      className={cn(
        "text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="font-mono text-3xl md:text-4xl font-bold text-primary mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default function About() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about")
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        "py-24 md:py-32 px-6 relative overflow-hidden transition-all duration-1000",
        sectionVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Parallax background elements */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"
        style={{ transform: `translateY(${scrollProgress * 100}px)` }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"
        style={{ transform: `translateY(${-scrollProgress * 80}px)` }}
      />

      <div className="container mx-auto max-w-6xl">
        {/* Section title with animated underline */}
        <div className="relative mb-16 text-center">
          <h2 
            className={cn(
              "font-mono text-3xl md:text-5xl font-bold transition-all duration-700",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <span className="text-primary">01.</span> About Me
          </h2>
          <div 
            className={cn(
              "h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 transition-all duration-1000 delay-300",
              sectionVisible ? "w-32 opacity-100" : "w-0 opacity-0"
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* 3D Desktop PC Model */}
          <DesktopPCModel isVisible={sectionVisible} />

          {/* Bio Content */}
          <div
            ref={contentRef}
            className={cn(
              "space-y-6 transition-all duration-1000 delay-400",
              contentVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              Hi! I&apos;m <span className="text-primary font-semibold">Dat</span>, a passionate full-stack developer and DevOps engineer 
              based in Vietnam. I specialize in building robust web applications 
              and managing cloud infrastructure that scales.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My journey in tech started with tinkering on Raspberry Pi projects 
              and has evolved into designing and deploying production-grade systems. 
              I believe in writing clean, maintainable code and automating everything 
              that can be automated.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me exploring new technologies, 
              contributing to open-source projects, or optimizing server configurations.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/50">
              <AnimatedStat value="3+" label="Years Experience" delay={0} />
              <AnimatedStat value="20+" label="Projects" delay={200} />
              <AnimatedStat value="10+" label="Technologies" delay={400} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
