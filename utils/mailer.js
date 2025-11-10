const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

// Cria o cliente OAuth2 do Google
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Define o refresh token para gerar access tokens automaticamente
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Função genérica para envio de e-mails
async function sendEmail(to, subject, html) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"TeleData" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail enviado com sucesso para ${to}`);
    return result;
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    throw error;
  }
}

// Envio de e-mail de ativação
async function sendActivationEmail(email, link) {
  const subject = "Ative sua conta TeleData";
  const html = `
    <p>Olá,</p>
    <p>Clique no link abaixo para ativar sua conta:</p>
    <a href="${link}">${link}</a>
    <p>Este link expira em 24 horas.</p>
  `;
  return sendEmail(email, subject, html);
}

// Envio de e-mail de redefinição de senha
async function sendResetPasswordEmail(email, link) {
  const subject = "Redefinição de senha - TeleData";
  const html = `
    <p>Você solicitou a redefinição de senha.</p>
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <a href="${link}">${link}</a>
  `;
  return sendEmail(email, subject, html);
}

module.exports = { sendActivationEmail, sendResetPasswordEmail };
