'use client'

import { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import { heroStagger, heroChild } from '@/lib/animations'
import { Hero3DCanvas } from '@/components/public/hero/Hero3DCanvas'
import { HeroParticles } from '@/components/public/hero/HeroParticles'

function FloatingLeaf({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      animate={{
        y: [0, -12, 0],
        rotate: [0, 8, -4, 0],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

export function HeroSection({ tagline, founded }: { tagline: string; founded: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const contentX = useTransform(mouseX, [0, 1], [12, -12])
  const contentY = useTransform(mouseY, [0, 1], [8, -8])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set((e.clientX - rect.left) / rect.width)
      mouseY.set((e.clientY - rect.top) / rect.height)
    },
    [prefersReducedMotion, mouseX, mouseY],
  )

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={sectionRef} className="hero-atmospheric" onMouseMove={handleMouseMove}>
      <motion.div className="hero-atmospheric__bg" style={{ y: backgroundY }}>
        {prefersReducedMotion ? (
          <div
            className="w-full h-full bg-[var(--color-green-800)]"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dkz99j6vt/image/upload/v1746600000/calendula-hero-fields_qy8t0p.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(1.05) brightness(0.72)',
            }}
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://res.cloudinary.com/dkz99j6vt/image/upload/v1746600000/calendula-hero-fields_qy8t0p.webp"
            className="hero-atmospheric__video"
          >
            <source
              src="https://res.cloudinary.com/dcukpuftg/video/upload/v1782298696/calendula-herbs/videos/hero-homepage.mp4"
              type="video/mp4"
            />
          </video>
        )}
      </motion.div>
      <div className="hero-atmospheric__vignette" />
      <motion.div className="hero-atmospheric__fade-bottom" style={{ opacity: fadeOpacity }} />

      {prefersReducedMotion ? null : (
        <>
          <Hero3DCanvas />
          <HeroParticles />
        </>
      )}

      <FloatingLeaf
        className="absolute top-32 left-[8%] w-6 h-12 rounded-full bg-[var(--color-calendula-400)] blur-sm"
        delay={0}
      />
      <FloatingLeaf
        className="absolute bottom-24 right-[10%] w-5 h-10 rounded-full bg-[var(--color-green-400)] blur-sm"
        delay={2}
      />

      <motion.div
        className="hero-atmospheric__content"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        style={{ x: prefersReducedMotion ? 0 : contentX, y: prefersReducedMotion ? 0 : contentY }}
      >
        <motion.div variants={heroChild} className="hero-atmospheric__eyebrow">
          Premium Export Quality Since {founded || '2005'}
        </motion.div>

        <motion.h1
          variants={heroChild}
          className="hero-atmospheric__headline"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tagline || 'Rooted in Nature,<br />Exported with Care.') }}
        />

        <motion.p variants={heroChild} className="hero-atmospheric__body">
          We supply the world with the finest organic herbs, spices, and seeds sourced directly
          from Egypt&apos;s fertile lands since {founded || '2005'}.
        </motion.p>

        <motion.div variants={heroChild} className="hero-atmospheric__actions flex flex-wrap gap-4 sm:gap-6 items-center justify-center sm:justify-start">
          <Link href="/contact" className="btn btn-primary btn-lg whitespace-nowrap">
            Request a Quote
          </Link>
          <Link href="/products" className="btn btn-secondary btn-lg whitespace-nowrap" style={{ color: 'var(--color-text-inverse)', borderColor: 'rgba(255,255,255,0.35)' }}>
            Explore Products
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-6 h-6" style={{ color: 'rgba(250,250,246,0.5)' }} />
      </motion.div>
    </section>
  )
}
