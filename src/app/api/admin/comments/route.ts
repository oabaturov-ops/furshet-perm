import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { rows } = await getDb().query(
      'select * from comments order by created_at desc'
    )
    return NextResponse.json(rows)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}