require("dotenv").config();
const { sendActivationEmail } = require("./utils/mailer");

(async () => {
  try {
    await sendActivationEmail("seu_email_teste@gmail.com", "https://teledata.com/ativar/teste");
    console.log("✅ Teste de envio concluído!");
  } catch (err) {
    console.error("❌ Falha no teste:", err);
  }
})();
