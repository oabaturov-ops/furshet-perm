export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getOrders } from '@/lib/menu-store'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}