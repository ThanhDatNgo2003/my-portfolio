"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

// Skills data with colors
const skills = [
  { name: "React", color: "#61DAFB", textColor: "#000" },
  { name: "Next.js", color: "#ffffff", textColor: "#000" },
  { name: "TypeScript", color: "#3178C6", textColor: "#fff" },
  { name: "Node.js", color: "#339933", textColor: "#fff" },
  { name: "Docker", color: "#2496ED", textColor: "#fff" },
  { name: "PostgreSQL", color: "#4169E1", textColor: "#fff" },
  { name: "Linux", color: "#FCC624", textColor: "#000" },
  { name: "AWS", color: "#FF9900", textColor: "#000" },
  { name: "Python", color: "#3776AB", textColor: "#fff" },
  { name: "Git", color: "#F05032", textColor: "#fff" },
  { name: "Kubernetes", color: "#326CE5", textColor: "#fff" },
  { name: "Redis", color: "#DC382D", textColor: "#fff" },
  { name: "GraphQL", color: "#E10098", textColor: "#fff" },
  { name: "Tailwind", color: "#06B6D4", textColor: "#000" },
  { name: "MongoDB", color: "#47A248", textColor: "#fff" },
  { name: "Nginx", color: "#009639", textColor: "#fff" },
]

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  angularVel: number
  width: number
  height: number
  skill: typeof skills[0]
  isDragging: boolean
}

// Simple physics constants
const GRAVITY = 0.5
const FRICTION = 0.985
const ANGULAR_FRICTION = 0.98
const BOUNCE = 0.7
const GROUND_Y_OFFSET = 120 // Distance from bottom

