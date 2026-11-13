import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { getDb } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params
  const body = await req.json()

  try {
    await getDb().query('update comments set is_approved = $1 where id = $2', [
      !!body.is_approved,
      id,
    ])
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { id } = await params

  try {
    await getDb().query('delete from comments where id = $1', [id])
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}