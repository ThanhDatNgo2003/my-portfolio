"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

function DesktopPC({ isHovered }: { isHovered: boolean }) {
  const { scene } = useGLTF("/models/desktop_pc.glb")
  const modelRef = useRef<THREE.Group>(null)
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    if (modelRef.current) {
      const elapsed = state.clock.getElapsedTime()
      
      // Idle floating animation
      modelRef.current.position.y = Math.sin(elapsed * 0.8) * 0.1
      
      // Gentle idle rotation when not hovered
      if (!isHovered) {
        targetRotation.current.y = Math.sin(elapsed * 0.3) * 0.15
      }
      
      // Smooth rotation interpolation
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        targetRotation.current.y,
        0.05
      )
      
      // Scale effect on hover
      const targetScale = isHovered ? 1.05 : 1
      modelRef.current.scale.x = THREE.MathUtils.lerp(modelRef.current.scale.x, targetScale, 0.1)
      modelRef.current.scale.y = THREE.MathUtils.lerp(modelRef.current.scale.y, targetScale, 0.1)
      modelRef.current.scale.z = THREE.MathUtils.lerp(modelRef.current.scale.z, targetScale, 0.1)
    }
  })

  return (
    <group ref={modelRef} dispose={null}>
      <primitive 
        object={scene} 
        scale={0.75}
        position={[0, -1.5, 0]}
        rotation={[0, -0.5, 0]}
      />
    </group>
  )
}

function MouseTracker({ setTargetRotation }: { setTargetRotation: (rotation: { x: number; y: number }) => void }) {
  const { pointer } = useThree()
  
  useFrame(() => {
    setTargetRotation({
      x: pointer.y * 0.2,
      y: pointer.x * 0.4
    })
  })
  
  return null
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
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto md:mx-0 w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden transition-all duration-700 delay-200 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 rounded-2xl transition-opacity duration-500 ${
          isHovered ? "opacity-80" : "opacity-40"
        }`}
      />
      
      {/* Glass card border */}
      <div className="absolute inset-0 rounded-2xl border border-primary/20 backdrop-blur-sm" />
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Lighting />
          <DesktopPC isHovered={isHovered} />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      {/* Decorative corner elements */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-secondary/50 rounded-bl" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-secondary/50 rounded-br" />
      
      {/* Decorative offset border */}
      <div 
        className={`absolute -bottom-4 -right-4 w-full h-full border-2 rounded-2xl -z-10 transition-all duration-500 ${
          isHovered ? "border-primary/60 -bottom-6 -right-6" : "border-primary/30"
        }`}
      />
      
      {/* Hover glow */}
      {isHovered && (
        <div className="absolute inset-0 -z-20 blur-3xl bg-gradient-to-br from-primary/20 to-secondary/20" />
      )}
    </div>
  )
}

// Preload the model
useGLTF.preload("/models/desktop_pc.glb")
