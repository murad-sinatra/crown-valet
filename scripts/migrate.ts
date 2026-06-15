import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.join(__dirname, '../db/migrations')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  const pool = new Pool({ connectionString })

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _schema_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const prismaTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = '_prisma_migrations'
      ) AS exists
    `)

    if (prismaTable.rows[0]?.exists) {
      const applied = await pool.query<{ migration_name: string }>(
        `SELECT migration_name FROM _prisma_migrations
         WHERE rolled_back_at IS NULL AND finished_at IS NOT NULL`,
      )

      for (const row of applied.rows) {
        await pool.query(
          `INSERT INTO _schema_migrations (id) VALUES ($1) ON CONFLICT DO NOTHING`,
          [row.migration_name],
        )
      }
    }

    const files = (await readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const file of files) {
      const id = file.replace(/\.sql$/, '')
      const existing = await pool.query('SELECT id FROM _schema_migrations WHERE id = $1', [id])

      if (existing.rowCount) {
        continue
      }

      const sql = await readFile(path.join(migrationsDir, file), 'utf8')
      console.log(`Applying migration ${file}`)
      await pool.query('BEGIN')
      try {
        await pool.query(sql)
        await pool.query('INSERT INTO _schema_migrations (id) VALUES ($1)', [id])
        await pool.query('COMMIT')
      } catch (error) {
        await pool.query('ROLLBACK')
        throw error
      }
    }

    console.log('Migrations complete')
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
