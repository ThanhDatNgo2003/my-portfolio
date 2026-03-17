"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface HorizontalScrollSectionProps {
  children: ReactNode
  className?: string
  speed?: number
}

export default function HorizontalScrollSection({
  children,
  className,
  speed = 1,
}: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const containerHeight = container.offsetHeight
      
      // Calculate how much of the container is in view
      const startScroll = rect.top + windowHeight
      const endScroll = rect.bottom
      const totalScrollDistance = containerHeight
      
      if (startScroll > 0 && endScroll > 0) {
        const scrolled = windowHeight - rect.top
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance))
        setScrollProgress(progress)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate content width for proper scrolling
  const contentWidth = contentRef.current?.scrollWidth || 0
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0
  const maxTranslate = Math.max(0, contentWidth - viewportWidth)
  const translateX = -scrollProgress * maxTranslate * speed

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[300vh]", className)}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div
          ref={contentRef}
          className="flex gap-8 px-8 will-change-transform"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// Card for horizontal scroll section
interface HorizontalCardProps {
  children: ReactNode
  className?: string
  index?: number
}

export function HorizontalCard({ children, className, index = 0 }: HorizontalCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3, rootMargin: "0px 100px" }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-[400px] md:min-w-[500px] lg:min-w-[600px] rounded-2xl transition-all duration-700",
        isInView ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {children}
    </div>
  )
}
