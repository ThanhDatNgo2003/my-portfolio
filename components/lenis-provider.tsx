"use client"

import { useEffect, useRef, createContext, useContext, useState, type ReactNode } from "react"
import Lenis from "lenis"

interface LenisContextType {
  lenis: Lenis | null
  scrollProgress: number
  scrollVelocity: number
  scrollDirection: "up" | "down" | null
}

const LenisContext = createContext<LenisContextType>({ 
  lenis: null, 
  scrollProgress: 0, 
  scrollVelocity: 0,
  scrollDirection: null 
})

export function useLenisScroll() {
  return useContext(LenisContext)
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => {
        // Premium buttery smooth easing
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2
      },
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis
    
    // Expose lenis globally for components that need direct access
    ;(window as any).__lenis = lenis

    // Track scroll progress and velocity
    lenis.on("scroll", ({ progress, velocity, direction }: { progress: number; velocity: number; direction: number }) => {
      setScrollProgress(progress)
      setScrollVelocity(Math.abs(velocity))
      setScrollDirection(direction > 0 ? "down" : direction < 0 ? "up" : null)
      
      // Update CSS custom properties for scroll-driven animations
      document.documentElement.style.setProperty("--scroll-progress", progress.toString())
      document.documentElement.style.setProperty("--scroll-velocity", Math.min(Math.abs(velocity) * 0.1, 1).toString())
    })

    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Enhanced anchor link handling with smooth scroll
    const handleAnchorClick = (e: Event) => {
      const anchor = e.currentTarget as HTMLAnchorElement
      const href = anchor.getAttribute("href")
      
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 2,
          })
        }
      }
    }

    // Setup anchor links
    const setupAnchors = () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick)
        anchor.addEventListener("click", handleAnchorClick)
      })
    }

    setupAnchors()

    // Observe for dynamically added links
    const observer = new MutationObserver(setupAnchors)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick)
      })
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      lenis.destroy()
      delete (window as any).__lenis
    }
  }, [])

  return (
    <LenisContext.Provider value={{ 
      lenis: lenisRef.current, 
      scrollProgress, 
      scrollVelocity,
      scrollDirection 
    }}>
      {children}
    </LenisContext.Provider>
  )
}
