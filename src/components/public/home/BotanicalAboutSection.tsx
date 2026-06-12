'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, Leaf } from 'lucide-react'
import { fadeInUp, fadeInRight } from '@/lib/animations'
import { SectionLabel } from '../shared/SectionLabel'

const highlights = [
  'End-to-end traceability from farm to shipment',
  'GMP-compliant processing facilities',
  'Sustainable & ethical farming practices',
  'Rigorous quality control & lab testing',
]

export function BotanicalAboutSection() {
  return (
    <section className="py-24 overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          >
            <motion.div variants={fadeInUp}>
              <SectionLabel>Our Story</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-display font-[400] leading-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Cultivating Excellence.<br />
              <span style={{ color: 'var(--color-calendula-500)' }}>Delivering Trust.</span>
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="space-y-4 font-light leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <p>
                From the fertile banks of the Nile to global markets, Calendula Herbs bridges the gap
                between traditional Egyptian farming and modern international quality standards.
              </p>
              <p>
                With <strong>45 years of farming expertise</strong>, <strong>25 years of manufacturing excellence</strong>,
                and <strong>11 years of global export experience</strong>, we bring unparalleled heritage
                to every shipment. Our state-of-the-art processing facilities ensure that every leaf, seed,
                and flower retains its natural potency, aroma, and color.
              </p>
            </motion.div>
            <motion.ul variants={fadeInUp} className="space-y-3 pt-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-calendula-500)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div variants={fadeInUp} className="pt-4">
              <Link href="/about" className="btn btn-primary">
                Learn More About Us
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-[500px] hidden lg:block"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="card-glass w-full h-full flex items-center justify-center">
              <div className="text-center px-8">
                <Leaf className="w-24 h-24 mx-auto mb-4" style={{ color: 'var(--color-calendula-300)' }} />
                <p className="font-display text-2xl" style={{ color: 'var(--color-text-primary)' }}>Since 2005</p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  45 Years of Agricultural Heritage
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
