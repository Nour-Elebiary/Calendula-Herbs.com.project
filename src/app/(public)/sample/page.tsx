import React, { Suspense } from 'react'
import { db } from '@/lib/db'
import { FlaskConical, Package } from 'lucide-react'
import { SampleRequestForm } from './SampleRequestForm'

export const metadata = {
  title: 'Request a Sample | Calendula Herbs',
  description: 'Request free samples of our organic herbs, spices, and botanical products for quality evaluation.',
}

export default async function SamplePage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-neutral-900 pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Request a Sample</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Evaluate our quality firsthand. Request free samples of our organic products.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-4xl mt-16">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-4">How It Works</h2>
              <ul className="space-y-4">
                {[
                  { icon: Package, title: 'Select Products', desc: 'Choose the products you\'re interested in testing.' },
                  { icon: FlaskConical, title: 'We Prepare & Ship', desc: 'Our team prepares samples (50–200g) from current batch.' },
                  { icon: Package, title: 'Evaluate Quality', desc: 'Test for purity, potency, and consistency in your lab.' },
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{step.title}</h4>
                      <p className="text-sm text-neutral-500">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-50 border rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Important Notes</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li className="flex items-start gap-2 before:content-['•'] before:text-primary before:font-bold">Samples are free for qualified buyers.</li>
                <li className="flex items-start gap-2 before:content-['•'] before:text-primary before:font-bold">Shipping costs may apply depending on location and order value.</li>
                <li className="flex items-start gap-2 before:content-['•'] before:text-primary before:font-bold">Sample quantities typically range from 50g to 200g.</li>
                <li className="flex items-start gap-2 before:content-['•'] before:text-primary before:font-bold">Allow 5–10 business days for sample preparation and dispatch.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border rounded-3xl p-8 md:p-12 shadow-sm">
              <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">Submit Your Request</h2>
              <p className="text-neutral-500 mb-8">Fill out the form and our team will follow up within 24 hours.</p>
              <Suspense fallback={<div className="text-center py-8 text-neutral-400">Loading form...</div>}>
                <SampleRequestForm products={products} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
