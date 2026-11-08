import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/admin-auth'

export async function POST() {
  return clearSession(NextResponse.json({ ok: true }))
}