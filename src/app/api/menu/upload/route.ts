import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const fd = await request.formData()
    const file = fd.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(file.name) || '.jpg'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
    await writeFile(path.join(process.cwd(), 'public', 'images', 'dishes', safeName), buffer)
    return NextResponse.json({ url: `/images/dishes/${safeName}` })
  } catch (e) { return NextResponse.json({ error: 'Upload failed' }, { status: 500 }) }
}