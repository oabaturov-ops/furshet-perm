import { NextResponse } from 'next/server'
import { readMenu } from '@/lib/menu-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = readMenu()
    const menu = data.categories.map(cat => ({
      ...cat,
      dishes: data.dishes.filter(d => d.categoryId === cat.id).sort((a,b) => a.sortOrder - b.sortOrder)
    }))
    return NextResponse.json(menu)
  } catch (e) {
    return NextResponse.json({ error: 'шибка' }, { status: 500 })
  }
}
