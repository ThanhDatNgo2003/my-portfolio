"use client"

import { useEffect, useState } from "react"

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)
  const [velocity, setVelocity] = useState(0)

  useEffect(() => {
    let lastScroll = 0
    let rafId: number

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      const scrollVelocity = Math.abs(scrollTop - lastScroll)
      
      setProgress(scrollProgress)
      setVelocity(scrollVelocity)
      lastScroll = scrollTop
      rafId = requestAnimationFrame(updateProgress)
    }

    rafId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Glow intensity based on velocity
  const glowIntensity = Math.min(velocity * 0.5, 20)

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-muted/20">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-primary relative"
          style={{
            width: `${progress * 100}%`,
            boxShadow: `0 0 ${10 + glowIntensity}px rgba(0, 217, 255, ${0.5 + velocity * 0.01}), 0 0 ${20 + glowIntensity * 2}px rgba(124, 58, 237, 0.3)`,
            transition: "width 0.1s ease-out",
          }}
        >
          {/* Animated shimmer */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              transform: `translateX(${-100 + progress * 200}%)`,
            }}
          />
        </div>
      </div>

      {/* Side progress indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center gap-2">
        {/* Progress line */}
        <div className="w-0.5 h-32 bg-muted/30 rounded-full overflow-hidden relative">
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-secondary rounded-full"
            style={{
              height: `${progress * 100}%`,
              boxShadow: `0 0 ${8 + glowIntensity}px rgba(0, 217, 255, 0.5)`,
              transition: "height 0.15s ease-out",
            }}
          />
        </div>
        
        {/* Percentage */}
        <span 
          className="text-xs font-mono text-primary"
          style={{
            textShadow: velocity > 5 ? `0 0 ${glowIntensity}px rgba(0, 217, 255, 0.8)` : "none",
          }}
        >
          {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Velocity indicator (subtle line at sides when scrolling fast) */}
      {velocity > 20 && (
        <>
          <div 
            className="fixed left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent z-[99] pointer-events-none"
            style={{
              opacity: Math.min(velocity * 0.02, 0.5),
            }}
          />
          <div 
            className="fixed right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent z-[99] pointer-events-none"
            style={{
              opacity: Math.min(velocity * 0.02, 0.5),
            }}
          />
        </>
      )}
    </>
  )
}
