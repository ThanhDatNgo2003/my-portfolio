"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Box, Text, Html } from "@react-three/drei"
import * as THREE from "three"
import Image from "next/image"
import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  project: {
    title: string
    description: string
    image: string
    tags: string[]
    github: string
    demo: string
  }
  index: number
}

function Card3D({ project, mousePos }: { project: ProjectCardProps["project"], mousePos: { x: number, y: number } }) {
  const groupRef = useRef<THREE.Group>(null)
  const frontRef = useRef<THREE.Mesh>(null)
  const sideRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      // Smooth rotation based on mouse position
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePos.x * 0.5,
        0.05
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mousePos.y * 0.5,
        0.05
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Front face - Display the card */}
      <mesh ref={frontRef} position={[0, 0, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 0.05]} />
        <meshStandardMaterial
          color="#111111"
          metalness={0.3}
          roughness={0.4}
          emissive="#00D9FF"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Side depth faces - Create 3D effect */}
      <mesh position={[1.025, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 2.5, 0.35]} />
        <meshStandardMaterial
          color="#0A0A0F"
          metalness={0.2}
          roughness={0.6}
          emissive="#7C3AED"
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[-1.025, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 2.5, 0.35]} />
        <meshStandardMaterial
          color="#0A0A0F"
          metalness={0.2}
          roughness={0.6}
          emissive="#7C3AED"
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, 1.275, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.05, 0.35]} />
        <meshStandardMaterial
          color="#0A0A0F"
          metalness={0.2}
          roughness={0.6}
          emissive="#7C3AED"
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, -1.275, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.05, 0.35]} />
        <meshStandardMaterial
          color="#0A0A0F"
          metalness={0.2}
          roughness={0.6}
          emissive="#7C3AED"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Back face - Shadow/depth */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[2, 2.5, 0.05]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.1}
          roughness={0.8}
          emissive="#000000"
        />
      </mesh>

      {/* Light for 3D effect */}
      <pointLight position={[1, 1, 1]} intensity={0.5} color="#00D9FF" />
    </group>
  )
}

interface ProjectCard3DProps {
  project: ProjectCardProps["project"]
  index: number
}

export default function ProjectCard3D({ project, index }: ProjectCard3DProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePos({ x: x * 2, y: y * 2 })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative perspective group"
      style={{
        animationDelay: `${index * 150}ms`,
        perspective: "1200px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Canvas for 3D rendering */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} angle={0.3} intensity={0.7} color="#00D9FF" />
          <Card3D project={project} mousePos={mousePos} />
        </Canvas>
      </div>

      {/* HTML Content overlay */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="relative w-full h-full bg-gradient-to-br from-transparent via-transparent to-background/50 p-6 flex flex-col justify-between">
          {/* Top content */}
          <div className="space-y-3">
            <div className="relative h-32 rounded-lg overflow-hidden bg-muted/50 backdrop-blur-sm">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div>
              <h3 className="font-mono text-lg font-semibold text-primary group-hover:text-cyan-300 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>
          </div>

          {/* Bottom links and tags */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded border border-primary/30 bg-primary/10 text-primary/80 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-2 pointer-events-auto">
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-primary/40 hover:bg-primary/10 transition-colors text-xs text-primary font-mono"
              >
                <Github className="w-4 h-4" />
                Code
              </Link>
              <Link
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-secondary/40 hover:bg-secondary/10 transition-colors text-xs text-secondary font-mono"
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
