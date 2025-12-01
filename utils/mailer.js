const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

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
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Evita erro de domínio
      to,
      subject,
      html,
      charset: "UTF-8",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✔️ E-mail enviado para ${to}`);
    return result;
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error.message);
    throw error;
  }
}

// E-mail de ativação
async function sendActivationEmail(email, link) {
  return sendEmail(
    email,
    "Ative sua conta TeleData",
    `
      <p>Olá!</p>
      <p>Clique abaixo para ativar sua conta:</p>
      <a href="${link}">${link}</a>
      <p>Este link expira em 24 horas.</p>
    `
  );
}

// E-mail de redefinição de senha
async function sendResetPasswordEmail(email, link) {
  return sendEmail(
    email,
    "Redefinição de senha - TeleData",
    `
      <p>Você solicitou a redefinição de senha.</p>
      <p>Clique abaixo para redefinir:</p>
      <a href="${link}">${link}</a>
    `
  );
}

module.exports = { sendActivationEmail, sendResetPasswordEmail };
