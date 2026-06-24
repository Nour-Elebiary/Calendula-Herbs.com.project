'use client'

import { useRef, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Flower {
  x: number
  y: number
  size: number
  color: string
  center: string
  phase: number
  petalCount: number
  swayAmount: number
}

interface FloatingPetal {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

function generateFlowers(w: number, h: number): Flower[] {
  const flowers: Flower[] = []
  const colors = ['#DC7E18', '#EE9C38', '#F5BC62', '#DC9840', '#EDB870']
  const centers = ['#8B5E2B', '#6B4423', '#8C540A']
  const count = Math.min(15, Math.max(8, Math.floor(w / 100)))

  for (let i = 0; i < count; i++) {
    const size = 20 + Math.random() * 30
    flowers.push({
      x: Math.random() * w,
      y: h * (0.6 + Math.random() * 0.35),
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      center: centers[Math.floor(Math.random() * centers.length)],
      phase: Math.random() * Math.PI * 2,
      petalCount: 6 + Math.floor(Math.random() * 3),
      swayAmount: 2 + Math.random() * 4,
    })
  }
  return flowers
}

function generatePetals(w: number, h: number): FloatingPetal[] {
  const petals: FloatingPetal[] = []
  const colors = ['#DC7E18', '#EE9C38', '#F5BC62', '#DC9840']
  const count = Math.min(25, Math.max(15, Math.floor(w / 60)))

  for (let i = 0; i < count; i++) {
    petals.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 4 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(0.3 + Math.random() * 0.4),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.2 + Math.random() * 0.4,
    })
  }
  return petals
}

function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#1A3520')
  grad.addColorStop(0.15, '#274D2E')
  grad.addColorStop(0.35, '#3A5B40')
  grad.addColorStop(0.5, '#4A6350')
  grad.addColorStop(0.65, '#6E5B30')
  grad.addColorStop(0.78, '#8C540A')
  grad.addColorStop(0.88, '#C47820')
  grad.addColorStop(1, '#DC7E18')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

function drawSun(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const cx = w * 0.5
  const cy = h * 0.55
  const radius = Math.min(w, h) * 0.07
  const pulse = 1 + Math.sin(time * 0.4) * 0.03

  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 5)
  glow.addColorStop(0, 'rgba(245, 188, 98, 0.25)')
  glow.addColorStop(0.3, 'rgba(238, 156, 56, 0.12)')
  glow.addColorStop(0.6, 'rgba(220, 126, 24, 0.05)')
  glow.addColorStop(1, 'rgba(220, 126, 24, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * pulse)
  core.addColorStop(0, '#FFF5E0')
  core.addColorStop(0.3, '#F5BC62')
  core.addColorStop(0.7, '#DC7E18')
  core.addColorStop(1, 'rgba(220, 126, 24, 0)')
  ctx.fillStyle = core
  ctx.beginPath()
  ctx.arc(cx, cy, radius * pulse, 0, Math.PI * 2)
  ctx.fill()

  const highlight = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 0, cx, cy, radius * 0.5)
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = highlight
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2)
  ctx.fill()
}

