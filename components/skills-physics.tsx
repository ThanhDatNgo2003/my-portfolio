"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from "@react-three/rapier"
import { Text, RoundedBox } from "@react-three/drei"
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

// Single skill pill component with physics
function SkillPill({ 
  skill, 
  index, 
  isActive,
  draggedRef,
  setDraggedRef
}: { 
  skill: typeof skills[0]
  index: number
  isActive: boolean
  draggedRef: React.MutableRefObject<RapierRigidBody | null>
  setDraggedRef: (ref: RapierRigidBody | null) => void
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [hasDropped, setHasDropped] = useState(false)
  const throwVelocity = useRef<THREE.Vector3 | null>(null)
  const lastPosition = useRef<THREE.Vector3>(new THREE.Vector3())
  const returnTimer = useRef<NodeJS.Timeout | null>(null)
  
  // Calculate initial position spread across the top
  const initialX = useMemo(() => (Math.random() - 0.5) * 12, [])
  const initialY = useMemo(() => 8 + Math.random() * 6 + index * 0.5, [index])
  const initialZ = useMemo(() => (Math.random() - 0.5) * 4, [])
  
  // Pill dimensions based on text length
  const pillWidth = skill.name.length * 0.18 + 0.8
  const pillHeight = 0.5
  const pillDepth = 0.3
  
  // Drop the pill when section becomes active
  useEffect(() => {
    if (isActive && !hasDropped && rigidBodyRef.current) {
      const delay = index * 80 + Math.random() * 200
      setTimeout(() => {
        if (rigidBodyRef.current) {
          rigidBodyRef.current.setBodyType(0, true) // Dynamic
          rigidBodyRef.current.wakeUp()
          // Add slight random rotation on drop
          rigidBodyRef.current.setAngvel({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: (Math.random() - 0.5) * 2
          }, true)
          setHasDropped(true)
        }
      }, delay)
    }
  }, [isActive, hasDropped, index])

  // Track velocity for throwing
  useFrame(() => {
    if (rigidBodyRef.current && meshRef.current) {
      const pos = rigidBodyRef.current.translation()
      
      if (draggedRef.current === rigidBodyRef.current) {
        // Calculate velocity based on position change
        throwVelocity.current = new THREE.Vector3(
          pos.x - lastPosition.current.x,
          pos.y - lastPosition.current.y,
          pos.z - lastPosition.current.z
        ).multiplyScalar(60) // Scale for impulse
      }
      
      lastPosition.current.set(pos.x, pos.y, pos.z)
      
      // Return objects that go too far
      if (Math.abs(pos.x) > 20 || Math.abs(pos.z) > 20 || pos.y < -10) {
        if (!returnTimer.current) {
          returnTimer.current = setTimeout(() => {
            if (rigidBodyRef.current) {
              // Reset position to drop from above again
              rigidBodyRef.current.setTranslation({
                x: (Math.random() - 0.5) * 8,
                y: 10 + Math.random() * 3,
                z: (Math.random() - 0.5) * 3
              }, true)
              rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
              rigidBodyRef.current.setAngvel({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2
              }, true)
            }
            returnTimer.current = null
          }, 2000)
        }
      }
    }
  })
  
  const handlePointerDown = (e: THREE.Event) => {
    e.stopPropagation()
    if (rigidBodyRef.current) {
      setDraggedRef(rigidBodyRef.current)
      rigidBodyRef.current.setBodyType(1, true) // Kinematic
    }
  }
  
  const handlePointerUp = () => {
    if (rigidBodyRef.current && draggedRef.current === rigidBodyRef.current) {
      rigidBodyRef.current.setBodyType(0, true) // Dynamic
      
      // Apply throw velocity as impulse
      if (throwVelocity.current && throwVelocity.current.length() > 0.5) {
        const impulse = throwVelocity.current.multiplyScalar(0.8)
        rigidBodyRef.current.applyImpulse({
          x: impulse.x,
          y: Math.max(impulse.y, 2), // Ensure some upward movement
          z: impulse.z
        }, true)
        
        // Add spin based on throw direction
        rigidBodyRef.current.applyTorqueImpulse({
          x: impulse.z * 0.3,
          y: 0,
          z: -impulse.x * 0.3
        }, true)
      }
      
      setDraggedRef(null)
      throwVelocity.current = null
    }
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[initialX, initialY, initialZ]}
      rotation={[(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * Math.PI, (Math.random() - 0.5) * 0.5]}
      colliders={false}
      type="fixed" // Start as fixed, change to dynamic when dropping
      restitution={0.5}
      friction={0.3}
      linearDamping={0.5}
      angularDamping={0.5}
      mass={1}
    >
      <CuboidCollider args={[pillWidth / 2, pillHeight / 2, pillDepth / 2]} />
      <group
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => {
          setIsHovered(false)
          handlePointerUp()
        }}
      >
        <RoundedBox
          args={[pillWidth, pillHeight, pillDepth]}
          radius={0.15}
          smoothness={4}
        >
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={isHovered ? 0.4 : 0.15}
            roughness={0.3}
            metalness={0.1}
          />
        </RoundedBox>
        <Text
          position={[0, 0, pillDepth / 2 + 0.01]}
          fontSize={0.22}
          color="#000000"
          font="/fonts/inter-bold.woff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {skill.name}
        </Text>
        <Text
          position={[0, 0, -pillDepth / 2 - 0.01]}
          fontSize={0.22}
          color="#000000"
          rotation={[0, Math.PI, 0]}
          font="/fonts/inter-bold.woff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {skill.name}
        </Text>
      </group>
    </RigidBody>
  )
}

