import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { CertType } from '@prisma/client'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  issuer: z.string().optional().nullable(),
  fileId: z.string().optional().nullable(),
  fileType: z.nativeEnum(CertType).optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = updateSchema.parse(await req.json())
    const cert = await db.certificate.update({ where: { id: params.id }, data })
    return NextResponse.json({ cert })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await db.certificate.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
