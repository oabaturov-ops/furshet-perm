import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name = String(body.name ?? '').trim().slice(0, 120)
    const phone = String(body.phone ?? '').trim().slice(0, 40)
    const comment = String(body.comment ?? '').trim().slice(0, 1000)
    const honey = String(body.company ?? '').trim()

    if (honey) return NextResponse.json({ ok: true })

    if (name.length < 2) {
      return NextResponse.json({ error: 'Укажите имя' }, { status: 400 })
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ error: 'Укажите телефон' }, { status: 400 })
    }

    const { error } = await getSupabase().from('leads').insert({ name, phone, comment })
    if (error) throw error

    // Письмо не блокирует ответ: заявка уже в базе
    try {
      if (process.env.SMTP_HOST) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: false,
          requireTLS: true,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.ORDER_EMAIL,
          subject: 'Новая заявка с сайта',
          text: [
            'Заявка с сайта furshet-perm.ru',
            '',
            `Имя: ${name}`,
            `Телефон: ${phone}`,
            '',
            comment || '—',
          ].join('\n'),
        })
      }
    } catch (mailError) {
      console.error('lead email failed:', mailError)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('lead error:', e?.message)
    return NextResponse.json({ error: 'Не удалось отправить' }, { status: 500 })
  }
}