const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

async function sendActivationEmail(email, link) {
  await transporter.sendMail({
    from: config.email.user,
    to: email,
    subject: "Ative sua conta",
    html: `<p>Clique no link para ativar sua conta:</p><a href="${link}">${link}</a>`,
  });
}

async function sendResetPasswordEmail(email, link) {
  await transporter.sendMail({
    from: config.email.user,
    to: email,
    subject: "Redefinição de senha",
    html: `<p>Redefina sua senha clicando no link abaixo:</p><a href="${link}">${link}</a>`,
  });
}

module.exports = { sendActivationEmail, sendResetPasswordEmail };
