"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier"
import { Text, RoundedBox } from "@react-three/drei"
import type { RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

// Skills data with colors
const skills = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "Docker", color: "#2496ED" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Linux", color: "#FCC624" },
  { name: "AWS", color: "#FF9900" },
  { name: "Python", color: "#3776AB" },
  { name: "Git", color: "#F05032" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "Redis", color: "#DC382D" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Nginx", color: "#009639" },
]

// Generate stable initial positions
const initialPositions = skills.map((_, index) => ({
  x: (Math.random() - 0.5) * 10,
  y: 8 + index * 0.8,
  z: (Math.random() - 0.5) * 3,
  rotX: (Math.random() - 0.5) * 0.5,
  rotY: (Math.random() - 0.5) * Math.PI,
  rotZ: (Math.random() - 0.5) * 0.5,
}))

// Single skill pill component with physics
function SkillPill({ 
  skill, 
  index, 
  isActive,
  onDragStart,
  onDragEnd,
  isDragging
}: { 
  skill: typeof skills[0]
  index: number
  isActive: boolean
  onDragStart: (ref: RapierRigidBody) => void
  onDragEnd: () => void
  isDragging: boolean
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [hasDropped, setHasDropped] = useState(false)
  const lastPos = useRef({ x: 0, y: 0, z: 0 })
  const velocity = useRef({ x: 0, y: 0, z: 0 })
  
  const pos = initialPositions[index]
  const pillWidth = skill.name.length * 0.18 + 0.8
  const pillHeight = 0.5
  const pillDepth = 0.3
  
  // Drop the pill when section becomes active
  useEffect(() => {
    if (isActive && !hasDropped && rigidBodyRef.current) {
      const delay = index * 100 + Math.random() * 200
      const timer = setTimeout(() => {
        if (rigidBodyRef.current) {
          rigidBodyRef.current.setBodyType(0, true) // Dynamic
          rigidBodyRef.current.wakeUp()
          rigidBodyRef.current.setAngvel({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
          }, true)
          setHasDropped(true)
        }
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isActive, hasDropped, index])

  // Track velocity and handle out-of-bounds reset
  useFrame(() => {
    if (!rigidBodyRef.current) return
    
    const currentPos = rigidBodyRef.current.translation()
    
    // Track velocity for throwing
    velocity.current = {
      x: (currentPos.x - lastPos.current.x) * 60,
      y: (currentPos.y - lastPos.current.y) * 60,
      z: (currentPos.z - lastPos.current.z) * 60
    }
    lastPos.current = { x: currentPos.x, y: currentPos.y, z: currentPos.z }
    
    // Reset if out of bounds
    if (Math.abs(currentPos.x) > 15 || Math.abs(currentPos.z) > 15 || currentPos.y < -8) {
      rigidBodyRef.current.setTranslation({
        x: (Math.random() - 0.5) * 6,
        y: 10,
        z: (Math.random() - 0.5) * 2
      }, true)
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  })
  
  const handlePointerDown = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (rigidBodyRef.current && hasDropped) {
      rigidBodyRef.current.setBodyType(1, true) // Kinematic
      onDragStart(rigidBodyRef.current)
    }
  }
  
  const handlePointerUp = () => {
    if (rigidBodyRef.current && isDragging) {
      rigidBodyRef.current.setBodyType(0, true) // Dynamic
      
      // Apply throw impulse
      const speed = Math.sqrt(
        velocity.current.x ** 2 + 
        velocity.current.y ** 2 + 
        velocity.current.z ** 2
      )
      
      if (speed > 1) {
        rigidBodyRef.current.applyImpulse({
          x: velocity.current.x * 0.5,
          y: Math.max(velocity.current.y * 0.5, 1),
          z: velocity.current.z * 0.5
        }, true)
        
        rigidBodyRef.current.applyTorqueImpulse({
          x: velocity.current.z * 0.2,
          y: 0,
          z: -velocity.current.x * 0.2
        }, true)
      }
      
      onDragEnd()
    }
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[pos.x, pos.y, pos.z]}
      rotation={[pos.rotX, pos.rotY, pos.rotZ]}
      colliders={false}
      type="fixed"
      restitution={0.6}
      friction={0.4}
      linearDamping={0.3}
      angularDamping={0.3}
    >
      <CuboidCollider args={[pillWidth / 2, pillHeight / 2, pillDepth / 2]} />
      <group
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <RoundedBox
          args={[pillWidth, pillHeight, pillDepth]}
          radius={0.15}
          smoothness={4}
        >
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.1}
          />
        </RoundedBox>
        <Text
          position={[0, 0, pillDepth / 2 + 0.01]}
          fontSize={0.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
        <Text
          position={[0, 0, -pillDepth / 2 - 0.01]}
          fontSize={0.2}
          color="#000000"
          rotation={[0, Math.PI, 0]}
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </group>
    </RigidBody>
  )
}

// Drag controller
function DragController({ 
  draggedBody 
}: { 
  draggedBody: RapierRigidBody | null
}) {
  const { camera, pointer } = useThree()
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))
  const intersection = useRef(new THREE.Vector3())
  
  useFrame(() => {
    if (draggedBody) {
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(plane.current, intersection.current)
      
      draggedBody.setNextKinematicTranslation({
        x: intersection.current.x,
        y: Math.max(intersection.current.y, -2),
        z: 0
      })
    }
  })
  
  return null
}

// Boundaries
function Boundaries() {
  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -3.5, 0]}>
        <CuboidCollider args={[12, 0.5, 8]} />
      </RigidBody>
      {/* Walls */}
      <RigidBody type="fixed" position={[-8, 3, 0]}>
        <CuboidCollider args={[0.5, 8, 8]} />
      </RigidBody>
      <RigidBody type="fixed" position={[8, 3, 0]}>
        <CuboidCollider args={[0.5, 8, 8]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, -5]}>
        <CuboidCollider args={[12, 8, 0.5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[0, 3, 5]}>
        <CuboidCollider args={[12, 8, 0.5]} />
      </RigidBody>
    </>
  )
}

