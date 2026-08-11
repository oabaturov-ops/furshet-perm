import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, items, totalPrice, comment } = body;

    if (!customerName || !customerPhone || !items || !items.length) {
      return NextResponse.json(
        { error: 'Заполните имя, телефон и добавьте блюда в заказ' },
        { status: 400 }
      );
    }

    // Build email HTML
    const itemsHtml = items
      .map(
        (item: { name: string; price: number; quantity: number }) =>
          `<tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price} \u0440\u0443\u0431.</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price * item.quantity} \u0440\u0443\u0431.</td>
          </tr>`
      )
      .join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #e53935; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">\u0424\u0423\u0420\u0428\u0415\u0422 \u041f\u0415\u0420\u041c\u042c</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">\u041d\u043e\u0432\u044b\u0439 \u0437\u0430\u043a\u0430\u0437</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">\u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u043a\u043b\u0438\u0435\u043d\u0442\u0435</h2>
          <p><strong>\u0418\u043c\u044f:</strong> ${customerName}</p>
          <p><strong>\u0422\u0435\u043b\u0435\u0444\u043e\u043d:</strong> ${customerPhone}</p>
          ${customerEmail ? `<p><strong>Email:</strong> ${customerEmail}</p>` : ''}
          ${comment ? `<p><strong>\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439:</strong> ${comment}</p>` : ''}

          <h2 style="color: #333; margin-top: 24px;">\u0421\u043e\u0441\u0442\u0430\u0432 \u0437\u0430\u043a\u0430\u0437\u0430</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px 12px; text-align: left; border-bottom: 2px solid #ddd;">\u0411\u043b\u044e\u0434\u043e</th>
                <th style="padding: 8px 12px; text-align: center; border-bottom: 2px solid #ddd;">\u041a\u043e\u043b-</u0432\u043e</th>
                <th style="padding: 8px 12px; text-align: right; border-bottom: 2px solid #ddd;">\u0426\u0435\u043d\u0430</th>
                <th style="padding: 8px 12px; text-align: right; border-bottom: 2px solid #ddd;">\u0421\u0443\u043c\u043c\u0430</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 16px; font-size: 18px;">
            <strong>\u0418\u0442\u043e\u0433\u043e: ${totalPrice} \u0440\u0443\u0431.</strong>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 12px 20px; text-align: center; color: #999; font-size: 12px;">
          \u042d\u0442\u043e \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0441 \u0441\u0430\u0439\u0442\u0430 \u0444\u0443\u0440\u0448\u0435\u0442-\u043f\u0435\u0440\u043c.\u0440\u0443
        </div>
      </div>
    `;

    const orderTime = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Yekaterinburg' });

    await transporter.sendMail({
      from: `"\u0424\u0443\u0440\u0448\u0435\u0442 \u041f\u0435\u0440\u043c\u044c" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_EMAIL,
      subject: `\u041d\u043e\u0432\u044b\u0439 \u0437\u0430\u043a\u0430\u0437 | ${customerName} | ${orderTime}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, message: 'Заказ отправлен' });
  } catch (error) {
    console.error('Order send error:', error);
    return NextResponse.json(
      { error: 'Ошибка отправки заказа. Попробуйте позже.' },
      { status: 500 }
    );
  }
}
