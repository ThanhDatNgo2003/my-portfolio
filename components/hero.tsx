"use client"

import { ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

// Typing animation hook
function useTypingAnimation(text: string, speed: number = 100) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    setDisplayedText("")
    setIsComplete(false)

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1))
        i++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return { displayedText, isComplete }
}

// Glitch text effect
function GlitchText({ children, className }: { children: string; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <span className={cn("relative inline-block", className)}>
      <span
        className={cn(
          "relative z-10",
          isGlitching && "animate-pulse"
        )}
      >
        {children}
      </span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-primary opacity-70"
            style={{ transform: "translate(-2px, -2px)", clipPath: "inset(0 0 50% 0)" }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-secondary opacity-70"
            style={{ transform: "translate(2px, 2px)", clipPath: "inset(50% 0 0 0)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}

export default function Hero() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { displayedText, isComplete } = useTypingAnimation("I build fast, secure, and scalable web systems.", 50)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const lenis = (window as any).__lenis
      if (lenis) {
        lenis.scrollTo(element, { offset: -80 })
      } else {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Parallax calculations - only affect content, not the section background
  const parallaxY = scrollY * 0.3
  const contentOpacity = Math.max(0, 1 - scrollY / 600)

  return (
    <section
      id="hero"
      ref={ref}
      className={cn(
        "min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)",
            left: `calc(50% + ${mousePosition.x * 100}px)`,
            top: `calc(30% + ${mousePosition.y * 100}px)`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.5s ease-out, top 0.5s ease-out",
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)",
            right: `calc(30% - ${mousePosition.x * 80}px)`,
            bottom: `calc(20% - ${mousePosition.y * 80}px)`,
            transform: "translate(50%, 50%)",
            transition: "right 0.5s ease-out, bottom 0.5s ease-out",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `translateY(${parallaxY * 0.2}px)`,
        }}
      />

      <div 
        ref={containerRef}
        className="text-center max-w-5xl mx-auto relative z-10"
        style={{ transform: `translateY(${parallaxY}px)`, opacity: contentOpacity }}
      >
        {/* Welcome badge */}
        <div 
          className={cn(
            "mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          )}
          data-magnetic
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-mono text-sm text-primary">Welcome to my portfolio</span>
        </div>

        {/* Main title with 3D transform */}
        <h1 
          ref={titleRef}
          className={cn(
            "font-mono text-5xl md:text-7xl lg:text-9xl font-bold mb-6 text-balance leading-tight transition-all duration-1000 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <span className="text-foreground">Nguyen Thanh </span>
          <GlitchText className="text-primary glow-text">Dat</GlitchText>
        </h1>

        {/* Subtitle with gradient */}
        <h2 
          className={cn(
            "font-mono text-xl md:text-2xl lg:text-3xl mb-6 font-light tracking-wide transition-all duration-1000 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span className="gradient-text">Full-Stack Developer</span>
          <span className="text-muted-foreground"> & </span>
          <span className="gradient-text">DevOps Engineer</span>
        </h2>

        {/* Typing animation tagline */}
        <div 
          className={cn(
            "text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto h-16 flex items-center justify-center transition-all duration-1000 delay-400",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-pretty leading-relaxed">
            {displayedText}
            {!isComplete && <span className="animate-pulse text-primary">|</span>}
          </p>
        </div>

        {/* CTA Buttons with hover effects */}
        <div 
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <Button
            onClick={() => scrollToSection("projects")}
            className="relative group bg-primary text-primary-foreground font-mono px-8 py-6 text-base overflow-hidden"
            data-magnetic
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" />
          </Button>
          <Button
            onClick={() => scrollToSection("contact")}
            variant="outline"
            className="relative group border-secondary text-secondary hover:bg-secondary/10 font-mono px-8 py-6 text-base overflow-hidden"
            data-magnetic
          >
            <span className="relative z-10">Contact Me</span>
            <div className="absolute inset-0 border-2 border-secondary/50 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Enhanced Scroll Down Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        style={{ opacity: contentOpacity }}
      >
        <button
          onClick={() => scrollToSection("about")}
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group"
          aria-label="Scroll to about section"
          data-magnetic
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all">
            Scroll
          </span>
          <div className="relative">
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
              <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
            </div>
          </div>
        </button>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-float opacity-50" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary rounded-full animate-float opacity-30" style={{ animationDelay: "2s" }} />
    </section>
  )
}
