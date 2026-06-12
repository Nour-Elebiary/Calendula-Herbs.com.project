import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  managingEmails: z.array(z.string()).optional(),
  mapAddress: z.string().nullable().optional(),
  mapLat: z.number().nullable().optional(),
  mapLng: z.number().nullable().optional(),
  phones: z.array(z.string()).optional(),
  publicEmails: z.array(z.string()).optional(),
  businessHours: z.string().nullable().optional(),
  autoReplySubject: z.string().nullable().optional(),
  autoReplyMessage: z.string().nullable().optional(),
  formEnabled: z.boolean().optional(),
})

export async function GET() {
  try {
    const contact = await db.contactSetting.findUnique({ where: { id: 'main' } })
    return NextResponse.json({ contact })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch contact settings' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const json = await req.json()
    const data = schema.parse(json)

    const contact = await db.contactSetting.upsert({
      where: { id: 'main' },
      update: data,
      create: { id: 'main', ...data },
    })

    return NextResponse.json({ contact })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues }, { status: 400 })
    console.error(err)
    return NextResponse.json({ error: 'Failed to save contact settings' }, { status: 500 })
  }
}
