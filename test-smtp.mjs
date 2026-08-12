import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'Furshetperm159@yandex.ru',
    pass: 'zygadnfrhvookjnd',
  },
});

try {
  const info = await transporter.sendMail({
    from: '"Тест" <furshetperm159@yandex.ru>',
    to: 'oba12@yandex.ru',
    subject: 'Тест',
    text: 'Работает!',
  });
  console.log('OK:', info.messageId);
} catch (e) {
  console.error('ERROR:', e.message);
}