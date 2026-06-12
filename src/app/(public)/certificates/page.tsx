import React from 'react'
import { Award, FileText, Shield, Leaf, Globe, Star, BadgeCheck, Heart, FlaskConical, Users, Building2 } from 'lucide-react'

export const metadata = {
  title: 'Certificates | Calendula Herbs',
  description: 'Our organic and quality assurance certificates — ISO, EU Organic, HALAL, KOSHER, USDA NOP, and more.',
}

const certifications = [
  { icon: FileText, title: 'ISO 9001', desc: 'Quality Management System — consistent quality through certified processes.' },
  { icon: Shield, title: 'ISO 22000', desc: 'Food Safety Management — ensuring safe handling from farm to shipment.' },
  { icon: Leaf, title: 'EU Organic', desc: 'European Union organic certification for all exported botanical products.' },
  { icon: Users, title: 'SEDEX / Semeta', desc: 'Ethical trade and social compliance — responsible sourcing and labor practices.' },
  { icon: Star, title: 'HALAL', desc: 'Halal-certified processing and handling for Muslim-majority markets.' },
  { icon: BadgeCheck, title: 'KOSHER', desc: 'Kosher supervision ensuring compliance with dietary laws.' },
  { icon: Globe, title: 'USDA NOP', desc: 'United States Department of Agriculture National Organic Program certified.' },
  { icon: Heart, title: 'FDA Approval', desc: 'Registered with the US Food and Drug Administration for import compliance.' },
  { icon: FlaskConical, title: 'BRCGS', desc: 'Global Standard for Food Safety — independently audited quality systems.' },
  { icon: Building2, title: 'NFSA Whitelist', desc: 'Egyptian National Food Safety Authority whitelisted exporter.' },
  { icon: Award, title: 'AHK Council Member', desc: 'Arab-German Chamber of Commerce member — trusted bilateral trade partner.' },
]

export default function CertificatesPage() {
  return (
    <div className="page-root">
      <div className="page-content">
        <section className="bg-[var(--color-bg-elevated)] pt-32 pb-20 text-center px-6">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Quality & Certifications
          </h1>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            We adhere to the highest international standards for organic farming, processing, and export.
          </p>
        </section>

        <div className="section">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certifications.map((cert, i) => {
              const Icon = cert.icon
              return (
                <div key={i} className="card-glass cert-card">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                    style={{ background: 'rgba(94,158,102,0.10)' }}
                  >
                    <Icon className="w-8 h-8" style={{ color: 'var(--color-green-600)' }} />
                  </div>
                  <h3 className="cert-card__name">{cert.title}</h3>
                  <p className="cert-card__desc">{cert.desc}</p>
                  <span className="badge badge-green mt-2">
                    <Leaf className="w-3 h-3" />
                    Certified
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
