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
    from: '"Tu Peluquería" <no-reply@tupeluqueria.com>',
    to: mailCliente,
    subject: '¡Nuevo descuento desbloqueado!',
    html: `
      <p>Felicitaciones 🎉</p>
      <p>Desbloqueaste los siguientes descuentos:
      <ul>${lista}</ul>
      <p>Podrás usarlos en tu próximo turno, se aplicará cuando no tengas turnos pendientes.”</p>`,
  });
}

export async function sendVisitPreparationMail(mailCliente: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Tu Peluquería" <no-reply@tupeluqueria.com>', 
    to: mailCliente,
    subject: 'Preparación previa para tu proxima visita',
    html: `
      <p>¡Hola! Gracias por elegirnos.</p>
      <p>Como tu turno incluye aplicación de tintura y/o decoloración, es importante que sigas estas recomendaciones antes de venir:</p>
      <ul>
        <li>Lava tu cabello 24 horas antes del turno, no el mismo día.</li>
        <li>No uses acondicionador ni productos con siliconas antes de la cita.</li>
        <li>Evita aplicar aceites o tratamientos pesados en los días previos.</li>
        <li>Si tu cuero cabelludo está sensible o irritado, avísanos antes de la aplicación.</li>
        <li>Trae una referencia (foto o idea) del color que te gustaría lograr.</li>
      </ul>

      <p>Estas indicaciones ayudan a que el color se fije mejor y el resultado sea óptimo.</p>

      <p>¡Nos vemos pronto!</p>
      <p><strong>Tu Peluquería</strong></p>
    `,
  });
}