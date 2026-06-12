'use client'

import React from 'react'
import Link from 'next/link'
import { Leaf, MapPin, Phone, Mail, Clock } from 'lucide-react'

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

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 inline-flex">
              <div className="flex items-center justify-center rounded-full w-10 h-10 bg-primary text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                {siteName}
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {settings.site_tagline || 'Premium organic herbs, spices, and seeds exported globally.'}
            </p>
            
            {/* Socials */}
            <div className="flex items-center gap-4">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
                  FB
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
                  IG
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
                  TW
                </a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs font-bold">
                  IN
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">Products Catalog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Our Company</Link></li>
              <li><Link href="/galleries" className="hover:text-white transition-colors">Farm & Processing Galleries</Link></li>
              <li><Link href="/certificates" className="hover:text-white transition-colors">Quality Certificates</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              {contact?.mapAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                  <span>{contact.mapAddress}</span>
                </li>
              )}
              {contact?.phones && contact.phones.length > 0 && (
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                  <div className="space-y-1">
                    {contact.phones.map((phone, i) => (
                      <div key={i}><a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">{phone}</a></div>
                    ))}
                  </div>
                </li>
              )}
              {contact?.publicEmails && contact.publicEmails.length > 0 && (
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                  <div className="space-y-1">
                    {contact.publicEmails.map((email, i) => (
                      <div key={i}><a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a></div>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-6">Business Hours</h4>
            {Object.keys(hours).length > 0 ? (
              <ul className="space-y-3 text-sm">
                {Object.entries(hours).map(([days, time]) => (
                  <li key={days} className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-400">{days}</span>
                    <span className="text-white">{time}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                <span>Contact us anytime for inquiries.</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
