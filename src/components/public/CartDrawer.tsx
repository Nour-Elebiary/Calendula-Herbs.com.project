'use client'

import React, { useState } from 'react'
import { useCart } from './CartProvider'
import { X, Trash2, Plus, Minus, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  
  // Form State
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
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="font-heading text-xl font-bold">Quote Request</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🛒</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Your quote cart is empty</h3>
            <p className="text-neutral-500 mb-6">Browse our catalog and add products you'd like a bulk quote for.</p>
            <Button onClick={() => setIsCartOpen(false)} asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {step === 1 ? (
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 p-4 border rounded-xl">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 truncate">{item.productName}</h4>
                        <p className="text-sm text-neutral-500 mt-1">Minimum Order: 500kg</p>
                        
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border rounded-lg">
                            <button 
                              className="px-3 py-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                              onClick={() => updateQuantity(item.productId, item.quantity - 100)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-16 text-center text-sm font-medium">{item.quantity} kg</span>
                            <button 
                              className="px-3 py-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                              onClick={() => updateQuantity(item.productId, item.quantity + 100)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Name *</Label>
                        <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Company</Label>
                        <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Herbs LLC" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label>Email *</Label>
                      <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Phone</Label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Country</Label>
                        <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label>Additional Notes (Optional)</Label>
                      <Textarea 
                        rows={4} 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="Destination port, special requirements, forms..." 
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-neutral-50/50">
              {step === 1 ? (
                <Button className="w-full text-base h-12" onClick={() => setStep(2)}>
                  Proceed to Contact Details <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="h-12 flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" form="inquiry-form" disabled={isSubmitting} className="h-12 flex-[2]">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
