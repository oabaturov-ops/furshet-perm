import { NextRequest, NextResponse } from 'next/server'
import { attachSession, passwordMatches } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  let password: unknown = ''
  try {
    const body = await request.json()
    password = body?.password
  } catch {
    return NextResponse.json({ error: 'Пустой запрос' }, { status: 400 })
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
  }

  return attachSession(NextResponse.json({ success: true }))
}