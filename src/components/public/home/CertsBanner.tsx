'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'

const certifications = [
  'Organic Farming (EU)',
  'Organic Farming (USDA NOP)',
  'GMP Certified',
  'ISO 22000:2018',
  'HACCP Certified',
  'Kosher Certified',
  'FSSC 22000',
  'BRCGS Food Safety',
  'SMETA Audited',
  'Non-GMO Verified',
  'Fair Trade Licensed',
]

export function CertsBanner() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-display font-[400] leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Certifications &amp; Quality Standards
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="font-light max-w-xl mx-auto"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Our certifications reflect our unwavering commitment to quality, safety, and sustainability.
          </motion.p>
        </motion.div>

        <motion.div
          className="cert-strip justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {certifications.map((cert) => (
            <motion.span
              key={cert}
              variants={fadeInUp}
              className="cert-badge"
            >
              <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-calendula-500)' }} />
              {cert}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
