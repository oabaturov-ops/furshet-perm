import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'furshet_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 часов

function secret(): string {
  const value = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!value) throw new Error('ADMIN_PASSWORD не задан в .env')
  return value
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

// Сравнение за постоянное время: длина и содержимое не утекают по таймингу
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function passwordMatches(candidate: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (typeof candidate !== 'string' || !candidate || !expected) return false
  return safeEqual(candidate, expected)
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000
  const payload = String(expiresAt)
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  if (!safeEqual(signature, sign(payload))) return false
  const expiresAt = Number(payload)
  return Number.isFinite(expiresAt) && expiresAt > Date.now()
}

export function attachSession(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: createSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return response
}

export function clearSession(response: NextResponse): NextResponse {
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value)
}

/** Возвращает готовый 401-ответ, если вошедшего нет. Использовать в начале роута. */
export async function requireAdmin(): Promise<NextResponse | null> {
  const authorised = await isAdmin()
  if (authorised) return null
  return NextResponse.json({ error: 'Нужен вход в админку' }, { status: 401 })
}