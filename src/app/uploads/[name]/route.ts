import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  // Только безопасные имена файлов: без слэшей и переходов вверх
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  const ext = (name.split('.').pop() || '').toLowerCase()
  const type = TYPES[ext]
  if (!type) {
    return new NextResponse('Unsupported type', { status: 415 })
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', name)
    const file = await readFile(filePath)

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': type,
        'Content-Length': String(file.byteLength),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}