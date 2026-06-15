import { PrismaClient } from '@prisma/client'

// Ensure DATABASE_URL is set for development
if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
  // Try to read from .env.development.local by setting a default
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.ahemyitiynvjiuqouevt:E0qTK91vMAPh6xTl@aws-0-eu-west-3.pooler.supabase.com:6543/postgres'
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
