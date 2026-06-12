import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ChevronRight, Leaf, CheckCircle2, Package, Award, Scissors, FlaskConical } from 'lucide-react'
import { ProductActions } from '@/components/public/ProductActions'
import DOMPurify from 'isomorphic-dompurify'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Calendula Herbs For Import & Export`,
    description: product.shortDescription,
  }
}

const CUT_FORMS = ['Whole', 'Cut & Sifted', 'Powder', 'Tea Cut', 'Granulated']
const CERTIFICATIONS = ['EU Organic', 'USDA Organic', 'ISO 22000', 'HACCP', 'GMP']

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
    <div className="page-root">
      <div className="page-content" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
        <div className="container">
          
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-[var(--color-text-tertiary)] mb-10">
            <Link href="/" className="hover:text-[var(--color-green-600)] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/products" className="hover:text-[var(--color-green-600)] transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[var(--color-text-primary)] font-medium">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Images */}
            <div className="space-y-6">
              <div className="card-glass aspect-square relative overflow-hidden">
                {mainImage ? (
                  <Image src={mainImage} alt={product.name} fill className="card-product__image" priority />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-tertiary)]">
                    <Leaf className="w-20 h-20 opacity-30" />
                  </div>
                )}
              </div>
              
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="card-glass aspect-square relative overflow-hidden">
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
                  <Link key={c.categoryId} href={`/products?category=${c.category.slug}`} className="badge badge-green">
                    {c.category.name}
                  </Link>
                ))}
                {product.isOrganic && (
                  <span className="badge badge-green">
                    <Leaf className="w-3 h-3" />
                    {product.organicType || 'Organic Certified'}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-2">
                {product.name}
              </h1>
              {product.scientificName && (
                <p className="text-xl text-[var(--color-text-tertiary)] italic mb-6">{product.scientificName}</p>
              )}

              {/* MOQ Badge */}
              <div className="mb-6">
                <span className="badge badge-amber text-sm">
                  <Package className="w-4 h-4" />
                  Min. Order: 500–1,000 KG
                </span>
              </div>

              <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Product Highlights */}
              <div className="card-glass p-6 mb-8">
                <h3 className="text-sm font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">Product Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" />
                    <span>Free samples available for quality evaluation</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                    <Scissors className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" />
                    <span>Custom cut & labeling available upon request</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                    <Award className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" />
                    <span>EU Organic / USDA Organic certified options</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)]">
                    <FlaskConical className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" />
                    <span>Laboratory-tested for purity and active compounds</span>
                  </li>
                </ul>
              </div>

              {/* Cut Forms */}
              <div className="card-glass p-6 mb-8">
                <h3 className="text-sm font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">Available Cut Forms</h3>
                <div className="flex flex-wrap gap-2">
                  {CUT_FORMS.map(form => (
                    <span key={form} className="badge badge-sage">{form}</span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="card-glass p-6 mb-8">
                <h3 className="text-sm font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-4">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {CERTIFICATIONS.map(cert => (
                    <span key={cert} className="badge badge-green">
                      <Award className="w-3 h-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <ProductActions 
                productId={product.id}
                productName={product.name}
                minOrderKg={product.minOrderKg}
              />

              <div className="mt-12 space-y-8">
                {/* Product Specifications */}
                <div className="card-glass p-8">
                  <h3 className="text-2xl font-display font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                    Product Information
                  </h3>
                  {product.description ? (
                    <div className="text-[var(--color-text-secondary)] leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
                  ) : (
                    <ul className="space-y-3 text-[var(--color-text-secondary)]">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" /> High export quality standards</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" /> Available in whole, cut, or powder form upon request</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[var(--color-green-500)] shrink-0 mt-0.5" /> Carefully packaged to preserve aroma and medicinal properties</li>
                    </ul>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
