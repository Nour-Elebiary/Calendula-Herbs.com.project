import React from 'react'
import { db } from '@/lib/db'
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react'
import { ContactForm } from '@/components/public/ContactForm'
import { MapEmbed } from '@/components/public/MapEmbed'

export const metadata = {
  title: 'Contact Us | Calendula Herbs',
  description: 'Get in touch with Calendula Herbs for bulk inquiries, sample requests, and more.',
}

export default async function ContactPage() {
  const contact = await db.contactSetting.findUnique({ where: { id: 'main' } })

  let hours: Record<string, string> = {}
  try {
    if (contact?.businessHours) hours = JSON.parse(contact.businessHours)
  } catch {}

  const formEnabled = contact?.formEnabled ?? true

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-900 pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Contact Us</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          We're here to help with your bulk herbal export needs. Reach out to our team today.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl mt-16">
        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-6">Get in Touch</h3>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Whether you need a quote, want to request samples, or have questions about our certifications, our team is ready to assist you.
              </p>
              
              <ul className="space-y-6">
                {contact?.mapAddress && (
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Headquarters & Farm</h4>
                      <p className="text-neutral-600 text-sm leading-relaxed">{contact.mapAddress}</p>
                    </div>
                  </li>
                )}
                
                {contact?.phones && contact.phones.length > 0 && (
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Phone & WhatsApp</h4>
                      <div className="space-y-1">
                        {contact.phones.map((phone, i) => (
                          <div key={i}><a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="text-neutral-600 text-sm hover:text-primary transition-colors">{phone}</a></div>
                        ))}
                      </div>
                    </div>
                  </li>
                )}

                {contact?.publicEmails && contact.publicEmails.length > 0 && (
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Email Support</h4>
                      <div className="space-y-1">
                        {contact.publicEmails.map((email, i) => (
                          <div key={i}><a href={`mailto:${email}`} className="text-neutral-600 text-sm hover:text-primary transition-colors">{email}</a></div>
                        ))}
                      </div>
                    </div>
                  </li>
                )}

                {Object.keys(hours).length > 0 && (
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-semibold text-neutral-900 mb-2">Business Hours</h4>
                      <ul className="space-y-2 text-sm w-full">
                        {Object.entries(hours).map(([days, time]) => (
                          <li key={days} className="flex items-center justify-between border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">{days}</span>
                            <span className="text-neutral-900 font-medium">{time}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-3xl p-8 md:p-12 shadow-sm">
              <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">Send an Inquiry</h2>
              <p className="text-neutral-500 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>
              
              {formEnabled ? (
                <ContactForm />
              ) : (
                <div className="bg-neutral-50 border rounded-2xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">Contact Form is Currently Unavailable</h3>
                  <p className="text-neutral-500">Please reach out to us directly via email or phone using the details provided.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Map */}
      {contact?.mapLat && contact?.mapLng && (
        <div className="container mx-auto px-6 max-w-7xl mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-neutral-900">Our Location</h2>
            <p className="text-neutral-500 mt-2">{contact.mapAddress}</p>
          </div>
          <MapEmbed lat={contact.mapLat} lng={contact.mapLng} address={contact.mapAddress || ''} />
        </div>
      )}

    </div>
  )
}
