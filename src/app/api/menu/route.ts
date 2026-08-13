import { NextResponse } from 'next/server'
import { getCategories, getDishes } from '@/lib/menu-store'

export async function GET() {
  try {
    const [categories, dishes] = await Promise.all([getCategories(), getDishes()])
    return NextResponse.json({ categories, dishes })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}