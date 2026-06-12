import React from 'react'
import { db } from '@/lib/db'
import { ImageIcon } from 'lucide-react'
import { GalleryLightbox } from '@/components/public/GalleryLightbox'

export const metadata = {
  title: 'Galleries | Calendula Herbs',
  description: 'Explore our farms, processing facilities, and products through our media galleries.',
}

export default async function GalleriesPage() {
  const galleries = await db.gallery.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: { mediaFile: true }
      }
    },
    orderBy: { order: 'asc' }
  })

  const activeGalleries = galleries.filter(g => g.items.length > 0)

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-neutral-900 pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Media Galleries</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          A visual journey through our farms, state-of-the-art processing facilities, and premium products.
        </p>
      </div>

      <div className="container mx-auto px-6 max-w-7xl mt-16 space-y-24">
        {activeGalleries.length === 0 ? (
          <div className="text-center py-24 border rounded-2xl bg-neutral-50">
            <ImageIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-neutral-900">No Galleries Available</h3>
            <p className="text-neutral-500 mt-2">Check back later for photos and videos.</p>
          </div>
        ) : (
          activeGalleries.map(gallery => (
            <div key={gallery.id} className="space-y-8">
              <div className="border-b pb-4">
                <h2 className="text-3xl font-heading font-bold text-neutral-900">{gallery.name}</h2>
                {gallery.description && (
                  <p className="text-neutral-600 mt-2 text-lg">{gallery.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <GalleryLightbox
                  items={gallery.items.map(item => ({
                    id: item.id,
                    type: item.type,
                    url: item.mediaFile?.url,
                    thumbnailUrl: item.thumbnailUrl,
                    title: item.title,
                    caption: item.caption,
                  }))}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
