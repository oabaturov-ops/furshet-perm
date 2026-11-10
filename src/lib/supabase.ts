import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Клиент создаётся при первом обращении, а не при импорте модуля.
 * Поэтому `next build` не требует переменных окружения.
 * Внимание: работает под service_role и обходит RLS — только серверный код.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  if (!url || !key) {
    throw new Error('Не заданы SUPABASE_URL или SUPABASE_SERVICE_KEY')
  }
  if (!key.startsWith('eyJ')) {
    throw new Error(
      'SUPABASE_SERVICE_KEY выглядит неверно: ожидается JWT (~200 символов), начинающийся с eyJ'
    )
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}