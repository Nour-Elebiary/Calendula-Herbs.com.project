import React from 'react'
import { db } from '@/lib/db'
import { HelpCircle, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'FAQ | Calendula Herbs',
  description: 'Frequently asked questions about ordering, certifications, shipping, and quality at Calendula Herbs.',
}

type FaqItem = { question: string; answer: string }

const DEFAULT_FAQS: FaqItem[] = [
  { question: 'What is your minimum order quantity (MOQ)?', answer: 'Our standard MOQ is 500 kg per product. However, we can accommodate smaller trial orders for first-time buyers or sample requests. Contact our sales team for details.' },
  { question: 'What certifications do you hold?', answer: 'We hold multiple organic certifications including EU Organic, NOP (USDA), and other international standards. Visit our Certificates page for the full list.' },
  { question: 'Do you offer free samples?', answer: 'Yes, we offer free samples of up to 200g for qualified buyers. The buyer covers shipping costs. Submit a sample request through our website or contact us directly.' },
  { question: 'What are your shipping terms?', answer: 'We ship worldwide via air and sea freight. Common terms include FOB, CIF, and EXW depending on the destination and order volume. We work with reliable freight forwarders to ensure timely delivery.' },
  { question: 'What payment terms do you accept?', answer: 'Payment terms are discussed per order. Typical arrangements include T/T (wire transfer), L/C (letter of credit), and sometimes D/P. Contact us to discuss the best option for your order.' },
  { question: 'What is your typical lead time?', answer: 'Lead times vary by product and order size. Generally 7–14 days for stock items and 20–30 days for custom processing orders. We will provide an accurate timeline upon order confirmation.' },
  { question: 'Do you source from your own farms?', answer: 'Yes, we own and operate our own farms in Ibshaway, Fayoum, Egypt. We also work with trusted partner farmers under our direct supervision to ensure consistent quality and traceability.' },
  { question: 'How do you ensure product quality?', answer: 'Quality is ensured at every stage: seed selection, cultivation, harvesting, processing, and packaging. We conduct laboratory testing for purity, potency, and contamination. Our facilities follow GMP and HACCP guidelines.' },
  { question: 'Can I visit your farm or facility?', answer: 'Yes, we welcome visits from serious buyers. Please contact us in advance to schedule a tour of our farms, processing facilities, and quality control labs in Fayoum, Egypt.' },
  { question: 'How do I place an order?', answer: 'Browse our product catalog, add items to your inquiry cart, and submit the inquiry form. Our sales team will contact you within 24 hours with a detailed quotation and next steps.' },
]

function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <details key={index} className="group bg-white border rounded-xl overflow-hidden transition-shadow hover:shadow-md [&[open]]:shadow-md">
          <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer list-none">
            <span className="text-left font-medium text-neutral-900 pr-4">{item.question}</span>
            <ChevronDown className="h-5 w-5 text-primary shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-neutral-100 pt-4">
            <p className="text-neutral-600 leading-relaxed">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  )
}

export default async function FaqPage() {
  const setting = await db.siteSetting.findUnique({ where: { key: 'faqs' } })

  let faqs: FaqItem[] = DEFAULT_FAQS
  if (setting?.value) {
    try {
      const parsed = JSON.parse(setting.value)
      if (Array.isArray(parsed) && parsed.length > 0) faqs = parsed
    } catch {}
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-neutral-900 pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Everything you need to know about ordering from Calendula Herbs.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-3xl mt-16">
        {faqs.length === 0 ? (
          <div className="text-center py-24 border rounded-2xl bg-neutral-50">
            <HelpCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-neutral-900">No FAQs Available</h3>
          </div>
        ) : (
          <FaqAccordion items={faqs} />
        )}

        <div className="mt-16 p-8 bg-primary/5 border border-primary/10 rounded-2xl text-center">
          <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">Still have questions?</h2>
          <p className="text-neutral-600 mb-6">Our team is ready to help with any additional inquiries.</p>
          <a href="/contact" className="inline-flex items-center justify-center rounded-xl bg-primary text-white px-8 py-3 font-medium hover:bg-primary/90 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
