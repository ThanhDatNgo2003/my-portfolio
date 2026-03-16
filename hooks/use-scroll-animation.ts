"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollAnimation<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Intersection Observer for visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (triggerOnce) {
              observer.unobserve(element)
            }
          } else if (!triggerOnce) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    // Scroll listener for parallax and progress
    const handleScroll = () => {
      if (!element) return

      const rect = element.getBoundingClientRect()
      const elementTop = rect.top
      const elementBottom = rect.bottom
      const windowHeight = window.innerHeight

      // Calculate scroll progress (0 to 1) while element is in view
      if (elementTop < windowHeight && elementBottom > 0) {
        const progress = 1 - (elementTop / windowHeight)
        setScrollProgress(Math.max(0, Math.min(1, progress)))
      }
    }

    observer.observe(element)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      observer.unobserve(element)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isVisible, scrollProgress }
}
