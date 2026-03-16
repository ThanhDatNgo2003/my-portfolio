"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const dotPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement
      const isInteractive = target.closest("a, button, [data-magnetic]")
      setIsHovering(!!isInteractive)

      // Magnetic effect for interactive elements
      if (isInteractive) {
        const rect = (isInteractive as HTMLElement).getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY

        // Pull cursor towards center of element
        mousePos.current = {
          x: e.clientX - distX * 0.3,
          y: e.clientY - distY * 0.3,
        }
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  useEffect(() => {
    let animationId: number

    const animate = () => {
      // Smooth lerp for main cursor
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15

      // Faster lerp for dot
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.35
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.35

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-all duration-300",
          isHovering ? "w-16 h-16" : "w-10 h-10",
          isClicking ? "scale-75" : "scale-100"
        )}
        style={{ willChange: "transform" }}
      >
        <div
          className={cn(
            "w-full h-full rounded-full border-2 transition-all duration-300",
            isHovering
              ? "border-primary bg-primary/10 scale-125"
              : "border-white/50"
          )}
        />
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-150",
          isClicking ? "scale-150" : "scale-100"
        )}
        style={{ willChange: "transform" }}
      >
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            isHovering ? "bg-primary scale-150" : "bg-white"
          )}
        />
      </div>
    </>
  )
}
