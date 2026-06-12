'use client'

import React, { useState } from 'react'
import { useCart } from './CartProvider'
import { X, Trash2, Plus, Minus, Loader2, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [country, setCountry] = useState('')
  const [notes, setNotes] = useState('')

  if (!isCartOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/public/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, company, country, notes, items
        })
      })

      if (res.ok) {
        toast.success('Inquiry submitted successfully! We will contact you soon.')
        clearCart()
        setIsCartOpen(false)
        setStep(1)
        setName(''); setEmail(''); setPhone(''); setCompany(''); setCountry(''); setNotes('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit inquiry')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-[var(--color-bg-void)] shadow-2xl flex flex-col transform transition-transform duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border-default)]">
          <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">Quote Request</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-tertiary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-[var(--color-bg-base)] rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl text-[var(--color-text-tertiary)]">📋</span>
            </div>
            <h3 className="font-display text-lg text-[var(--color-text-primary)] mb-2">Your quote cart is empty</h3>
            <p className="text-[var(--color-text-tertiary)] mb-6">Browse our catalog and add products you'd like a bulk quote for.</p>
            <Link href="/products" onClick={() => setIsCartOpen(false)} className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {step === 1 ? (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="card-glass flex gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-[var(--color-text-primary)] truncate">{item.productName}</h4>
                        <p className="text-sm text-[var(--color-text-tertiary)] mt-1">Minimum Order: 500kg</p>

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border border-[var(--color-border-default)] rounded-xl">
                            <button
                              className="px-3 py-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-base)] transition-colors rounded-l-xl"
                              onClick={() => updateQuantity(item.productId, item.quantity - 100)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-16 text-center text-sm font-medium text-[var(--color-text-primary)]">{item.quantity} kg</span>
                            <button
                              className="px-3 py-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-base)] transition-colors rounded-r-xl"
                              onClick={() => updateQuantity(item.productId, item.quantity + 100)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-[var(--color-text-tertiary)] hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="m-6">
                  <div className="card-glass p-6">
                    <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[var(--color-text-tertiary)]">Name *</Label>
                          <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className="input" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[var(--color-text-tertiary)]">Company</Label>
                          <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Herbs LLC" className="input" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[var(--color-text-tertiary)]">Email *</Label>
                        <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" className="input" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[var(--color-text-tertiary)]">Phone</Label>
                          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234..." className="input" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[var(--color-text-tertiary)]">Country</Label>
                          <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" className="input" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[var(--color-text-tertiary)]">Additional Notes (Optional)</Label>
                        <Textarea
                          rows={4}
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Destination port, special requirements, forms..."
                          className="input resize-none"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--color-border-default)] bg-[var(--color-bg-base)]">
              {step === 1 ? (
                <button className="btn btn-primary w-full" onClick={() => setStep(2)}>
                  Proceed to Contact Details <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <div className="flex gap-3">
                  <button type="button" className="btn btn-secondary flex-1" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button type="submit" form="inquiry-form" disabled={isSubmitting} className="btn btn-primary flex-[2] disabled:opacity-50 disabled:pointer-events-none">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
