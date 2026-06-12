import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Leaf, Search, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const metadata = {
  title: 'Our Products | Calendula Herbs For Import & Export',
  description: 'Browse our catalog of premium bulk herbs, spices, and seeds for export. Minimum order quantities from 500 KG. Request a quote for your import needs.',
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams

  const [categories, products] = await Promise.all([
    db.category.findMany({ orderBy: { order: 'asc' } }),
    db.product.findMany({
      where: {
        isActive: true,
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
        ...(category ? { categories: { some: { category: { slug: category } } } } : {})
      },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1, include: { mediaFile: true } },
        categories: { include: { category: true } }
      },
      orderBy: { order: 'asc' }
    })
  ])

  return (
    <div className="page-root">
      <div className="page-content">
        {/* Header */}
        <section className="section section--tint text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-text-primary)] mb-4">
            Our Products
          </h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
            Premium bulk herbs, spices, and seeds for global importers and manufacturers. All products available for export with full certification.
          </p>
        </section>

        <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar / Filters */}
            <div className="w-full md:w-64 shrink-0 space-y-6">
              <div className="card-glass p-6">
                <form className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                  <Input 
                    name="q"
                    defaultValue={q}
                    placeholder="Search products..." 
                    className="pl-10 bg-[var(--color-glass-fill)]"
                  />
                  {category && <input type="hidden" name="category" value={category} />}
                </form>

                <h3 className="font-display font-bold text-lg text-[var(--color-text-primary)] mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href={q ? `/products?q=${q}` : `/products`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-[var(--color-green-500)] text-[var(--color-text-inverse)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'}`}
                    >
                      All Products
                    </Link>
                  </li>
                  {categories.map(c => (
                    <li key={c.id}>
                      <Link 
                        href={`/products?category=${c.slug}${q ? `&q=${q}` : ''}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === c.slug ? 'bg-[var(--color-green-500)] text-[var(--color-text-inverse)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {products.length === 0 ? (
                <div className="card-glass p-16 text-center">
                  <Leaf className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4 opacity-40" />
                  <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">No products found</h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">Try adjusting your search or category filter.</p>
                  <Link href="/products" className="btn btn-primary">Clear Filters</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const mainImage = product.images[0]?.mediaFile.url
                    return (
                      <Link key={product.id} href={`/products/${product.slug}`} className="card-glass card-product group">
                        <div className="card-product__stage">
                          {mainImage ? (
                            <Image 
                              src={mainImage} 
                              alt={product.name} 
                              fill 
                              className="card-product__image" 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-tertiary)]">
                              <Leaf className="w-10 h-10 opacity-30" />
                            </div>
                          )}
                          {product.isOrganic && (
                            <span className="badge badge-green absolute top-3 left-3 z-10">
                              {product.organicType || 'Organic'}
                            </span>
                          )}
                        </div>
                        <div className="card-product__body">
                          <div className="flex flex-wrap gap-1">
                            {product.categories.slice(0, 2).map(c => (
                              <span key={c.categoryId} className="card-product__label">
                                {c.category.name}
                              </span>
                            ))}
                          </div>
                          <h3 className="card-product__name group-hover:text-[var(--color-green-600)] transition-colors">
                            {product.name}
                          </h3>
                          {product.scientificName && (
                            <p className="card-product__cuts italic">{product.scientificName}</p>
                          )}
                          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                            {product.shortDescription || 'Contact us for bulk export quotes and full specifications.'}
                          </p>
                          <div className="card-product__footer">
                            <span className="badge badge-amber text-[10px]">
                              <Package className="w-3 h-3" />
                              Min. 500–1,000 KG
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
