const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Sequelize } = require("sequelize");
const User = require("../database/models/user");
const { sendActivationEmail } = require("../utils/mailer");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;

    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (!["student", "instructor", "admin"].includes(user_type)) {
      return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: "Este email já está cadastrado. Use outro email ou recupere sua senha.",
      });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    const activationToken = crypto.randomBytes(32).toString("hex");
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await User.create({
      full_name: name,
      email,
      password_hash: hashed_password,
      user_type,
      is_active: false,
      activation_token: activationToken,
      activation_token_expires: activationExpires,
    });

    const activationLink = `${process.env.FRONTEND_URL}/auth/activate/${activationToken}`;
    await sendActivationEmail(email, activationLink);

    return res.status(201).json({
      message: "Usuário criado com sucesso! Verifique seu e-mail para ativar a conta.",
    });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Este email já está cadastrado. Use outro email ou recupere sua senha.",
      });
    }

    if (err instanceof Sequelize.Error) {
      return res.status(500).json({ error: "Erro no banco de dados. Tente novamente." });
    }

    return res.status(500).json({ error: "Erro interno do servidor. Tente novamente." });
  }
};
