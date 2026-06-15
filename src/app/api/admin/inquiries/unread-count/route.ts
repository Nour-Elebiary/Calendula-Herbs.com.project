import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [contact, cart, samples, productRequests] = await Promise.all([
    db.contactSubmission.count({ where: { isRead: false } }),
    db.cartInquiry.count({ where: { isRead: false } }),
    db.sampleRequest.count({ where: { isRead: false } }),
    db.productRequest.count({ where: { isRead: false } }),
  ])

  return NextResponse.json({ contact, cart, samples, productRequests, total: contact + cart + samples + productRequests })
}
