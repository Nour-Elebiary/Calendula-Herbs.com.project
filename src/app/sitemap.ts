import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://calendulaherbs.com'

  // Fetch dynamic content with fallback for build time when DATABASE_URL is not available
  let products: Array<{ slug: string; updatedAt: Date }> = []
  let categories: Array<{ slug: string }> = []

  try {
    [products, categories] = await Promise.all([
      db.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true }
      }),
      db.category.findMany({
        select: { slug: true }
      })
    ])
  } catch (error) {
    // During build time, database may not be available — fallback to static routes only
    console.warn('Could not fetch products and categories for sitemap:', error instanceof Error ? error.message : 'Unknown error')
  }

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/products',
    '/galleries',
    '/certificates'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Category routes (no updatedAt on Category model — use current date)
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
