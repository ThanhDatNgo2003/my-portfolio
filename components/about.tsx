"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

const techStack = [
  { name: "Next.js", color: "bg-foreground/10 text-foreground border-foreground/30", icon: "N" },
  { name: "React", color: "bg-[#61DAFB]/20 text-[#61DAFB] border-[#61DAFB]/30", icon: "R" },
  { name: "Docker", color: "bg-[#2496ED]/20 text-[#2496ED] border-[#2496ED]/30", icon: "D" },
  { name: "Linux", color: "bg-[#FCC624]/20 text-[#FCC624] border-[#FCC624]/30", icon: "L" },
  { name: "PostgreSQL", color: "bg-[#4169E1]/20 text-[#4169E1] border-[#4169E1]/30", icon: "P" },
  { name: "Node.js", color: "bg-[#339933]/20 text-[#339933] border-[#339933]/30", icon: "N" },
  { name: "Raspberry Pi", color: "bg-[#A22846]/20 text-[#A22846] border-[#A22846]/30", icon: "R" },
]

// Interactive tech badge with light effect on hover
function TechBadge({ 
  tech, 
  index, 
  isVisible 
}: { 
  tech: typeof techStack[0]
  index: number
  isVisible: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const badgeRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!badgeRef.current) return
    const rect = badgeRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  return (
    <div
      ref={badgeRef}
      className={cn(
        "tech-badge relative px-5 py-3 rounded-xl text-sm font-mono border cursor-pointer overflow-hidden transition-opacity duration-500",
        tech.color,
        isVisible ? "opacity-100" : "opacity-0",
        isHovered && "scale-105 z-10"
      )}
      style={{ 
        transitionDelay: isVisible ? `${600 + index * 100}ms` : '0ms',
        transition: 'opacity 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered 
          ? `0 0 20px rgba(0, 217, 255, 0.4), 0 0 40px rgba(0, 217, 255, 0.2), inset 0 0 20px rgba(0, 217, 255, 0.1)` 
          : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Light effect following cursor */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(0, 217, 255, 0.3) 0%, transparent 60%)`
            : 'transparent',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <span className="relative z-10">{tech.name}</span>
    </div>
  )
}

// Animated profile card with 3D effect
function ProfileCard({ isVisible }: { isVisible: boolean }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setRotation({ x: y * 15, y: -x * 15 })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative mx-auto md:mx-0 transition-all duration-700 delay-200",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
    >
      <div 
        className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden glass-card group"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.1s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Gradient overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 z-10 transition-opacity duration-500",
            isHovered ? "opacity-60" : "opacity-40"
          )}
        />
        
        {/* Shine effect */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + rotation.y * 3}% ${50 - rotation.x * 3}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
          }}
        />
        
        <Image
          src="/profile-placeholder.jpg"
          alt="Nguyen Thanh Dat"
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110 brightness-110" : "scale-100 opacity-90"
          )}
        />
        
        {/* Floating particles inside card */}
        {isHovered && (
          <>
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping z-30" />
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-secondary rounded-full animate-ping z-30" style={{ animationDelay: "0.5s" }} />
          </>
        )}
      </div>
      
      {/* Decorative border with animation */}
      <div 
        className={cn(
          "absolute -bottom-4 -right-4 w-full h-full border-2 rounded-2xl -z-10 transition-all duration-500",
          isHovered ? "border-primary/60 -bottom-6 -right-6" : "border-primary/30"
        )}
      />
      
      {/* Glow effect */}
      {isHovered && (
        <div className="absolute inset-0 -z-20 blur-3xl bg-gradient-to-br from-primary/20 to-secondary/20" />
      )}
    </div>
  )
}

// Animated counter for stats
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const statRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.5 }
    )

    if (statRef.current) observer.observe(statRef.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div 
      ref={statRef}
      className={cn(
        "text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="font-mono text-3xl md:text-4xl font-bold text-primary mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default function About() {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about")
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        "py-24 md:py-32 px-6 relative overflow-hidden transition-all duration-1000",
        sectionVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Parallax background elements */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"
        style={{ transform: `translateY(${scrollProgress * 100}px)` }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"
        style={{ transform: `translateY(${-scrollProgress * 80}px)` }}
      />

      <div className="container mx-auto max-w-6xl">
        {/* Section title with animated underline */}
        <div className="relative mb-16 text-center">
          <h2 
            className={cn(
              "font-mono text-3xl md:text-5xl font-bold transition-all duration-700",
              sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <span className="text-primary">01.</span> About Me
          </h2>
          <div 
            className={cn(
              "h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 transition-all duration-1000 delay-300",
              sectionVisible ? "w-32 opacity-100" : "w-0 opacity-0"
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Profile Image with 3D effect */}
          <ProfileCard isVisible={sectionVisible} />

          {/* Bio Content */}
          <div
            ref={contentRef}
            className={cn(
              "space-y-6 transition-all duration-1000 delay-400",
              contentVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              Hi! I&apos;m <span className="text-primary font-semibold">Dat</span>, a passionate full-stack developer and DevOps engineer 
              based in Vietnam. I specialize in building robust web applications 
              and managing cloud infrastructure that scales.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My journey in tech started with tinkering on Raspberry Pi projects 
              and has evolved into designing and deploying production-grade systems. 
              I believe in writing clean, maintainable code and automating everything 
              that can be automated.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me exploring new technologies, 
              contributing to open-source projects, or optimizing server configurations.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/50">
              <AnimatedStat value="3+" label="Years Experience" delay={0} />
              <AnimatedStat value="20+" label="Projects" delay={200} />
              <AnimatedStat value="10+" label="Technologies" delay={400} />
            </div>

            {/* Tech Stack */}
            <div className="pt-4">
              <h3 className="font-mono text-sm text-primary mb-6 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-px bg-primary" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <TechBadge
                    key={tech.name}
                    tech={tech}
                    index={index}
                    isVisible={contentVisible}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
