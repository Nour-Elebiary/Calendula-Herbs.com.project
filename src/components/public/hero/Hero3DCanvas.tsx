'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function Petal({ index, count, layer, color }: { index: number; count: number; layer: number; color: string }) {
  const angle = (index / count) * Math.PI * 2
  const radius = 0.6 + layer * 0.35
  const ref = useRef<THREE.Mesh>(null)

  return (
    <mesh
      ref={ref}
      position={[Math.cos(angle) * radius, layer * 0.08 - 0.1, Math.sin(angle) * radius]}
      rotation={[
        -0.3 + layer * 0.1,
        angle,
        Math.PI / 4 + layer * 0.15,
      ]}
    >
      <planeGeometry args={[0.28 - layer * 0.03, 0.55 - layer * 0.04]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.7 - layer * 0.08}
        side={THREE.DoubleSide}
        roughness={0.6}
        metalness={0.1}
        envMapIntensity={0.4}
      />
    </mesh>
  )
}

function CalendulaFlower() {
  const groupRef = useRef<THREE.Group>(null)
  const outerCount = 12
  const innerCount = 10

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.12
    groupRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.1
  })

  const outerPetals = useMemo(
    () =>
      Array.from({ length: outerCount }, (_, i) => (
        <Petal key={`outer-${i}`} index={i} count={outerCount} layer={0} color="#DC7E18" />
      )),
    [],
  )

  const middlePetals = useMemo(
    () =>
      Array.from({ length: innerCount }, (_, i) => (
        <Petal key={`mid-${i}`} index={i} count={innerCount} layer={1} color="#E8923A" />
      )),
    [],
  )

  const innerPetals = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => (
        <Petal key={`inner-${i}`} index={i} count={6} layer={2} color="#F0A54A" />
      )),
    [],
  )

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
        {outerPetals}
        {middlePetals}
        {innerPetals}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhysicalMaterial
            color="#8B5E2B"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshPhysicalMaterial
            color="#6B4423"
            roughness={0.8}
            metalness={0.05}
          />
        </mesh>
      </Float>
    </group>
  )
}

export function Hero3DCanvas() {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 30 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#FFE4B5" />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#FFA500" />
        <CalendulaFlower />
      </Canvas>
    </div>
  )
}
