import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ChevronRight, Leaf, Info, CheckCircle2 } from 'lucide-react'
import { ProductActions } from '@/components/public/ProductActions'
import DOMPurify from 'isomorphic-dompurify'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Calendula Herbs`,
    description: product.shortDescription,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' }, include: { mediaFile: true } },
      categories: { include: { category: true } }
    }
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const mainImage = product.images[0]?.mediaFile.url
  const galleryImages = product.images.slice(1)

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-neutral-500 mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-neutral-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="aspect-square relative bg-neutral-100 rounded-3xl overflow-hidden border">
              {mainImage ? (
                <Image src={mainImage} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                  <Leaf className="w-20 h-20 opacity-30" />
                </div>
              )}
            </div>
            
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="aspect-square relative bg-neutral-100 rounded-xl overflow-hidden border">
                    <Image src={img.mediaFile.url} alt="" fill className="object-cover hover:opacity-90 transition-opacity cursor-pointer" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            
            <div className="flex flex-wrap gap-2 mb-4">
              {product.categories.map(c => (
                <Link key={c.categoryId} href={`/products?category=${c.category.slug}`} className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/5 px-3 py-1 rounded-full hover:bg-primary/10 transition-colors">
                  {c.category.name}
                </Link>
              ))}
              {product.isOrganic && (
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wider bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  {product.organicType || 'Organic Certified'}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-2">
              {product.name}
            </h1>
            {product.scientificName && (
              <p className="text-xl text-neutral-500 italic mb-6">{product.scientificName}</p>
            )}

            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            <ProductActions 
              productId={product.id}
              productName={product.name}
              minOrderKg={product.minOrderKg}
            />

            <div className="mt-12 space-y-8">
              {/* Product Specifications */}
              <div>
                <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> Product Information
                </h3>
                {product.description ? (
                  <div className="prose prose-neutral max-w-none text-neutral-600" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
                ) : (
                  <ul className="space-y-3 text-neutral-600">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> High export quality standards</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Available in whole, cut, or powder form upon request</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> Carefully packaged to preserve aroma and medicinal properties</li>
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
