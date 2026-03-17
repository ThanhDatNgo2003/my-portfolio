"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import ScrollReveal, { LineReveal } from "@/components/scroll-reveal"

const projects = [
  {
    title: "Cloud Infrastructure Dashboard",
    description: "A comprehensive monitoring dashboard for managing multi-cloud infrastructure with real-time metrics and alerting.",
    image: "/project-1.jpg",
    tags: ["Next.js", "Docker", "PostgreSQL", "Redis"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "DevOps Automation Toolkit",
    description: "CLI tool for automating deployment pipelines, server provisioning, and container orchestration workflows.",
    image: "/project-2.jpg",
    tags: ["Node.js", "Linux", "Bash", "Kubernetes"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "IoT Home Server",
    description: "Self-hosted home automation server running on Raspberry Pi with custom sensors and mobile app integration.",
    image: "/project-3.jpg",
    tags: ["Raspberry Pi", "React", "MQTT", "Python"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
]

function ProjectCard3D({
  project,
  index,
  isVisible,
  mousePos,
}: {
  project: (typeof projects)[0]
  index: number
  isVisible: boolean
  mousePos: { x: number; y: number }
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    // Calculate rotation based on distance from center (max 25 degrees)
    const rotateY = (x / centerX) * 25
    const rotateX = -(y / centerY) * 25

    setRotation({ x: rotateX, y: rotateY })
    setLocalMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative h-full transition-all duration-700 cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* 3D Container with perspective */}
      <div
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main card face with 3D depth layers */}
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden transition-all duration-300",
              "bg-gradient-to-br from-muted/80 to-background/80 backdrop-blur-xl",
              "border border-primary/20 hover:border-primary/50",
              isHovered && "shadow-2xl"
            )}
            style={{
              boxShadow: isHovered
                ? "0 30px 60px -15px rgba(0, 217, 255, 0.35), 0 0 0 1px rgba(0, 217, 255, 0.25)"
                : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
              transform: "translateZ(18px)",
            }}
          >
            {/* Spotlight effect */}
            {isHovered && (
              <div
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at ${localMouse.x}px ${localMouse.y}px, rgba(0, 217, 255, 0.2), transparent 40%)`,
                }}
              />
            )}

            {/* Image section with parallax on hover */}
            <div className="relative h-56 overflow-hidden bg-muted">
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 z-10 transition-opacity duration-500",
                  isHovered ? "opacity-20" : "opacity-50"
                )}
              />
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />

              {/* Action buttons - floating on hover */}
              <div
                className={cn(
                  "absolute top-4 right-4 z-20 flex gap-2 transition-all duration-300",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                )}
              >
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-background/90 backdrop-blur-sm hover:bg-primary/30 text-primary transition-all duration-300 hover:scale-110 shadow-lg"
                  data-magnetic
                >
                  <Github className="w-5 h-5" />
                </Link>
                <Link
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-background/90 backdrop-blur-sm hover:bg-secondary/30 text-secondary transition-all duration-300 hover:scale-110 shadow-lg"
                  data-magnetic
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Content section */}
            <div className="p-6 space-y-4">
              {/* Animated top border */}
              <div
                className={cn(
                  "absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500",
                  isHovered ? "opacity-100" : "opacity-30"
                )}
              />

              {/* Title */}
              <h3
                className={cn(
                  "font-mono text-xl font-bold transition-all duration-300",
                  isHovered ? "text-primary translate-x-1" : "text-foreground"
                )}
              >
                {project.title}
              </h3>

              {/* Description */}
              <p
                className={cn(
                  "text-sm leading-relaxed transition-colors duration-300 line-clamp-2",
                  isHovered ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {project.description}
              </p>

              {/* Tags with staggered animation */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className={cn(
                      "text-xs px-2.5 py-1 rounded-lg font-mono border transition-all duration-300",
                      isHovered
                        ? "text-primary/90 border-primary/50 bg-primary/10"
                        : "text-muted-foreground border-border/50 bg-muted/50"
                    )}
                    style={{
                      transitionDelay: isHovered ? `${tagIndex * 40}ms` : "0ms",
                      transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* === Physical thickness edges === */}
          {/* Back face */}
          <div
            className="absolute inset-0 rounded-2xl bg-muted/60 border border-primary/20"
            style={{ transform: "translateZ(-18px)" }}
          />

          {/* Top edge */}
          <div
            className="absolute left-3 right-3 bg-gradient-to-b from-primary/20 to-muted/40"
            style={{
              top: 0,
              height: 18,
              transform: "rotateX(90deg)",
              transformOrigin: "top center",
              borderRadius: "12px 12px 0 0",
            }}
          />

          {/* Bottom edge */}
          <div
            className="absolute left-3 right-3 bg-gradient-to-t from-primary/20 to-muted/40"
            style={{
              bottom: 0,
              height: 18,
              transform: "rotateX(-90deg)",
              transformOrigin: "bottom center",
              borderRadius: "0 0 12px 12px",
            }}
          />

          {/* Left edge */}
          <div
            className="absolute top-3 bottom-3 bg-gradient-to-r from-primary/20 to-muted/40"
            style={{
              left: 0,
              width: 18,
              transform: "rotateY(-90deg)",
              transformOrigin: "left center",
              borderRadius: "12px 0 0 12px",
            }}
          />

          {/* Right edge */}
          <div
            className="absolute top-3 bottom-3 bg-gradient-to-l from-primary/20 to-muted/40"
            style={{
              right: 0,
              width: 18,
              transform: "rotateY(90deg)",
              transformOrigin: "right center",
              borderRadius: "0 12px 12px 0",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Projects3DEnhanced() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      id="projects"
      ref={ref}
      className={cn(
        "py-24 md:py-32 px-6 relative overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Background with cursor-linked gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `
              radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 217, 255, 0.15), transparent 50%)
            `,
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <ScrollReveal direction="down" duration={1000}>
            <h2 className="font-mono text-4xl md:text-5xl font-bold">
              <span className="text-primary">03.</span> Featured Projects
            </h2>
          </ScrollReveal>
          <div className="flex justify-center mt-6">
            <LineReveal 
              direction="center" 
              delay={300} 
              duration={1000} 
              className="w-40" 
            />
          </div>
        </div>

        {/* 3D Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 perspective">
          {projects.map((project, index) => (
            <ProjectCard3D
              key={project.title}
              project={project}
              index={index}
              isVisible={isVisible}
              mousePos={mousePos}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal direction="up" delay={400} duration={800}>
          <div className="text-center mt-16">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-primary hover:text-primary/80 transition-colors group"
              data-magnetic
            >
              <span>Explore more projects</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
