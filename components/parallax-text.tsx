"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ParallaxTextProps {
  children: string
  className?: string
  speed?: number
  direction?: "left" | "right"
}

export default function ParallaxText({
  children,
  className,
  speed = 50,
  direction = "left",
}: ParallaxTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let animationId: number
    let lastTime = 0

    const animate = (time: number) => {
      if (lastTime) {
        const delta = (time - lastTime) / 1000
        setOffset((prev) => {
          const newOffset = prev + speed * delta * (direction === "left" ? -1 : 1)
          // Reset when text scrolls out
          if (Math.abs(newOffset) > 1000) {
            return 0
          }
          return newOffset
        })
      }
      lastTime = time
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [speed, direction])

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden whitespace-nowrap py-4",
        className
      )}
    >
      <div
        className="inline-flex gap-8"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="text-6xl md:text-8xl lg:text-9xl font-mono font-bold text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(0, 217, 255, 0.3)",
            }}
          >
            {children}
          </span>
        ))}
      </div>
    </div>
  )
}
