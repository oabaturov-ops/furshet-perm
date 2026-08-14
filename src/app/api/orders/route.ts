import { NextResponse } from 'next/server'
import { getOrders } from '@/lib/menu-store'

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}