import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { requireAdmin } from '@/lib/admin-auth'

const MAX_BYTES = 8 * 1024 * 1024 // 8 МБ

export async function POST(request: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const fd = await request.formData()
    const file = fd.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Файл больше 8 МБ' }, { status: 400 })
    }

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Папка смонтирована томом Docker, поэтому файлы переживают пересборку
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))

    return NextResponse.json({ url: `/uploads/${name}` })
  } catch (error: any) {
    console.error('upload error:', error?.message)
    return NextResponse.json({ error: 'Не удалось загрузить файл' }, { status: 500 })
  }
}