import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const media = await db.mediaFile.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            galleryItems: true,
            productImages: true,
            teamMembers: true,
            certificates: true,
          }
        }
      }
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    const usageCount = 
      media._count.galleryItems + 
      media._count.productImages + 
      media._count.teamMembers + 
      media._count.certificates

    if (usageCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete: Media is in use in ${usageCount} place(s).` 
      }, { status: 400 })
    }

    // Delete from Cloudinary
    if (media.type === 'VIDEO' || media.type === 'AUDIO') {
      await cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: 'video' })
    } else if (media.type === 'IMAGE' || media.type === 'PDF') {
      await cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: 'image' })
    } else {
      await cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: 'raw' })
    }

    // Delete from DB
    await db.mediaFile.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Media delete error:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
}
