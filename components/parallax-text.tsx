"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ParallaxTextProps {
  children: string
  className?: string
  speed?: number
  direction?: "left" | "right"
  scrollBased?: boolean
}

export default function ParallaxText({
  children,
  className,
  speed = 50,
  direction = "left",
  scrollBased = true,
}: ParallaxTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const baseSpeedRef = useRef(speed)
  const lastScrollRef = useRef(0)

  // Track scroll velocity for dynamic speed
  useEffect(() => {
    if (!scrollBased) return

    let lastScroll = window.scrollY
    let rafId: number

    const trackVelocity = () => {
      const currentScroll = window.scrollY
      const velocity = Math.abs(currentScroll - lastScroll)
      setScrollVelocity(velocity)
      lastScroll = currentScroll
      lastScrollRef.current = currentScroll
      rafId = requestAnimationFrame(trackVelocity)
    }

    rafId = requestAnimationFrame(trackVelocity)
    return () => cancelAnimationFrame(rafId)
  }, [scrollBased])

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "100px" }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Animation loop with scroll-velocity-based speed
  useEffect(() => {
    if (!isInView) return

    let animationId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (lastTime) {
        const delta = (time - lastTime) / 1000
        
        // Combine base speed with scroll velocity for dynamic effect
        const velocityBoost = scrollBased ? Math.min(scrollVelocity * 0.5, 200) : 0
        const dynamicSpeed = baseSpeedRef.current + velocityBoost
        
        setOffset((prev) => {
          const newOffset = prev + dynamicSpeed * delta * (direction === "left" ? -1 : 1)
          // Seamless loop
          const resetPoint = 1200
          if (Math.abs(newOffset) > resetPoint) {
            return newOffset % resetPoint
          }
          return newOffset
        })
      }
      lastTime = time
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [speed, direction, scrollVelocity, scrollBased, isInView])

  // Skew effect based on velocity
  const skewAmount = scrollBased ? Math.min(scrollVelocity * 0.02, 3) : 0
  const skewDirection = direction === "left" ? -1 : 1

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden whitespace-nowrap py-6 relative",
        className
      )}
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div
        className="inline-flex gap-12 will-change-transform"
        style={{ 
          transform: `translateX(${offset}px) skewX(${skewAmount * skewDirection}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="text-6xl md:text-8xl lg:text-[10rem] font-mono font-bold text-transparent select-none"
            style={{
              WebkitTextStroke: `1px rgba(0, 217, 255, ${0.2 + (scrollVelocity * 0.002)})`,
              filter: scrollVelocity > 10 ? `blur(${Math.min(scrollVelocity * 0.01, 1)}px)` : "none",
              transition: "filter 0.2s ease-out, -webkit-text-stroke 0.2s ease-out",
            }}
          >
            {children}
          </span>
        ))}
      </div>
    </div>
  )
}

// Vertical parallax text for dramatic reveals
interface VerticalParallaxTextProps {
  text: string
  className?: string
}

export function VerticalParallaxText({ text, className }: VerticalParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / windowHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const chars = text.split("")

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div className="flex justify-center">
        {chars.map((char, i) => {
          const delay = i * 0.05
          const charProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 2))
          
          return (
            <span
              key={i}
              className="text-6xl md:text-8xl font-mono font-bold text-primary inline-block"
              style={{
                transform: `translateY(${(1 - charProgress) * 100}%) rotateX(${(1 - charProgress) * -90}deg)`,
                opacity: charProgress,
                transformOrigin: "center bottom",
                transition: "none",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          )
        })}
      </div>
    </div>
  )
}
