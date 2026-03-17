"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "About", href: "about", number: "01" },
  { name: "Skills", href: "skills", number: "02" },
  { name: "Projects", href: "projects", number: "03" },
  { name: "Contact", href: "contact", number: "04" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [isVisible, setIsVisible] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      lastScrollY.current = currentScrollY
      
      setScrolled(currentScrollY > 50)
      
      // Calculate scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollProgress((currentScrollY / docHeight) * 100)
      }

      // Detect active section
      const sections = navLinks.map(link => document.getElementById(link.href))
      const scrollPosition = currentScrollY + window.innerHeight / 3

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(navLinks[index].href)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const lenis = (window as any).__lenis
      if (lenis) {
        lenis.scrollTo(element, { offset: -80 })
      } else {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const scrollToTop = () => {
    const lenis = (window as any).__lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/30 shadow-lg shadow-background/50"
          : "bg-transparent",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo with animation */}
        <button
          onClick={scrollToTop}
          className="group font-mono text-2xl font-bold relative"
          data-magnetic
        >
          <span className="text-primary group-hover:opacity-0 transition-opacity duration-300">
            DAT
          </span>
          <span className="text-muted-foreground group-hover:opacity-0 transition-opacity duration-300">
            .
          </span>
          {/* Hover state */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-text">
            DAT.
          </span>
          {/* Glow effect */}
          <span className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={cn(
                "relative px-4 py-2 font-mono text-sm transition-all duration-300 group",
                activeSection === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-magnetic
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Number prefix */}
              <span className={cn(
                "text-xs mr-1 transition-colors duration-300",
                activeSection === link.href ? "text-primary" : "text-primary/50"
              )}>
                {link.number}.
              </span>
              {link.name}
              
              {/* Underline indicator */}
              <span 
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300",
                  activeSection === link.href ? "w-full" : "w-0 group-hover:w-1/2"
                )}
              />
              
              {/* Background highlight */}
              <span 
                className={cn(
                  "absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity duration-300",
                  activeSection === link.href ? "opacity-100" : "group-hover:opacity-50"
                )}
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border/30">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  )
}
