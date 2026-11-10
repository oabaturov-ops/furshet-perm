import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

if (!url || !key) {
  throw new Error('Не заданы SUPABASE_URL или SUPABASE_SERVICE_KEY')
}

// Внимание: этот клиент обходит RLS. Использовать только в серверном коде
// (route handlers, server components). Никогда не импортировать в клиентские компоненты.
export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

if (!url || !key) {
  throw new Error('Не заданы SUPABASE_URL или SUPABASE_SERVICE_KEY')
}

if (!key.startsWith('eyJ')) {
  throw new Error(
    'SUPABASE_SERVICE_KEY выглядит неверно: ожидается JWT длиной ~200 символов, начинающийся с eyJ'
  )
}