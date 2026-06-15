import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  pool?: Pool
  db?: ReturnType<typeof drizzle<typeof schema>>
}

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}

export const pool = globalForDb.pool ?? createPool()

export const db = globalForDb.db ?? drizzle(pool, { schema })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
  globalForDb.db = db
}

export function createId() {
  return crypto.randomUUID()
}

export function now() {
  return new Date()
}

export function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  )
}
