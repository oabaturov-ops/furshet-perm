import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/menu-store'
import nodemailer from 'nodemailer'

function parsePrice(p: any): number {
  return Number(String(p).replace(/[^\d.]/g, '')) || 0
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const items = body.items || []
    const total = body.total ? parsePrice(body.total) : items.reduce((s: number, it: any) => s + parsePrice(it.price) * (it.quantity || 1), 0)

    await createOrder({
      customer_name: body.name || 'Не указано',
      phone: body.phone || '',
      address: body.address || '',
      items: items.map((it: any) => ({
        name: it.name,
        price: parsePrice(it.price),
        quantity: it.quantity || 1,
      })),
      total,
    })

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        requireTLS: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      const itemsHtml = items.map((it: any) => {
        const p = parsePrice(it.price)
        return `<tr><td style="padding:8px;border-bottom:1px solid #eee">${it.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${it.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${p} ₽</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${p * (it.quantity || 1)} ₽</td></tr>`
      }).join('')

      const emailHtml = `
        <h2 style="color:#e53935">Новый заказ — Фуршет Пермь</h2>
        <hr style="border:none;border-top:2px solid #e53935;margin:16px 0">
        <p><b>Имя:</b> ${body.name || 'Не указано'}</p>
        <p><b>Телефон:</b> ${body.phone || 'Не указан'}</p>
        ${body.address ? `<p><b>Адрес:</b> ${body.address}</p>` : ''}
        <table style="width:100%;border-collapse:collapse;margin-top:20px">
          <tr style="background:#f5f5f5">
            <th style="padding:10px;text-align:left;border:1px solid #ddd">Блюдо</th>
            <th style="padding:10px;text-align:center;border:1px solid #ddd">Кол-во</th>
            <th style="padding:10px;text-align:right;border:1px solid #ddd">Цена</th>
            <th style="padding:10px;text-align:right;border:1px solid #ddd">Сумма</th>
          </tr>
          ${itemsHtml}
        </table>
        <h3 style="margin-top:20px;color:#333">Итого: <span style="color:#e53935;font-size:24px">${total} ₽</span></h3>
      `

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ORDER_EMAIL,
        subject: 'Новый заказ — Фуршет Пермь',
        html: emailHtml,
      })
    } catch (emailErr) {
      console.error('Email failed, order saved to DB:', emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Order error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}