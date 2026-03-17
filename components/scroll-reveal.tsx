"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  threshold?: number
  once?: boolean
  stagger?: boolean
  staggerDelay?: number
}

export default function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 800,
  distance = 60,
  threshold = 0.1,
  once = true,
  stagger = false,
  staggerDelay = 100,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, once])

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)"
    
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`
      case "down":
        return `translate3d(0, -${distance}px, 0)`
      case "left":
        return `translate3d(${distance}px, 0, 0)`
      case "right":
        return `translate3d(-${distance}px, 0, 0)`
      case "scale":
        return "scale(0.8)"
      case "fade":
      default:
        return "translate3d(0, 0, 0)"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Stagger container for multiple reveals
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  direction?: RevealDirection
  threshold?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  direction = "up",
  threshold = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <ScrollReveal
              key={index}
              direction={direction}
              delay={isVisible ? index * staggerDelay : 0}
              duration={700}
            >
              {child}
            </ScrollReveal>
          ))
        : children}
    </div>
  )
}

// Text reveal animation (word by word)
interface TextRevealProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  staggerDelay?: number
}

export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  staggerDelay = 50,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const words = text.split(" ")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            "inline-block overflow-hidden mr-[0.25em]",
            wordClassName
          )}
        >
          <span
            className="inline-block will-change-transform"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              opacity: isVisible ? 1 : 0,
              transition: `transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + index * staggerDelay}ms, opacity 600ms ease ${delay + index * staggerDelay}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  )
}

// Character reveal animation
interface CharRevealProps {
  text: string
  className?: string
  charClassName?: string
  delay?: number
  staggerDelay?: number
}

export function CharReveal({
  text,
  className,
  charClassName,
  delay = 0,
  staggerDelay = 30,
}: CharRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const chars = text.split("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {chars.map((char, index) => (
        <span
          key={index}
          className={cn("inline-block will-change-transform", charClassName)}
          style={{
            transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(40px) rotateX(-90deg)",
            opacity: isVisible ? 1 : 0,
            transition: `transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + index * staggerDelay}ms, opacity 400ms ease ${delay + index * staggerDelay}ms`,
            transformOrigin: "center bottom",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  )
}

// Line reveal (for underlines, borders)
interface LineRevealProps {
  className?: string
  direction?: "left" | "right" | "center"
  delay?: number
  duration?: number
  color?: string
}

export function LineReveal({
  className,
  direction = "center",
  delay = 0,
  duration = 800,
  color = "var(--primary)",
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const getOrigin = () => {
    switch (direction) {
      case "left":
        return "left center"
      case "right":
        return "right center"
      default:
        return "center center"
    }
  }

  return (
    <div
      ref={ref}
      className={cn("h-[2px]", className)}
      style={{
        backgroundColor: color,
        transform: isVisible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: getOrigin(),
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    />
  )
}
