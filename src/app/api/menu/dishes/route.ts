export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getDishes, createDish } from '@/lib/menu-store'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    const dishes = await getDishes()
    return NextResponse.json(dishes)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const body = await req.json()
    const dish = await createDish(body)
    return NextResponse.json(dish, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}