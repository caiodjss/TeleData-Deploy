const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
const User = require("../database/models/user");
const config = require("../config/config");
const { sendActivationEmail, sendResetPasswordEmail } = require("../utils/mailer");

// Ativação de conta
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        activation_token: token,
        activation_token_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado." });
    }

    user.is_active = true;
    user.activation_token = null;
    user.activation_token_expires = null;
    await user.save();

    res.json({ message: "Conta ativada com sucesso!" });
  } catch (err) {
    console.error("Erro ao ativar conta:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Login com email e senha
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Credenciais inválidas." });

    if (!user.is_active) {
      return res.status(403).json({ message: "Conta não ativada. Verifique seu e-mail." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ message: "Credenciais inválidas." });

    if (user.two_factor_email_enabled) {
      const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      user.two_factor_code = code;
      user.two_factor_expires = expires;
      await user.save();

      try {
        await sendActivationEmail(email, code);
      } catch (err) {
        console.error("Erro ao enviar e-mail 2FA:", err);
      }

      return res.status(200).json({
        message: "Código enviado para o e-mail.",
        user_id: user.user_id,
      });
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    let refreshToken;
    if (rememberMe) {
      refreshToken = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      user.refresh_token = refreshToken;
      await user.save();
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token: accessToken,
      refreshToken: refreshToken || null,
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Verificação do login por e-mail
exports.verifyLoginEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "E-mail e código são obrigatórios." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.two_factor_code) {
      return res.status(400).json({ message: "Código inválido ou inexistente." });
    }

    if (user.two_factor_expires < new Date()) {
      return res.status(400).json({ message: "Código expirado." });
    }

    if (user.two_factor_code !== String(code)) {
      return res.status(400).json({ message: "Código incorreto." });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.two_factor_code = null;
    user.two_factor_expires = null;
    await user.save();

    res.status(200).json({ message: "Login confirmado com sucesso!", token });
  } catch (err) {
    console.error("Erro ao verificar login por e-mail:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token é obrigatório." });

    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(401).json({ message: "Refresh token inválido." });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
      if (err) return res.status(401).json({ message: "Refresh token expirado ou inválido." });

      const newAccessToken = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token: newAccessToken });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Recuperação de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "E-mail é obrigatório." });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    user.reset_password_token = token;
    user.reset_password_expires = expires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;

    await sendResetPasswordEmail(email, resetLink);

    res.json({ message: "Link de recuperação enviado para o seu e-mail." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
};

// Reset de senha
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "Nova senha é obrigatória." });

    const user = await User.findOne({
      where: {
        reset_password_token: token,
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Token inválido ou expirado." });

    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

// Login com Google
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const jwtToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login com Google realizado com sucesso!",
      token: jwtToken,
    });
  } catch (err) {
    console.error("Erro no callback do Google:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};
