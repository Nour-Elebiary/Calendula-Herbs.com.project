import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const gallery = await db.gallery.findUnique({
    where: { id: params.id },
    include: { items: { orderBy: { order: 'asc' }, include: { mediaFile: true } } },
  })
  if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ gallery })
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const json = await req.json()
    const data = updateSchema.parse(json)
    const gallery = await db.gallery.update({ where: { id: params.id }, data })
    return NextResponse.json({ gallery })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db.gallery.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
