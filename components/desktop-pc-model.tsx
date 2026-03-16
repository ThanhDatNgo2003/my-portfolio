"use client"

import { useRef, useState, Suspense, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

function DesktopPC({ scrollRotation }: { scrollRotation: number }) {
  const { scene } = useGLTF("/models/desktop_pc.glb")
  const modelRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (modelRef.current) {
      const elapsed = state.clock.getElapsedTime()
      
      // Idle floating animation
      modelRef.current.position.y = Math.sin(elapsed * 0.8) * 0.1
      
      // Smooth rotation based on scroll
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        scrollRotation,
        0.08
      )
    }
  })

  return (
    <group ref={modelRef} dispose={null}>
      <primitive 
        object={scene} 
        scale={1.2}
        position={[0, -1.2, 0]}
        rotation={[0, -0.5, 0]}
      />
    </group>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#00D9FF" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#7C3AED" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#FFFFFF"
      />
    </>
  )
}

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime()
      meshRef.current.rotation.y = elapsed
      meshRef.current.rotation.x = elapsed * 0.5
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#00D9FF" 
        wireframe 
        transparent 
        opacity={0.5}
      />
    </mesh>
  )
}

export default function DesktopPCModel({ isVisible }: { isVisible: boolean }) {
  const [scrollRotation, setScrollRotation] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how far through the viewport the element is
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2
      const distanceFromCenter = elementCenter - viewportCenter
      
      // Normalize to a rotation value (-1 to 1 range, then scale)
      const normalizedPosition = distanceFromCenter / windowHeight
      const rotation = normalizedPosition * Math.PI * 0.8 // Rotate up to ~72 degrees each way
      
      setScrollRotation(-rotation)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto md:mx-0 w-80 h-80 md:w-[450px] md:h-[450px] rounded-2xl overflow-hidden transition-all duration-700 delay-200 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      }`}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Lighting />
          <DesktopPC scrollRotation={scrollRotation} />
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload the model
useGLTF.preload("/models/desktop_pc.glb")
