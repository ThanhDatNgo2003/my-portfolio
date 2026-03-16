"use client"

import { useEffect } from "react"

export default function WarningSuppressor() {
  useEffect(() => {
    const originalWarn = console.warn
    const originalError = console.error
    
    const suppressedPatterns = [
      'THREE.Clock: This module has been deprecated',
      'THREE.THREE.Clock: This module has been deprecated',
      'using deprecated parameters for the initialization function',
    ]
    
    console.warn = (...args: unknown[]) => {
      const message = String(args[0])
      const shouldSuppress = suppressedPatterns.some(pattern => message.includes(pattern))
      if (!shouldSuppress) {
        originalWarn.apply(console, args)
      }
    }
    
    console.error = (...args: unknown[]) => {
      const message = String(args[0])
      const shouldSuppress = suppressedPatterns.some(pattern => message.includes(pattern))
      if (!shouldSuppress) {
        originalError.apply(console, args)
      }
    }
    
    return () => {
      console.warn = originalWarn
      console.error = originalError
    }
  }, [])
  
  return null
}
