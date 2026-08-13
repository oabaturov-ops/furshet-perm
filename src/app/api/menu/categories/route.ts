import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/menu-store'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (e: any) {
    console.error('GET categories error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const category = await createCategory(body.name)
    return NextResponse.json(category, { status: 201 })
  } catch (e: any) {
    console.error('POST categories error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}