// Physics scene
function PhysicsScene({ isActive }: { isActive: boolean }) {
  const [draggedBody, setDraggedBody] = useState<RapierRigidBody | null>(null)

  return (
    <Physics gravity={[0, -12, 0]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#61DAFB" />
      <pointLight position={[5, 5, -5]} intensity={0.4} color="#E10098" />
      
      <Boundaries />
      <DragController draggedBody={draggedBody} />
      
      {skills.map((skill, index) => (
        <SkillPill
          key={skill.name}
          skill={skill}
          index={index}
          isActive={isActive}
          onDragStart={setDraggedBody}
          onDragEnd={() => setDraggedBody(null)}
          isDragging={draggedBody !== null}
        />
      ))}
    </Physics>
  )
}

// Loading indicator
function Loading() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#61DAFB" wireframe />
    </mesh>
  )
}

// Main component
export default function SkillsPhysics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          setTimeout(() => setIsActive(true), 500)
        }
      },
      { threshold: 0.15 }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen py-24 px-6 overflow-hidden"
    >
      {/* Header */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8">
          <h2 
            className={`font-mono text-3xl md:text-5xl font-bold transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            <span className="text-primary">02.</span> Skills
          </h2>
          <div 
            className={`h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 transition-all duration-1000 delay-300 ${
              isVisible ? "w-32 opacity-100" : "w-0 opacity-0"
            }`}
          />
          <p 
            className={`text-muted-foreground mt-6 text-lg transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Drag, throw, and play with my skills!
          </p>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 top-32">
        <Canvas
          camera={{ position: [0, 2, 10], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<Loading />}>
            <PhysicsScene isActive={isActive} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Hint */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-center transition-all duration-700 delay-1000 ${
          isVisible ? "opacity-60" : "opacity-0"
        }`}
      >
        <p className="text-sm text-muted-foreground">
          Click and drag to interact
        </p>
      </div>
    </section>
  )
}
