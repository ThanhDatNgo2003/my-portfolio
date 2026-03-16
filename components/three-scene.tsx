"use client"

import { useRef, useMemo, Suspense, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Stars, useGLTF } from "@react-three/drei"
import * as THREE from "three"

// Enhanced Particle Field with scroll interaction
function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const count = 1000
  const mesh = useRef<THREE.Points>(null)
  const velocities = useRef(new Float32Array(count * 3))
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const cyanColor = new THREE.Color("#00D9FF")
    const purpleColor = new THREE.Color("#7C3AED")
    const whiteColor = new THREE.Color("#FFFFFF")
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 40
      positions[i3 + 1] = (Math.random() - 0.5) * 40
      positions[i3 + 2] = (Math.random() - 0.5) * 40
      
      velocities.current[i3] = (Math.random() - 0.5) * 0.02
      velocities.current[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities.current[i3 + 2] = (Math.random() - 0.5) * 0.02
      
      const rand = Math.random()
      const color = rand > 0.66 ? cyanColor : rand > 0.33 ? purpleColor : whiteColor
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [])
  
  useFrame((state) => {
    if (mesh.current) {
      const posArray = mesh.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count * 3; i += 3) {
        posArray[i] += velocities.current[i]
        posArray[i + 1] += velocities.current[i + 1]
        posArray[i + 2] += velocities.current[i + 2]
        
        // Wrap around boundaries
        if (posArray[i] > 20) posArray[i] = -20
        if (posArray[i] < -20) posArray[i] = 20
        if (posArray[i + 1] > 20) posArray[i + 1] = -20
        if (posArray[i + 1] < -20) posArray[i + 1] = 20
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true
      mesh.current.rotation.y += 0.0005
      mesh.current.rotation.z = scrollProgress * 0.5
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingGeometry({ position, color, speed = 1 }: { 
  position: [number, number, number]
  color: string
  speed?: number 
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
    if (mesh.current) {
      mesh.current.rotation.x = elapsed * 0.3 * speed
      mesh.current.rotation.y = elapsed * 0.2 * speed
      mesh.current.scale.x = 1 + Math.sin(elapsed * 2) * 0.2
      mesh.current.scale.y = 1 + Math.sin(elapsed * 2 + 1) * 0.2
      mesh.current.scale.z = 1 + Math.sin(elapsed * 2 + 2) * 0.2
    }
    
    if (light.current) {
      light.current.intensity = 0.5 + Math.sin(elapsed) * 0.3
    }
  })
  
  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={mesh} position={position}>
        <octahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight ref={light} intensity={0.5} color={color} distance={5} />
    </Float>
  )
}

function TorusKnot() {
  const mesh = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
    if (mesh.current) {
      mesh.current.rotation.x = elapsed * 0.1
      mesh.current.rotation.y = elapsed * 0.15
      mesh.current.position.z = Math.sin(elapsed * 0.5) * 2
    }
    
    if (light.current) {
      light.current.intensity = 0.8 + Math.sin(elapsed * 1.5) * 0.4
    }
  })
  
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} position={[3, -1, -2]}>
        <torusKnotGeometry args={[0.8, 0.2, 120, 20]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight ref={light} position={[0, 0, 0]} intensity={0.8} color="#00D9FF" distance={8} />
    </Float>
  )
}

function Icosahedron() {
  const mesh = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
    if (mesh.current) {
      mesh.current.rotation.x = elapsed * 0.08
      mesh.current.rotation.z = elapsed * 0.12
      mesh.current.position.y = Math.cos(elapsed * 0.6) * 1.5
    }
    
    if (light.current) {
      light.current.intensity = 0.6 + Math.cos(elapsed * 1.3) * 0.3
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={[-3.5, 1.5, -3]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.7}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight ref={light} position={[0, 0, 0]} intensity={0.6} color="#7C3AED" distance={8} />
    </Float>
  )
}

function MouseParallax({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    const { pointer } = state
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.8, 0.08)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.8 - scrollProgress * 8, 0.08)
    camera.position.z = 6 + scrollProgress * 4
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[15, 15, 15]} intensity={0.6} color="#00D9FF" />
      <pointLight position={[-15, -15, -15]} intensity={0.5} color="#7C3AED" />
      <pointLight position={[0, 20, 0]} intensity={0.3} color="#FFFFFF" />
      
      <ParticleField scrollProgress={scrollProgress} />
      <Stars 
        radius={100} 
        depth={100} 
        count={1500} 
        factor={3} 
        saturation={0.2} 
        fade 
        speed={0.3}
      />
      
      <FloatingGeometry position={[-2, 2, -2]} color="#00D9FF" speed={0.8} />
      <FloatingGeometry position={[2.5, -1.5, -1]} color="#7C3AED" speed={1.2} />
      <FloatingGeometry position={[0, 3, -4]} color="#00D9FF" speed={0.6} />
      <FloatingGeometry position={[-3, -2, -3]} color="#7C3AED" speed={1} />
      <FloatingGeometry position={[1.5, -3, -2.5]} color="#FFFFFF" speed={0.9} />
      
      <TorusKnot />
      <Icosahedron />
      
      <MouseParallax scrollProgress={scrollProgress} />
    </>
  )
}

export default function ThreeScene() {
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(scrolled)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, sortObjects: true }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