function drawHills(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const layers = [
    { color: '#1A3520', amplitude: 30, phase: 0, baseY: h * 0.50, speed: 0.01, opacity: 0.6 },
    { color: '#274D2E', amplitude: 35, phase: 2, baseY: h * 0.55, speed: 0.02, opacity: 0.8 },
    { color: '#3A6B40', amplitude: 25, phase: 4, baseY: h * 0.60, speed: 0.03, opacity: 1 },
  ]

  for (const layer of layers) {
    ctx.fillStyle = layer.color
    ctx.globalAlpha = layer.opacity
    ctx.beginPath()
    ctx.moveTo(0, h)
    const drift = time * 20 * layer.speed

    for (let x = 0; x <= w; x += 2) {
      const y = layer.baseY
        + Math.sin((x + drift) * 0.004 + layer.phase) * layer.amplitude
        + Math.sin((x + drift) * 0.008 + layer.phase * 1.7) * layer.amplitude * 0.3
        + Math.sin((x + drift) * 0.012 + layer.phase * 3.1) * layer.amplitude * 0.1
      ctx.lineTo(x, y)
    }

    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawGround(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, h * 0.75, 0, h)
  grad.addColorStop(0, '#3A6B40')
  grad.addColorStop(0.5, '#4D8554')
  grad.addColorStop(1, '#5E9E66')
  ctx.fillStyle = grad
  ctx.fillRect(0, h * 0.75, w, h * 0.25)
}

function drawFlower(ctx: CanvasRenderingContext2D, flower: Flower, time: number) {
  const sway = Math.sin(time * 0.6 + flower.phase) * flower.swayAmount
  const cx = flower.x + sway
  const cy = flower.y

  ctx.strokeStyle = '#4D8554'
  ctx.lineWidth = Math.max(1, flower.size * 0.06)
  ctx.beginPath()
  ctx.moveTo(cx, cy + flower.size * 0.1)
  ctx.lineTo(cx, cy + flower.size * 2.5)
  ctx.stroke()

  for (let i = 0; i < flower.petalCount; i++) {
    const angle = (i / flower.petalCount) * Math.PI * 2
    const px = cx + Math.cos(angle) * flower.size * 0.7
    const py = cy + Math.sin(angle) * flower.size * 0.7

    ctx.strokeStyle = flower.color
    ctx.lineWidth = flower.size * 0.12
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * flower.size * 0.08, cy + Math.sin(angle) * flower.size * 0.08)
    ctx.lineTo(px, py)
    ctx.stroke()

    const midAngle = ((i + 0.5) / flower.petalCount) * Math.PI * 2
    const mx = cx + Math.cos(midAngle) * flower.size * 0.35
    const my = cy + Math.sin(midAngle) * flower.size * 0.35
    ctx.strokeStyle = flower.color
    ctx.lineWidth = flower.size * 0.08
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(midAngle) * flower.size * 0.1, cy + Math.sin(midAngle) * flower.size * 0.1)
    ctx.lineTo(mx, my)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  ctx.fillStyle = flower.center
  ctx.beginPath()
  ctx.arc(cx, cy, flower.size * 0.14, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#C47820'
  ctx.beginPath()
  ctx.arc(cx, cy, flower.size * 0.08, 0, Math.PI * 2)
  ctx.fill()
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: FloatingPetal) {
  ctx.save()
  ctx.translate(petal.x, petal.y)
  ctx.rotate(petal.rotation)
  ctx.globalAlpha = petal.opacity
  ctx.fillStyle = petal.color

  ctx.beginPath()
  ctx.ellipse(0, 0, petal.size, petal.size * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = petal.color
  ctx.globalAlpha = petal.opacity * 0.3
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(-petal.size * 0.3, 0)
  ctx.lineTo(petal.size * 0.3, 0)
  ctx.stroke()

  ctx.restore()
}

export function HeroFieldScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const flowersRef = useRef<Flower[]>([])
  const petalsRef = useRef<FloatingPetal[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    flowersRef.current = generateFlowers(w, h)
    petalsRef.current = generatePetals(w, h)

    function resize() {
      w = canvas!.width = window.innerWidth
      h = canvas!.height = window.innerHeight
      flowersRef.current = generateFlowers(w, h)
      petalsRef.current = generatePetals(w, h)
    }
    window.addEventListener('resize', resize)

    function render(time: number) {
      ctx!.clearRect(0, 0, w, h)

      drawSky(ctx!, w, h)
      drawSun(ctx!, w, h, time)
      drawHills(ctx!, w, h, time)
      drawGround(ctx!, w, h)

      for (const flower of flowersRef.current) {
        drawFlower(ctx!, flower, time)
      }

      for (const petal of petalsRef.current) {
        if (!prefersReducedMotion) {
          petal.x += petal.speedX + Math.sin(time * 0.3 + petal.rotation) * 0.15
          petal.y += petal.speedY
          petal.rotation += petal.rotationSpeed

          if (petal.y < -20) {
            petal.y = h + 20
            petal.x = Math.random() * w
          }
          if (petal.x < -20) petal.x = w + 20
          if (petal.x > w + 20) petal.x = -20
        }

        drawPetal(ctx!, petal)
      }
    }

    let start: number | null = null

    function animate(timestamp: number) {
      if (!start) start = timestamp
      const elapsed = (timestamp - start) / 1000
      render(elapsed)
      animRef.current = requestAnimationFrame(animate)
    }

    if (!prefersReducedMotion) {
      animRef.current = requestAnimationFrame(animate)
    } else {
      render(0)
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
