'use client'

import { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  opacitySpeed: number
}

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    const count = Math.min(40, Math.floor((w * h) / 40000))

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -(Math.random() * 0.2 + 0.05),
      opacity: Math.random() * 0.4 + 0.1,
      opacitySpeed: (Math.random() - 0.5) * 0.003,
    }))

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    function animate() {
      ctx!.clearRect(0, 0, w, h)

      for (const p of particlesRef.current) {
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.opacitySpeed

        if (p.opacity <= 0 || p.opacity >= 0.5) p.opacitySpeed *= -1
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(220, 126, 24, ${p.opacity})`
        ctx!.fill()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[3] pointer-events-none"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