export default function SkillsPhysics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number; lastX: number; lastY: number } | null>(null)
  
  const [isVisible, setIsVisible] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  // Initialize particles when section becomes active
  useEffect(() => {
    if (!isActive || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    
    const newParticles: Particle[] = skills.map((skill, index) => ({
      id: index,
      x: centerX + (Math.random() - 0.5) * 400,
      y: -100 - index * 60 - Math.random() * 50,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2,
      rotation: (Math.random() - 0.5) * 30,
      angularVel: (Math.random() - 0.5) * 3,
      width: skill.name.length * 12 + 48,
      height: 44,
      skill,
      isDragging: false,
    }))
    
    particlesRef.current = newParticles
    setParticles(newParticles)
  }, [isActive])

  // Physics simulation loop
  useEffect(() => {
    if (!isActive || !canvasRef.current) return

    const simulate = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      const groundY = rect.height - GROUND_Y_OFFSET
      const leftWall = 20
      const rightWall = rect.width - 20

      particlesRef.current = particlesRef.current.map(p => {
        if (p.isDragging) return p

        // Apply gravity
        let newVy = p.vy + GRAVITY
        let newVx = p.vx * FRICTION
        newVy *= FRICTION
        
        // Apply angular friction
        let newAngularVel = p.angularVel * ANGULAR_FRICTION
        
        // Update position
        let newX = p.x + newVx
        let newY = p.y + newVy
        let newRotation = p.rotation + newAngularVel
        
        // Ground collision
        if (newY + p.height / 2 > groundY) {
          newY = groundY - p.height / 2
          newVy = -newVy * BOUNCE
          newVx *= 0.9
          newAngularVel = newVx * 0.3
          
          // Stop if moving very slowly
          if (Math.abs(newVy) < 0.5) newVy = 0
        }
        
        // Wall collisions
        if (newX - p.width / 2 < leftWall) {
          newX = leftWall + p.width / 2
          newVx = -newVx * BOUNCE
          newAngularVel = -newVy * 0.2
        }
        if (newX + p.width / 2 > rightWall) {
          newX = rightWall - p.width / 2
          newVx = -newVx * BOUNCE
          newAngularVel = newVy * 0.2
        }
        
        // Ceiling
        if (newY - p.height / 2 < 0) {
          newY = p.height / 2
          newVy = Math.abs(newVy) * BOUNCE
        }
        
        // Reset if out of bounds
        if (newY > rect.height + 200 || newX < -200 || newX > rect.width + 200) {
          newX = rect.width / 2 + (Math.random() - 0.5) * 300
          newY = -50
          newVx = 0
          newVy = 0
        }

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
          angularVel: newAngularVel,
        }
      })

      // Collision detection between particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          
          if (p1.isDragging || p2.isDragging) continue
          
          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minDist = (p1.width + p2.width) / 3
          
          if (dist < minDist && dist > 0) {
            // Push apart
            const overlap = (minDist - dist) / 2
            const nx = dx / dist
            const ny = dy / dist
            
            particlesRef.current[i] = {
              ...p1,
              x: p1.x - nx * overlap,
              y: p1.y - ny * overlap,
              vx: p1.vx - nx * 2,
              vy: p1.vy - ny * 2,
              angularVel: p1.angularVel + (Math.random() - 0.5) * 2,
            }
            particlesRef.current[j] = {
              ...p2,
              x: p2.x + nx * overlap,
              y: p2.y + ny * overlap,
              vx: p2.vx + nx * 2,
              vy: p2.vy + ny * 2,
              angularVel: p2.angularVel + (Math.random() - 0.5) * 2,
            }
          }
        }
      }

      setParticles([...particlesRef.current])
      animationRef.current = requestAnimationFrame(simulate)
    }

    animationRef.current = requestAnimationFrame(simulate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  // Intersection observer for visibility
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTimeout(() => setIsActive(true), 500)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, particleId: number) => {
    e.preventDefault()
    const particle = particlesRef.current.find(p => p.id === particleId)
    if (!particle) return
    
    dragRef.current = {
      id: particleId,
      offsetX: e.clientX - particle.x,
      offsetY: e.clientY - particle.y,
      lastX: e.clientX,
      lastY: e.clientY,
    }
    
    particlesRef.current = particlesRef.current.map(p => 
      p.id === particleId ? { ...p, isDragging: true, vx: 0, vy: 0 } : p
    )
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left
    const newY = e.clientY - rect.top
    
    particlesRef.current = particlesRef.current.map(p => {
      if (p.id === dragRef.current?.id) {
        return {
          ...p,
          x: newX,
          y: newY,
        }
      }
      return p
    })
    
    dragRef.current.lastX = e.clientX
    dragRef.current.lastY = e.clientY
  }, [])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return
    
    const vx = (e.clientX - dragRef.current.lastX) * 0.5
    const vy = (e.clientY - dragRef.current.lastY) * 0.5
    
    // Apply throw velocity
    const throwMultiplier = Math.min(Math.sqrt(vx * vx + vy * vy) * 0.5, 15)
    
    particlesRef.current = particlesRef.current.map(p => {
      if (p.id === dragRef.current?.id) {
        return {
          ...p,
          isDragging: false,
          vx: vx * throwMultiplier,
          vy: vy * throwMultiplier,
          angularVel: vx * 0.5,
        }
      }
      return p
    })
    
    dragRef.current = null
  }, [])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent, particleId: number) => {
    e.preventDefault()
    const touch = e.touches[0]
    const particle = particlesRef.current.find(p => p.id === particleId)
    if (!particle || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    
    dragRef.current = {
      id: particleId,
      offsetX: touch.clientX - rect.left - particle.x,
      offsetY: touch.clientY - rect.top - particle.y,
      lastX: touch.clientX,
      lastY: touch.clientY,
    }
    
    particlesRef.current = particlesRef.current.map(p => 
      p.id === particleId ? { ...p, isDragging: true, vx: 0, vy: 0 } : p
    )
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragRef.current || !canvasRef.current) return
    
    const touch = e.touches[0]
    const rect = canvasRef.current.getBoundingClientRect()
    const newX = touch.clientX - rect.left
    const newY = touch.clientY - rect.top
    
    particlesRef.current = particlesRef.current.map(p => {
      if (p.id === dragRef.current?.id) {
        return { ...p, x: newX, y: newY }
      }
      return p
    })
    
    dragRef.current.lastX = touch.clientX
    dragRef.current.lastY = touch.clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragRef.current) return
    
    const touch = e.changedTouches[0]
    const vx = (touch.clientX - dragRef.current.lastX) * 0.3
    const vy = (touch.clientY - dragRef.current.lastY) * 0.3
    
    const throwMultiplier = Math.min(Math.sqrt(vx * vx + vy * vy) * 0.8, 20)
    
    particlesRef.current = particlesRef.current.map(p => {
      if (p.id === dragRef.current?.id) {
        return {
          ...p,
          isDragging: false,
          vx: vx * throwMultiplier,
          vy: vy * throwMultiplier,
          angularVel: vx * 0.5,
        }
      }
      return p
    })
    
    dragRef.current = null
  }, [])

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen py-24 px-6 overflow-hidden"
    >
      {/* Header */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8">
          <h2 
            className={cn(
              "font-mono text-3xl md:text-5xl font-bold transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <span className="text-primary">02.</span> Skills
          </h2>
          <div 
            className={cn(
              "h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 transition-all duration-1000 delay-300",
              isVisible ? "w-32 opacity-100" : "w-0 opacity-0"
            )}
          />
          <p 
            className={cn(
              "text-muted-foreground mt-6 text-lg transition-all duration-700 delay-200",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Drag, throw, and play with my skills!
          </p>
        </div>
      </div>
      
      {/* Physics Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 top-40 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={cn(
              "absolute select-none cursor-grab active:cursor-grabbing",
              "rounded-full px-5 py-2.5 font-semibold text-sm shadow-lg",
              "transition-shadow duration-200 hover:shadow-xl",
              "border border-white/20"
            )}
            style={{
              left: particle.x - particle.width / 2,
              top: particle.y - particle.height / 2,
              width: particle.width,
              height: particle.height,
              backgroundColor: particle.skill.color,
              color: particle.skill.textColor,
              transform: `rotate(${particle.rotation}deg)`,
              zIndex: particle.isDragging ? 100 : 10,
              boxShadow: particle.isDragging 
                ? `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${particle.skill.color}50`
                : `0 4px 12px rgba(0,0,0,0.2)`,
            }}
            onMouseDown={(e) => handleMouseDown(e, particle.id)}
            onTouchStart={(e) => handleTouchStart(e, particle.id)}
          >
            <span className="flex items-center justify-center h-full whitespace-nowrap">
              {particle.skill.name}
            </span>
          </div>
        ))}
        
        {/* Ground indicator */}
        <div 
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          style={{ bottom: GROUND_Y_OFFSET }}
        />
      </div>
      
      {/* Hint */}
      <div 
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 text-center transition-all duration-700 delay-1000",
          isVisible ? "opacity-60" : "opacity-0"
        )}
      >
        <p className="text-sm text-muted-foreground">
          Click and drag to interact
        </p>
      </div>
    </section>
  )
}
