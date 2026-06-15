import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const page = parseInt(sp.get('page') || '1')
  const unread = sp.get('unread')
  const limit = 20

  const where = unread === 'true' ? { isRead: false } : {}

  const [requests, total] = await Promise.all([
    db.productRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.productRequest.count({ where }),
  ])

  return NextResponse.json({ requests, total, totalPages: Math.ceil(total / limit) })
}
