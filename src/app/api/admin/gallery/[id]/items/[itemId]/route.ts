import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { itemId } = await params;
  await db.galleryItem.delete({ where: { id: itemId } })
  return NextResponse.json({ success: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { itemId } = await params;
  const { title, caption, isActive } = await req.json()
  const item = await db.galleryItem.update({
    where: { id: itemId },
    data: {
      ...(title !== undefined && { title }),
      ...(caption !== undefined && { caption }),
      ...(isActive !== undefined && { isActive }),
    },
    include: { mediaFile: true },
  })
  return NextResponse.json({ item })
}
