"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"

export default function Footer() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })

  const scrollToTop = () => {
    const lenis = (window as any).__lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 2 })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <footer
      ref={ref}
      className={cn(
        "py-12 px-6 border-t border-border/30 relative transition-all duration-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="font-mono text-2xl font-bold">
            <span className="text-primary">DAT</span>
            <span className="text-muted-foreground">.</span>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground font-mono text-sm text-center">
            Designed & Built by{" "}
            <span className="text-primary hover:text-primary/80 transition-colors">
              Nguyen Thanh Dat
            </span>{" "}
            &copy; {new Date().getFullYear()}
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
            aria-label="Back to top"
            data-magnetic
          >
            <span>Back to top</span>
            <div className="p-2 rounded-full border border-current group-hover:border-primary group-hover:bg-primary/10 transition-all">
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}
