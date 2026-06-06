import { createRequire } from 'node:module'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client') as {
  PrismaClient: typeof import('../../generated/prisma/client').PrismaClient
}

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>
  prismaPool?: Pool
}

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaPool = pool
  globalForPrisma.prisma = prisma
}