// Drag handler component
function DragHandler({ 
  draggedRef 
}: { 
  draggedRef: React.MutableRefObject<RapierRigidBody | null>
}) {
  const { camera, pointer } = useThree()
  const planeNormal = useMemo(() => new THREE.Vector3(0, 0, 1), [])
  const plane = useMemo(() => new THREE.Plane(planeNormal, 0), [planeNormal])
  const intersection = useMemo(() => new THREE.Vector3(), [])
  
  useFrame(() => {
    if (draggedRef.current) {
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(plane, intersection)
      
      draggedRef.current.setNextKinematicTranslation({
        x: intersection.x,
        y: Math.max(intersection.y, -2),
        z: intersection.z
      })
    }
  })
  
  return null
}

// Floor and walls
function Boundaries() {
  return (
    <>
      {/* Floor */}
      <RigidBody type="fixed" position={[0, -3, 0]}>
        <CuboidCollider args={[15, 0.5, 10]} />
      </RigidBody>
      
      {/* Left wall */}
      <RigidBody type="fixed" position={[-10, 2, 0]}>
        <CuboidCollider args={[0.5, 10, 10]} />
      </RigidBody>
      
      {/* Right wall */}
      <RigidBody type="fixed" position={[10, 2, 0]}>
        <CuboidCollider args={[0.5, 10, 10]} />
      </RigidBody>
      
      {/* Back wall */}
      <RigidBody type="fixed" position={[0, 2, -6]}>
        <CuboidCollider args={[15, 10, 0.5]} />
      </RigidBody>
      
      {/* Front wall (invisible, prevents items from coming too close) */}
      <RigidBody type="fixed" position={[0, 2, 6]}>
        <CuboidCollider args={[15, 10, 0.5]} />
      </RigidBody>
    </>
  )
}

// Lighting setup
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#61DAFB" />
      <pointLight position={[5, 5, -5]} intensity={0.5} color="#E10098" />
    </>
  )
}

// Main physics scene
function PhysicsSkillsScene({ isActive }: { isActive: boolean }) {
  const draggedRef = useRef<RapierRigidBody | null>(null)
  const [, setDraggedState] = useState<RapierRigidBody | null>(null)
  
  const setDraggedRef = (ref: RapierRigidBody | null) => {
    draggedRef.current = ref
    setDraggedState(ref)
  }

  return (
    <Physics gravity={[0, -15, 0]}>
      <Lighting />
      <Boundaries />
      <DragHandler draggedRef={draggedRef} />
      
      {skills.map((skill, index) => (
        <SkillPill
          key={skill.name}
          skill={skill}
          index={index}
          isActive={isActive}
          draggedRef={draggedRef}
          setDraggedRef={setDraggedRef}
        />
      ))}
    </Physics>
  )
}

// Main exported component
export default function SkillsPhysics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Delay physics activation slightly for smoother experience
          setTimeout(() => setIsActive(true), 300)
        }
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen py-24 px-6 overflow-hidden"
    >
      {/* Section header */}
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
          camera={{ position: [0, 2, 12], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <PhysicsSkillsScene isActive={isActive} />
        </Canvas>
      </div>
      
      {/* Interaction hint */}
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
