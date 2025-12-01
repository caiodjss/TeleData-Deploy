// gmailService.js
const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const SENDER_EMAIL = process.env.EMAIL_SENDER;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail({ to, subject, html }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const message = Buffer.from(
      `From: TeleData <${SENDER_EMAIL}>\r\n` +
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n\r\n` +
      html
    ).toString("base64");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: message },
    });

    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail via Gmail API:", error);
    throw new Error("Erro no envio do e-mail via Gmail API");
  }
}

module.exports = { sendEmail };
