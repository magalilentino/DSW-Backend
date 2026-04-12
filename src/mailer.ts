// mailer.ts
import nodemailer from 'nodemailer';

export async function sendDiscountMail(mailCliente: string, descuentos: number[]) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS,
    },
  });

  const lista = descuentos.map(d => `<li>${d}%</li>`).join("");

  await transporter.sendMail({
    from: process.env.MAIL_USER,//'"Tu Peluquería" <no-reply@tupeluqueria.com>',
    to: mailCliente,
    subject: '¡Nuevo descuento desbloqueado!',
    html: `
      <p>Felicitaciones 🎉</p>
      <p>Desbloqueaste los siguientes descuentos:
      <ul>${lista}</ul>
      <p>Podrás usarlos en tu próxima visita y en cualquier servicio.</p>`,
  });
}