"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Stars, Trail, MeshDistortMaterial, Sphere } from "@react-three/drei"
import { Physics, RigidBody, BallCollider, CuboidCollider } from "@react-three/rapier"
import * as THREE from "three"


// Floating physics orbs that react to mouse
function PhysicsOrbs({ scrollProgress }: { scrollProgress: number }) {
  const count = 15
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.4,
      color: i % 2 === 0 ? "#00D9FF" : "#7C3AED",
    }))
  }, [])

  return (
    <>
      {orbs.map((orb, i) => (
        <PhysicsOrb key={i} {...orb} index={i} scrollProgress={scrollProgress} />
      ))}
    </>
  )
}

function PhysicsOrb({
  position,
  scale,
  color,
  index,
  scrollProgress,
}: {
  position: [number, number, number]
  scale: number
  color: string
  index: number
  scrollProgress: number
}) {
  const ref = useRef<any>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  useFrame((state) => {
    if (ref.current && meshRef.current) {
      const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
      
      // Add floating motion
      const floatY = Math.sin(elapsed * 0.5 + index) * 0.5
      const floatX = Math.cos(elapsed * 0.3 + index) * 0.3
      
      // Apply gentle forces based on mouse position
      const force = {
        x: pointer.x * 0.02,
        y: pointer.y * 0.02 + floatY * 0.01,
        z: floatX * 0.01,
      }
      
      ref.current.applyImpulse(force, true)
      
      // Pulsing glow effect
      const pulseScale = scale * (1 + Math.sin(elapsed * 2 + index) * 0.1)
      meshRef.current.scale.setScalar(pulseScale)
    }
  })

  return (
    <RigidBody
      ref={ref}
      position={position}
      colliders={false}
      linearDamping={2}
      angularDamping={1}
      gravityScale={0.1}
    >
      <BallCollider args={[scale]} />
      <Trail
        width={2}
        length={6}
        color={color}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[scale, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Trail>
    </RigidBody>
  )
}

// Interactive wireframe sphere that follows mouse
function InteractiveSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
      
      // Smooth follow mouse
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        pointer.x * 3,
        0.05
      )
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        pointer.y * 3,
        0.05
      )
      
      meshRef.current.rotation.x = elapsed * 0.2
      meshRef.current.rotation.y = elapsed * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <icosahedronGeometry args={[2, 4]} />
      <meshStandardMaterial
        color="#00D9FF"
        emissive="#00D9FF"
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// DNA Helix made of particles
function DNAHelix({ scrollProgress }: { scrollProgress: number }) {
  const points1 = useRef<THREE.Points>(null)
  const points2 = useRef<THREE.Points>(null)
  const count = 100

  const [positions1, positions2] = useMemo(() => {
    const pos1 = new Float32Array(count * 3)
    const pos2 = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const t = i / count * Math.PI * 4
      const radius = 1.5
      const y = (i / count - 0.5) * 15
      
      pos1[i * 3] = Math.cos(t) * radius
      pos1[i * 3 + 1] = y
      pos1[i * 3 + 2] = Math.sin(t) * radius
      
      pos2[i * 3] = Math.cos(t + Math.PI) * radius
      pos2[i * 3 + 1] = y
      pos2[i * 3 + 2] = Math.sin(t + Math.PI) * radius
    }
    
    return [pos1, pos2]
  }, [])

  useFrame((state) => {
    if (points1.current && points2.current) {
      const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
      points1.current.rotation.y = elapsed * 0.2 + scrollProgress * 2
      points2.current.rotation.y = elapsed * 0.2 + scrollProgress * 2
    }
  })

  return (
    <group position={[6, 0, -5]}>
      <points ref={points1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions1}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#00D9FF" transparent opacity={0.8} />
      </points>
      <points ref={points2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions2}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#7C3AED" transparent opacity={0.8} />
      </points>
    </group>
  )
}

// Morphing blob
function MorphingBlob() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
      meshRef.current.rotation.x = elapsed * 0.1
      meshRef.current.rotation.y = elapsed * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[-5, 2, -3]}>
        <MeshDistortMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.9}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  )
}

// Enhanced particle field with wave motion
function WaveParticles({ scrollProgress }: { scrollProgress: number }) {
  const count = 2000
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const cyanColor = new THREE.Color("#00D9FF")
    const purpleColor = new THREE.Color("#7C3AED")
    const whiteColor = new THREE.Color("#FFFFFF")
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 50
      positions[i3 + 2] = (Math.random() - 0.5) * 30
      
      const rand = Math.random()
      const color = rand > 0.7 ? cyanColor : rand > 0.4 ? purpleColor : whiteColor
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
      const posArray = mesh.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = posArray[i3]
        const z = posArray[i3 + 2]
        
        // Wave effect
        posArray[i3 + 1] = Math.sin(x * 0.1 + elapsed) * Math.cos(z * 0.1 + elapsed) * 2
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true
      mesh.current.rotation.y = elapsed * 0.02
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Floating rings
function FloatingRings() {
  const rings = useMemo(() => [
    { position: [3, 4, -6] as [number, number, number], rotation: [0, 0, 0], color: "#00D9FF" },
    { position: [-4, -3, -4] as [number, number, number], rotation: [Math.PI / 4, 0, 0], color: "#7C3AED" },
    { position: [0, -5, -8] as [number, number, number], rotation: [0, Math.PI / 3, 0], color: "#00D9FF" },
  ], [])

  return (
    <>
      {rings.map((ring, i) => (
        <FloatingRing key={i} {...ring} index={i} />
      ))}
    </>
  )
}

function FloatingRing({ 
  position, 
  rotation, 
  color, 
  index 
}: { 
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  index: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = state.clock.getElapsedTime?.() ?? Date.now() / 1000
      meshRef.current.rotation.x = rotation[0] + elapsed * 0.2
      meshRef.current.rotation.y = rotation[1] + elapsed * 0.3
      meshRef.current.rotation.z = rotation[2] + elapsed * 0.1
    }
  })

  return (
    <Float speed={1.5 + index * 0.3} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  )
}

// Camera controller with parallax
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const targetPosition = useRef({ x: 0, y: 0, z: 8 })

  useFrame((state) => {
    const { pointer } = state
    
    targetPosition.current.x = pointer.x * 1.5
    targetPosition.current.y = pointer.y * 1.5 - scrollProgress * 10
    targetPosition.current.z = 8 + scrollProgress * 5
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosition.current.x, 0.08)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosition.current.y, 0.08)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosition.current.z, 0.08)
    
    camera.lookAt(0, scrollProgress * -5, 0)
  })

  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[15, 15, 15]} intensity={0.8} color="#00D9FF" />
      <pointLight position={[-15, -15, -10]} intensity={0.6} color="#7C3AED" />
      <pointLight position={[0, 20, 0]} intensity={0.4} color="#FFFFFF" />
      <spotLight
        position={[0, 10, 5]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="#00D9FF"
      />

      <Physics gravity={[0, -0.5, 0]}>
        <PhysicsOrbs scrollProgress={scrollProgress} />
        
        {/* Invisible floor */}
        <RigidBody type="fixed" position={[0, -10, 0]}>
          <CuboidCollider args={[50, 0.5, 50]} />
        </RigidBody>
      </Physics>

      <WaveParticles scrollProgress={scrollProgress} />
      <InteractiveSphere />
      <DNAHelix scrollProgress={scrollProgress} />
      <MorphingBlob />
      <FloatingRings />

      <Stars
        radius={150}
        depth={100}
        count={3000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <CameraController scrollProgress={scrollProgress} />
    </>
  )
}

export default function PhysicsScene() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
