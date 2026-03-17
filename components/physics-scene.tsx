"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import * as THREE from "three"

// Simple floating particle field - subtle background effect
function ParticleField({ scrollProgress }: { scrollProgress: number }) {
  const count = 1500
  const mesh = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const cyanColor = new THREE.Color("#00D9FF")
    const purpleColor = new THREE.Color("#7C3AED")
    const whiteColor = new THREE.Color("#FFFFFF")
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 60
      positions[i3 + 1] = (Math.random() - 0.5) * 60
      positions[i3 + 2] = (Math.random() - 0.5) * 40
      
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
      mesh.current.rotation.y = elapsed * 0.01
      mesh.current.rotation.x = scrollProgress * 0.2
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
        size={0.04}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

// Camera controller with subtle parallax
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()

  useFrame((state) => {
    const { pointer } = state
    
    const targetX = pointer.x * 0.5
    const targetY = pointer.y * 0.5 - scrollProgress * 5
    const targetZ = 8 + scrollProgress * 3
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05)
    
    camera.lookAt(0, scrollProgress * -2, 0)
  })

  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[15, 15, 15]} intensity={0.4} color="#00D9FF" />
      <pointLight position={[-15, -15, -10]} intensity={0.3} color="#7C3AED" />

      <ParticleField scrollProgress={scrollProgress} />

      <Stars
        radius={150}
        depth={100}
        count={2000}
        factor={3}
        saturation={0.2}
        fade
        speed={0.3}
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
