'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'

type LightboxItem = {
  id: string
  type: string
  url?: string | null
  thumbnailUrl?: string | null
  title?: string | null
  caption?: string | null
}

export function GalleryLightbox({ items }: { items: LightboxItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const open = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const close = useCallback(() => setIsOpen(false), [])

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % items.length)
  }, [items.length])

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, next, prev])

  const current = items[currentIndex]
  const imgUrl = current?.url || current?.thumbnailUrl
  const isVideo = current?.type === 'UPLOADED_VIDEO' || current?.type === 'YOUTUBE'

  return (
    <>
      {items.map((item, index) => {
        const itemImgUrl = item.url || item.thumbnailUrl
        return (
          <button
            key={item.id}
            onClick={() => open(index)}
            className="group relative aspect-square bg-neutral-100 rounded-xl overflow-hidden cursor-pointer text-left"
          >
            {itemImgUrl ? (
              <Image
                src={itemImgUrl}
                alt={item.title || 'Gallery image'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {isVideo ? <Play className="w-10 h-10 text-neutral-300" /> : <Image src="/file.svg" alt="" width={40} height={40} className="text-neutral-300" />}
              </div>
            )}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center pl-1">
                  <Play className="w-5 h-5 text-neutral-900" />
                </div>
              </div>
            )}
            {(item.title || item.caption) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                {item.title && <h4 className="text-white font-medium text-sm">{item.title}</h4>}
                {item.caption && <p className="text-white/80 text-xs mt-1 line-clamp-2">{item.caption}</p>}
              </div>
            )}
          </button>
        )
      })}

      {isOpen && imgUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 z-10 p-3 text-white/70 hover:text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 z-10 p-3 text-white/70 hover:text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-[90vw] max-h-[80vh]">
              <Image
                src={imgUrl}
                alt={current?.title || 'Gallery image'}
                fill
                className="object-contain"
                priority
              />
            </div>
            {(current?.title || current?.caption) && (
              <div className="text-center mt-4 max-w-2xl">
                {current?.title && <p className="text-white font-medium">{current.title}</p>}
                {current?.caption && <p className="text-white/60 text-sm mt-1">{current.caption}</p>}
              </div>
            )}
            <p className="text-white/40 text-xs mt-3">
              {currentIndex + 1} / {items.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
