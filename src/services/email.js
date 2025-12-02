import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderShippedEmail = async (email, orderId, trackingNumber) => {
  await transporter.sendMail({
    from: `"IStore" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Ваше замовлення №${orderId} відправлено`,
    html: `
      <h2>Ваше замовлення відправлено 📦</h2>
      <p>Замовлення <b>№${orderId}</b> було успішно передано кур'єрській службі.</p>
      <p>Номер ТТН: <b>${trackingNumber}</b></p>

      <p>Дякуємо, що обрали IStore!</p>
    `,
  });
};
