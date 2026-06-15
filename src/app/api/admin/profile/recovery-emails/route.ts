import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  recoveryEmails: z.array(z.string().email()),
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { recoveryEmails } = parsed.data

    await db.admin.update({
      where: { id: session.user.id },
      data: { recoveryEmails },
    })

    return NextResponse.json({ success: true, recoveryEmails })
  } catch (err) {
    console.error('[UPDATE RECOVERY EMAILS]', err)
    return NextResponse.json({ error: 'Failed to update recovery emails' }, { status: 500 })
  }
}
