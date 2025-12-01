// utils/mailer.js
const { sendEmail } = require("../services/gmailService");

// E-mail de ativação
async function sendActivationEmail(email, linkOrCode) {
  const isCode = /^[0-9]{6}$/.test(linkOrCode);

  const html = isCode
    ? `<p>Seu código de verificação é:</p><h2>${linkOrCode}</h2><p>O código expira em 10 minutos.</p>`
    : `<p>Olá!<br>Clique para ativar sua conta:</p><a href="${linkOrCode}">${linkOrCode}</a>`;

  return sendEmail({
    to: email,
    subject: isCode ? "Seu código de confirmação" : "Ative sua conta TeleData",
    html,
  });
}

// E-mail de redefinição de senha
async function sendResetPasswordEmail(email, link) {
  return sendEmail({
    to: email,
    subject: "Redefinição de senha - TeleData",
    html: `
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique abaixo para redefinir:</p>
      <a href="${link}">${link}</a>
    `,
  });
}

module.exports = { sendActivationEmail, sendResetPasswordEmail };
