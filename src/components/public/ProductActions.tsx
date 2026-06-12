'use client'

import React, { useState } from 'react'
import { useCart } from './CartProvider'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  productId: string
  productName: string
  minOrderKg: number
}

export function ProductActions({ productId, productName, minOrderKg }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(minOrderKg)
  const [sampleOpen, setSampleOpen] = useState(false)
  
  // Sample form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sName, setSName] = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sCompany, setSCompany] = useState('')
  const [sAddress, setSAddress] = useState('')
  const [sShipping] = useState<'buyer' | 'calendula'>('buyer')
  const [sNotes, setSNotes] = useState('')

  const handleAddToCart = () => {
    addItem({ productId, productName, quantity })
    toast.success(`${productName} added to quote cart`)
  }

  const submitSample = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/public/sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          quantity: 'Standard Sample',
          name: sName,
          email: sEmail,
          company: sCompany,
          address: sAddress,
          shippingBy: sShipping,
          notes: sNotes
        })
      })
      if (res.ok) {
        toast.success('Sample request submitted')
        setSampleOpen(false)
      } else {
        toast.error('Failed to submit request')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-neutral-50 p-6 rounded-2xl border space-y-6">
        <div>
          <Label className="text-neutral-500 mb-2 block">Bulk Inquiry Quantity (kg)</Label>
          <div className="flex items-center">
            <Input 
              type="number" 
              min={minOrderKg} 
              step={100}
              value={quantity}
              onChange={e => setQuantity(Math.max(minOrderKg, parseInt(e.target.value) || minOrderKg))}
              className="text-lg h-12 w-32 rounded-r-none border-r-0 focus-visible:ring-0"
            />
            <div className="bg-white border border-l-0 h-12 px-4 flex items-center text-neutral-500 rounded-r-md">kg</div>
          </div>
          <p className="text-xs text-neutral-400 mt-2">Minimum order quantity: {minOrderKg} kg</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleAddToCart} size="lg" className="w-full h-14 text-base rounded-xl">
            <ShoppingCart className="w-5 h-5 mr-2" /> Add to Quote Cart
          </Button>
          <Button variant="outline" onClick={() => setSampleOpen(true)} size="lg" className="w-full h-14 text-base rounded-xl border-primary text-primary hover:bg-primary/5">
            <Package className="w-5 h-5 mr-2" /> Request a Sample
          </Button>
        </div>
      </div>

      <Dialog open={sampleOpen} onOpenChange={setSampleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Sample: {productName}</DialogTitle>
            <DialogDescription>
              We provide product samples for quality evaluation. Please note that shipping costs are typically covered by the buyer.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSample} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Contact Name *</Label>
                <Input required value={sName} onChange={e => setSName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" required value={sEmail} onChange={e => setSEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input value={sCompany} onChange={e => setSCompany(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Shipping Address *</Label>
              <Textarea required value={sAddress} onChange={e => setSAddress(e.target.value)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Shipping Account (DHL/FedEx) or Notes</Label>
              <Textarea value={sNotes} onChange={e => setSNotes(e.target.value)} placeholder="Provide your courier account number if you want to cover shipping..." rows={2} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setSampleOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Request Sample'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
