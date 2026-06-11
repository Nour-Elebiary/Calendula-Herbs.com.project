import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  await db.galleryItem.delete({ where: { id: params.itemId } })
  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const { title, caption, isActive } = await req.json()
  const item = await db.galleryItem.update({
    where: { id: params.itemId },
    data: {
      ...(title !== undefined && { title }),
      ...(caption !== undefined && { caption }),
      ...(isActive !== undefined && { isActive }),
    },
    include: { mediaFile: true },
  })
  return NextResponse.json({ item })
}
