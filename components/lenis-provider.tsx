"use client"

import { useEffect, useRef, createContext, useContext, type ReactNode } from "react"
import Lenis from "lenis"

interface LenisContextType {
  lenis: Lenis | null
}

const LenisContext = createContext<LenisContextType>({ lenis: null })

export function useLenis() {
  return useContext(LenisContext)
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => {
        // Custom easing function for premium feel
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      },
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 2.5,
      infinite: false,
    })

    lenisRef.current = lenis

    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Enhanced anchor link handling
    const handleAnchorClick = (e: Event) => {
      const anchor = e.currentTarget as HTMLAnchorElement
      const href = anchor.getAttribute("href")
      
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 1.5,
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
    }
  }, [])

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  )
}
