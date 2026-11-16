import { Pool } from 'pg'

let pool: Pool | null = null

/**
 * Пул создаётся при первом обращении, поэтому сборка не требует DATABASE_URL.
 */
export function getDb(): Pool {
  if (pool) return pool

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Не задан DATABASE_URL')
  }

  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Supabase требует SSL; свой Postgres в Docker — нет
    ssl: connectionString.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : undefined,
  })

  pool.on('error', (error) => {
    console.error('[db] ошибка простаивающего клиента:', error)
  })

  return pool
}