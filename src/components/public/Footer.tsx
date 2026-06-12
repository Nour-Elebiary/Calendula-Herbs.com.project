'use client'

import React from 'react'
import Link from 'next/link'
import { Leaf, MapPin, Phone, Mail, Clock, Globe } from 'lucide-react'

type FooterProps = {
  settings: Record<string, string>
  contact: {
    mapAddress: string | null
    phones: string[]
    publicEmails: string[]
    businessHours: string | null
  } | null
}

export function Footer({ settings, contact }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const siteName = settings.site_name || 'Calendula Herbs'

  let hours: Record<string, string> = {}
  try {
    if (contact?.businessHours) hours = JSON.parse(contact.businessHours)
  } catch {}

  const socialLinks = [
    { key: 'social_linkedin', icon: Globe, label: 'LinkedIn' },
    { key: 'social_facebook', icon: Globe, label: 'Facebook' },
    { key: 'social_instagram', icon: Globe, label: 'Instagram' },
    { key: 'social_twitter', icon: Globe, label: 'Twitter / X' },
  ]

  return (
    <footer className="footer-primary">
      <div className="container mx-auto max-w-7xl">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                {siteName}
              </Link>
            </div>
            <p className="footer-tagline">
              {settings.site_tagline || 'Specialists in exporting premium Egyptian dried herbs, spices, herbal tea, and seeds.'}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ key, icon: Icon, label }) =>
                settings[key] ? (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      border: '1px solid var(--color-border-default)',
                      color: 'var(--color-text-tertiary)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-border-accent)'; e.currentTarget.style.color = 'var(--color-green-700)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border-default)'; e.currentTarget.style.color = 'var(--color-text-tertiary)' }}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/products" className="footer-link">Products Catalog</Link></li>
              <li><Link href="/about" className="footer-link">About Our Company</Link></li>
              <li><Link href="/galleries" className="footer-link">Farm & Processing Galleries</Link></li>
              <li><Link href="/certificates" className="footer-link">Quality Certificates</Link></li>
              <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            {contact?.mapAddress && (
              <div className="flex items-start gap-3 mb-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-calendula-500)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{contact.mapAddress}</span>
              </div>
            )}
            {contact?.phones && contact.phones.length > 0 && (
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-calendula-500)' }} />
                <div style={{ fontSize: 'var(--text-sm)' }}>
                  {contact.phones.map((phone, i) => (
                    <div key={i}>
                      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="footer-link">{phone}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {contact?.publicEmails && contact.publicEmails.length > 0 && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-calendula-500)' }} />
                <div style={{ fontSize: 'var(--text-sm)' }}>
                  {contact.publicEmails.map((email, i) => (
                    <div key={i}>
                      <a href={`mailto:${email}`} className="footer-link">{email}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {['ISO 9001', 'EU Organic', 'HALAL', 'KOSHER', 'FDA'].map(cert => (
                <span key={cert} className="badge badge-green text-[10px]">{cert}</span>
              ))}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="footer-heading">Business Hours</h4>
            {Object.keys(hours).length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {Object.entries(hours).map(([days, time]) => (
                  <li key={days} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{days}</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-calendula-500)' }} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Contact us anytime for inquiries.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Calendula Herbs For Import & Export. Ibshaway, Fayoum, Egypt.
          </p>
        </div>
      </div>
    </footer>
  )
}
