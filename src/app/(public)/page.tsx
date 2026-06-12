import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Leaf } from 'lucide-react'

export const metadata = {
  title: 'Home | Calendula Herbs',
  description: 'Premium organic herbs, spices & seeds from Egypt.',
}

export default async function HomePage() {
  const [featuredProducts, certificates, settingsRow] = await Promise.all([
    db.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { images: { orderBy: { order: 'asc' }, take: 1, include: { mediaFile: true } } },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    db.certificate.findMany({
      where: { isActive: true },
      include: { file: true },
      orderBy: { order: 'asc' },
      take: 4,
    }),
    db.siteSetting.findMany({
      where: { key: { in: ['site_tagline', 'company_founded'] } }
    })
  ])

  const settings: Record<string, string> = {}
  settingsRow.forEach(s => { settings[s.key] = s.value })

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract organic gradient background since Cloudinary isn't fully configured with a guaranteed hero image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4f24] to-[#2d7a3a]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Premium Export Quality</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight">
            {settings.site_tagline || 'Rooted in Nature, Exported with Care.'}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
            We supply the world with the finest organic herbs, spices, and seeds sourced directly from Egypt's fertile lands since {settings.company_founded || '2005'}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="text-lg px-8 rounded-full h-14 bg-white text-primary hover:bg-neutral-100" asChild>
              <Link href="/products">View Our Catalog <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 rounded-full h-14 border-white text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/about">Discover Our Farm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-neutral-50 border-b">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-heading font-bold text-primary mb-2">100%</h3>
              <p className="text-neutral-600">Organic Certified</p>
            </div>
            <div>
              <h3 className="text-3xl font-heading font-bold text-primary mb-2">{settings.company_founded ? new Date().getFullYear() - parseInt(settings.company_founded) : 15}+</h3>
              <p className="text-neutral-600">Years of Experience</p>
            </div>
            <div>
              <h3 className="text-3xl font-heading font-bold text-primary mb-2">50+</h3>
              <p className="text-neutral-600">Countries Served</p>
            </div>
            <div>
              <h3 className="text-3xl font-heading font-bold text-primary mb-2">B2B</h3>
              <p className="text-neutral-600">Bulk Wholesale Focus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-heading font-bold text-neutral-900 mb-4">Featured Products</h2>
              <p className="text-lg text-neutral-600">
                Discover our most sought-after botanicals, meticulously grown and processed to meet international standards.
              </p>
            </div>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/products">View All Products <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const mainImage = product.images[0]?.mediaFile.url
              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                  <div className="bg-neutral-50 rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                    <div className="aspect-[4/3] relative bg-neutral-200 overflow-hidden">
                      {mainImage ? (
                        <Image 
                          src={mainImage} 
                          alt={product.name} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                          <Leaf className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                      {product.isOrganic && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                          {product.organicType || 'Organic'}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold text-neutral-900 mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.scientificName && (
                        <p className="text-sm text-neutral-500 italic mb-3">{product.scientificName}</p>
                      )}
                      <p className="text-neutral-600 line-clamp-2 text-sm">
                        {product.shortDescription || 'Premium export quality product. Contact us for bulk quotes and specifications.'}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-24 bg-neutral-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <h2 className="text-4xl font-heading font-bold">Cultivating Excellence.</h2>
              <div className="space-y-4 text-lg text-neutral-300 font-light">
                <p>
                  From the fertile banks of the Nile to global markets, Calendula Herbs bridges the gap between traditional farming and modern quality standards.
                </p>
                <p>
                  Our state-of-the-art processing facilities ensure that every leaf, seed, and flower retains its natural potency, aroma, and color. We don't just supply ingredients; we deliver reliability.
                </p>
              </div>
              <ul className="space-y-3 font-medium text-white pt-4">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> End-to-end traceability</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> GMP-compliant processing</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Sustainable farming practices</li>
              </ul>
              <div className="pt-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative h-[500px] rounded-3xl overflow-hidden hidden lg:block">
              {/* Fallback pattern block */}
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl flex items-center justify-center">
                <Leaf className="w-48 h-48 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Certifications (if any) */}
      {certificates.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-12">Our Quality Guarantee</h2>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {certificates.map((cert) => (
                <div key={cert.id} className="relative w-32 h-32 flex flex-col items-center justify-center">
                  {cert.file ? (
                    <Image src={cert.file.url} alt={cert.title} fill className="object-contain" />
                  ) : (
                    <div className="font-bold text-neutral-400">{cert.title}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
