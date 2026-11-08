import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

const MAX_BYTES = 8 * 1024 * 1024 // 8 МБ

export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const fd = await request.formData()
    const file = fd.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Файл больше 8 МБ' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage
      .from('dishes')
      .upload(safeName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data } = supabase.storage.from('dishes').getPublicUrl(safeName)

    return NextResponse.json({ url: data.publicUrl })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}