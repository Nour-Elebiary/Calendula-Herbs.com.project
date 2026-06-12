import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Leaf, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Products | Calendula Herbs',
  description: 'Browse our catalog of premium organic herbs, spices, and seeds.',
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
    <div className="bg-neutral-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-900 pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Our Products</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Browse our complete catalog of premium botanicals. All products are available for bulk export.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl -mt-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <form className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input 
                  name="q"
                  defaultValue={q}
                  placeholder="Search products..." 
                  className="pl-9 bg-neutral-50 border-transparent focus:bg-white"
                />
                {category && <input type="hidden" name="category" value={category} />}
              </form>

              <h3 className="font-heading font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href={q ? `/products?q=${q}` : `/products`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-primary text-white font-medium' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <Link 
                      href={`/products?category=${c.slug}${q ? `&q=${q}` : ''}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === c.slug ? 'bg-primary text-white font-medium' : 'text-neutral-600 hover:bg-neutral-100'}`}
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
              <div className="bg-white rounded-2xl border p-16 text-center">
                <Leaf className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-500 mb-6">Try adjusting your search or category filter.</p>
                <Button variant="outline" asChild><Link href="/products">Clear Filters</Link></Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const mainImage = product.images[0]?.mediaFile.url
                  return (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                      <div className="aspect-[4/3] relative bg-neutral-100 overflow-hidden">
                        {mainImage ? (
                          <Image 
                            src={mainImage} 
                            alt={product.name} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                            <Leaf className="w-10 h-10 opacity-30" />
                          </div>
                        )}
                        {product.isOrganic && (
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                            {product.organicType || 'Organic'}
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.categories.slice(0, 2).map(c => (
                            <span key={c.categoryId} className="text-xs text-neutral-400 uppercase tracking-wider">
                              {c.category.name}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-heading font-bold text-neutral-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        {product.scientificName && (
                          <p className="text-xs text-neutral-500 italic mb-3 line-clamp-1">{product.scientificName}</p>
                        )}
                        <p className="text-neutral-600 text-sm line-clamp-2 mt-auto">
                          {product.shortDescription || 'Contact us for bulk export quotes and full specifications.'}
                        </p>
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
  )
}
