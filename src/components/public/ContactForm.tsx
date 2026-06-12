'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, country, subject, message })
      })

      if (res.ok) {
        toast.success('Message sent successfully! We will get back to you soon.')
        setName(''); setEmail(''); setPhone(''); setCompany(''); setCountry(''); setSubject(''); setMessage('')
      } else {
        toast.error('Failed to send message. Please try again later.')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card-glass p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-tertiary)]">Name *</Label>
            <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className="input h-12" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-tertiary)]">Email *</Label>
            <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className="input h-12" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-tertiary)]">Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234..." className="input h-12" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-tertiary)]">Country</Label>
            <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" className="input h-12" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-tertiary)]">Company</Label>
            <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Herbs LLC" className="input h-12" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-tertiary)]">Subject</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Bulk Inquiry" className="input h-12" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[var(--color-text-tertiary)]">Message *</Label>
          <Textarea
            required
            rows={6}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="How can we help you?"
            className="input resize-none"
          />
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px] opacity-0">
          <label htmlFor="hp-field">Leave this empty</label>
          <input id="hp-field" name="hp-field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg disabled:opacity-50 disabled:pointer-events-none">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  )
}
