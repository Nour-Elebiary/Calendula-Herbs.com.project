import React from 'react'
import Image from 'next/image'
import { db } from '@/lib/db'
import { Award } from 'lucide-react'

export const metadata = {
  title: 'Certificates | Calendula Herbs',
  description: 'Our organic and quality assurance certificates.',
}

export default async function CertificatesPage() {
  const certificates = await db.certificate.findMany({
    where: { isActive: true },
    include: { file: true },
    orderBy: { order: 'asc' }
  })

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-900 pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Quality & Certifications</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          We adhere to the highest international standards for organic farming, processing, and export.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl mt-16">
        {certificates.length === 0 ? (
          <div className="text-center py-24 border rounded-2xl bg-neutral-50">
            <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-neutral-900">No Certificates Available</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {certificates.map(cert => {
              const fileUrl = cert.file?.url
              const isPdf = cert.fileType === 'PDF'

              return (
                <div key={cert.id} className="bg-white border rounded-2xl p-6 flex flex-col items-center text-center transition-shadow hover:shadow-xl hover:border-primary/30">
                  <div className="w-full aspect-[3/4] relative bg-neutral-50 rounded-xl mb-6 overflow-hidden border">
                    {fileUrl ? (
                      isPdf ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline flex flex-col items-center gap-2">
                            <span className="text-4xl">📄</span>
                            View PDF
                          </a>
                        </div>
                      ) : (
                        <Image src={fileUrl} alt={cert.title} fill className="object-contain p-4" />
                      )
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="w-12 h-12 text-neutral-200" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-neutral-900">{cert.title}</h3>
                  {cert.issuer && (
                    <p className="text-sm text-neutral-500 mt-1 uppercase tracking-wider">{cert.issuer}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
