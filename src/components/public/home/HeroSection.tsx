'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { heroStagger, heroChild } from '@/lib/animations'

export function HeroSection({ tagline, founded }: { tagline: string; founded: string }) {
  return (
    <section className="hero-atmospheric">
      <div className="hero-atmospheric__bg">
        <div
          className="w-full h-full bg-[var(--color-green-800)]"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dkz99j6vt/image/upload/v1746600000/calendula-hero-fields_qy8t0p.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(1.05) brightness(0.72)',
          }}
        />
      </div>
      <div className="hero-atmospheric__vignette" />
      <div className="hero-atmospheric__fade-bottom" />

      <motion.div
        className="hero-atmospheric__content"
        variants={heroStagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={heroChild} className="hero-atmospheric__eyebrow">
          Premium Export Quality Since {founded || '2005'}
        </motion.div>

        <motion.h1
          variants={heroChild}
          className="hero-atmospheric__headline"
          dangerouslySetInnerHTML={{ __html: tagline || 'Rooted in Nature,<br />Exported with Care.' }}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-6 h-6" style={{ color: 'rgba(250,250,246,0.5)' }} />
      </motion.div>
    </section>
  )
}
