"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SectionDividerProps {
  className?: string
  variant?: "particles" | "wave" | "grid" | "orbs"
}

export default function SectionDivider({ className, variant = "particles" }: SectionDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [isInView, setIsInView] = useState(false)

  // Track scroll velocity
  useEffect(() => {
    let lastScroll = window.scrollY
    let rafId: number

    const trackVelocity = () => {
      const currentScroll = window.scrollY
      const velocity = Math.abs(currentScroll - lastScroll)
      setScrollVelocity(velocity)
      lastScroll = currentScroll
      rafId = requestAnimationFrame(trackVelocity)
    }

    rafId = requestAnimationFrame(trackVelocity)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "100px" }
    )

    if (canvasRef.current) observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isInView) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener("resize", resize)

    let animationId: number
    let time = 0

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      baseSize: number
      phase: number
    }

    const particles: Particle[] = []

    // Create particles based on variant
    const particleCount = variant === "orbs" ? 20 : 60
    for (let i = 0; i < particleCount; i++) {
      const baseSize = variant === "orbs" ? Math.random() * 8 + 4 : Math.random() * 3 + 1
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: baseSize,
        baseSize,
        color: Math.random() > 0.5 ? "#00D9FF" : "#7C3AED",
        phase: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Velocity-based effects
      const velocityFactor = Math.min(scrollVelocity * 0.05, 2)

      if (variant === "wave") {
        // Draw wave pattern
        ctx.beginPath()
        ctx.moveTo(0, canvas.offsetHeight / 2)
        
        for (let x = 0; x <= canvas.offsetWidth; x += 5) {
          const y = canvas.offsetHeight / 2 + 
            Math.sin(x * 0.02 + time * 2) * 20 * (1 + velocityFactor) +
            Math.sin(x * 0.01 + time) * 15
          ctx.lineTo(x, y)
        }
        
        ctx.strokeStyle = "rgba(0, 217, 255, 0.3)"
        ctx.lineWidth = 2
        ctx.stroke()

        // Second wave
        ctx.beginPath()
        ctx.moveTo(0, canvas.offsetHeight / 2)
        
        for (let x = 0; x <= canvas.offsetWidth; x += 5) {
          const y = canvas.offsetHeight / 2 + 
            Math.cos(x * 0.015 + time * 1.5) * 25 * (1 + velocityFactor) +
            Math.sin(x * 0.025 + time * 2.5) * 10
          ctx.lineTo(x, y)
        }
        
        ctx.strokeStyle = "rgba(124, 58, 237, 0.25)"
        ctx.lineWidth = 2
        ctx.stroke()
      } else if (variant === "grid") {
        // Draw animated grid
        const gridSize = 40
        const offsetX = (time * 20 * (1 + velocityFactor)) % gridSize
        const offsetY = (time * 10) % gridSize

        ctx.strokeStyle = "rgba(0, 217, 255, 0.1)"
        ctx.lineWidth = 1

        // Vertical lines
        for (let x = -gridSize + offsetX; x <= canvas.offsetWidth + gridSize; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.offsetHeight)
          ctx.stroke()
        }

        // Horizontal lines
        for (let y = -gridSize + offsetY; y <= canvas.offsetHeight + gridSize; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.offsetWidth, y)
          ctx.stroke()
        }

        // Highlight intersections
        for (let x = -gridSize + offsetX; x <= canvas.offsetWidth + gridSize; x += gridSize) {
          for (let y = -gridSize + offsetY; y <= canvas.offsetHeight + gridSize; y += gridSize) {
            const pulse = Math.sin(time * 3 + x * 0.01 + y * 0.01) * 0.5 + 0.5
            ctx.beginPath()
            ctx.arc(x, y, 2 + pulse * 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(0, 217, 255, ${0.3 + pulse * 0.3})`
            ctx.fill()
          }
        }
      } else {
        // Particles variant (default) or orbs
        particles.forEach((p, i) => {
          // Velocity affects particle speed
          const speedMultiplier = 1 + velocityFactor * 0.5
          p.x += p.vx * speedMultiplier
          p.y += p.vy * speedMultiplier

          // Wrap around
          if (p.x < -20) p.x = canvas.offsetWidth + 20
          if (p.x > canvas.offsetWidth + 20) p.x = -20
          if (p.y < -20) p.y = canvas.offsetHeight + 20
          if (p.y > canvas.offsetHeight + 20) p.y = -20

          // Pulsing size for orbs
          const pulse = variant === "orbs" 
            ? Math.sin(time * 2 + p.phase) * 0.3 + 1
            : 1
          p.size = p.baseSize * pulse

          // Draw particle with glow
          if (variant === "orbs") {
            // Outer glow
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
            gradient.addColorStop(0, p.color + "40")
            gradient.addColorStop(0.5, p.color + "10")
            gradient.addColorStop(1, "transparent")
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.fill()
          }

          // Core particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = variant === "orbs" ? 0.8 : 0.6
          ctx.fill()
          ctx.globalAlpha = 1

          // Draw connections
          if (variant !== "orbs") {
            particles.slice(i + 1).forEach((p2) => {
              const dx = p.x - p2.x
              const dy = p.y - p2.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              const maxDist = 120 + velocityFactor * 30

              if (dist < maxDist) {
                ctx.beginPath()
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.strokeStyle = p.color
                ctx.globalAlpha = (1 - dist / maxDist) * 0.3
                ctx.lineWidth = 1 + velocityFactor * 0.5
                ctx.stroke()
                ctx.globalAlpha = 1
              }
            })
          }
        })
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [variant, scrollVelocity, isInView])

  return (
    <div className={cn("relative h-40 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      {/* Center glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 80% at 50% 50%, rgba(0, 217, 255, ${0.05 + scrollVelocity * 0.002}), transparent)`,
        }}
      />
      {/* Edge fades */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50 pointer-events-none" />
    </div>
  )
}
