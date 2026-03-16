"use client"

import { Mail, Github, Linkedin, ArrowUpRight, Send } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

const contactLinks = [
  {
    name: "Email",
    icon: Mail,
    href: "mailto:dat@example.com",
    label: "Send an email",
    color: "#00D9FF",
    description: "Drop me a line",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com",
    label: "View GitHub profile",
    color: "#FFFFFF",
    description: "Check my code",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "Connect on LinkedIn",
    color: "#0A66C2",
    description: "Let's connect",
  },
]

function ContactCard({ 
  link, 
  index, 
  isVisible 
}: { 
  link: typeof contactLinks[0]
  index: number
  isVisible: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setTilt({ x: y * 15, y: -x * 15 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <Link
      ref={cardRef}
      href={link.href}
      target={link.href.startsWith("mailto") ? undefined : "_blank"}
      rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
      className={cn(
        "group relative flex flex-col items-center gap-4 p-8 glass-card rounded-2xl transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ 
        transitionDelay: `${300 + index * 150}ms`,
        transform: `perspective(500px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? "scale(1.05)" : "scale(1)"}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      aria-label={link.label}
      data-magnetic
    >
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-500 -z-10",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: `radial-gradient(circle at center, ${link.color}20 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Icon container */}
      <div 
        className={cn(
          "relative p-4 rounded-full transition-all duration-500",
          isHovered ? "bg-primary/10" : "bg-muted/50"
        )}
      >
        <link.icon 
          className={cn(
            "w-8 h-8 transition-all duration-500",
            isHovered ? "scale-110" : ""
          )}
          style={{ color: isHovered ? link.color : undefined }}
        />
        
        {/* Ripple effect */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: `${link.color}20` }}
          />
        )}
      </div>

      {/* Text */}
      <div className="text-center">
        <span className={cn(
          "font-mono text-lg font-medium block mb-1 transition-colors duration-300",
          isHovered ? "text-foreground" : "text-muted-foreground"
        )}>
          {link.name}
        </span>
        <span className={cn(
          "text-sm transition-all duration-300",
          isHovered ? "text-primary opacity-100" : "text-muted-foreground/70 opacity-0"
        )}>
          {link.description}
        </span>
      </div>

      {/* Arrow icon */}
      <ArrowUpRight 
        className={cn(
          "absolute top-4 right-4 w-5 h-5 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0 -translate-y-0" : "opacity-0 -translate-x-2 translate-y-2"
        )}
        style={{ color: link.color }}
      />
    </Link>
  )
}

export default function Contact() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <section
      id="contact"
      ref={ref}
      className={cn(
        "py-24 md:py-32 px-6 relative overflow-hidden transition-all duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="container mx-auto max-w-3xl text-center">
        {/* Section title */}
        <div className="relative mb-8">
          <h2 
            className={cn(
              "font-mono text-3xl md:text-5xl font-bold transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <span className="text-primary">03.</span> Get In Touch
          </h2>
          <div 
            className={cn(
              "h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 transition-all duration-1000 delay-300",
              isVisible ? "w-32 opacity-100" : "w-0 opacity-0"
            )}
          />
        </div>

        <p 
          className={cn(
            "text-muted-foreground text-lg md:text-xl mb-12 max-w-lg mx-auto transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          I&apos;m always open to discussing new projects, opportunities, or just 
          having a chat about technology. Feel free to reach out!
        </p>

        {/* Contact cards */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          {contactLinks.map((link, index) => (
            <ContactCard
              key={link.name}
              link={link}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div 
          className={cn(
            "transition-all duration-700 delay-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link
            href="mailto:dat@example.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-mono rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 group"
            data-magnetic
          >
            <Send className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
            <span>Say Hello</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
