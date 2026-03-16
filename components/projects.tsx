"use client"

import Image from "next/image"
import { Github, ExternalLink, Folder } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

const projects = [
  {
    title: "Cloud Infrastructure Dashboard",
    description:
      "A comprehensive monitoring dashboard for managing multi-cloud infrastructure with real-time metrics and alerting.",
    image: "/project-1.jpg",
    tags: ["Next.js", "Docker", "PostgreSQL", "Redis"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "DevOps Automation Toolkit",
    description:
      "CLI tool for automating deployment pipelines, server provisioning, and container orchestration workflows.",
    image: "/project-2.jpg",
    tags: ["Node.js", "Linux", "Bash", "Kubernetes"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "IoT Home Server",
    description:
      "Self-hosted home automation server running on Raspberry Pi with custom sensors and mobile app integration.",
    image: "/project-3.jpg",
    tags: ["Raspberry Pi", "React", "MQTT", "Python"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
]

function ProjectCard({ 
  project, 
  index, 
  isVisible 
}: { 
  project: typeof projects[0]
  index: number
  isVisible: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * 15
    const tiltY = (x - 0.5) * -15
    setTilt({ x: tiltX, y: tiltY })
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative group transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      )}
      style={{ 
        transitionDelay: `${index * 200}ms`,
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="glass-card rounded-2xl overflow-hidden"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? "scale(1.02)" : "scale(1)"}`,
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(0, 217, 255, 0.25), 0 0 0 1px rgba(0, 217, 255, 0.1)"
            : "none",
        }}
      >
        {/* Spotlight effect */}
        {isHovered && (
          <div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 217, 255, 0.15), transparent 40%)`,
            }}
          />
        )}

        {/* Project Image */}
        <div className="relative h-56 overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 z-10 transition-all duration-500",
            isHovered ? "opacity-20" : "opacity-50"
          )} />
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isHovered ? "scale-110 brightness-110" : "scale-100"
            )}
          />
          
          {/* Floating folder icon */}
          <div 
            className={cn(
              "absolute top-4 left-4 z-20 p-3 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300",
              isHovered ? "scale-110 bg-primary/20" : ""
            )}
          >
            <Folder className={cn(
              "w-6 h-6 transition-colors",
              isHovered ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          {/* Links overlay */}
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
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/20 hover:text-primary transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/20 hover:text-primary transition-all"
              aria-label="Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6 space-y-4 relative">
          {/* Animated line */}
          <div 
            className={cn(
              "absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500",
              isHovered ? "opacity-100" : "opacity-30"
            )}
          />

          <h3 className={cn(
            "font-mono text-xl font-semibold transition-all duration-300",
            isHovered ? "text-primary" : "text-foreground"
          )}>
            {project.title}
          </h3>

          <p className={cn(
            "text-sm leading-relaxed transition-colors duration-300",
            isHovered ? "text-foreground" : "text-muted-foreground"
          )}>
            {project.description}
          </p>

          {/* Tech Tags with stagger animation */}
          <div className="flex flex-wrap gap-2 pt-4">
            {project.tags.map((tag, tagIndex) => (
              <span
                key={tag}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono rounded-lg border transition-all duration-300",
                  isHovered 
                    ? "text-primary border-primary/50 bg-primary/10 translate-y-0" 
                    : "text-muted-foreground border-border/50 bg-muted/30 translate-y-1"
                )}
                style={{ 
                  transitionDelay: isHovered ? `${tagIndex * 50}ms` : "0ms",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
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
      {/* Animated background grid */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 217, 255, 0.3) 0%, transparent 50%),
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Section title */}
        <div className="relative mb-16 text-center">
          <h2 
            className={cn(
              "font-mono text-3xl md:text-5xl font-bold transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <span className="text-primary">02.</span> Featured Projects
          </h2>
          <div 
            className={cn(
              "h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mt-4 transition-all duration-1000 delay-300",
              isVisible ? "w-32 opacity-100" : "w-0 opacity-0"
            )}
          />
          <p 
            className={cn(
              "text-muted-foreground mt-6 max-w-xl mx-auto transition-all duration-700 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            A selection of projects I&apos;ve worked on, showcasing my skills in full-stack development and DevOps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* View more link */}
        <div 
          className={cn(
            "text-center mt-12 transition-all duration-700 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:text-primary/80 transition-colors group"
            data-magnetic
          >
            <span>View more on GitHub</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
