const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Sequelize } = require("sequelize");
const User = require("../database/models/user");
const config = require("../config/config");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;

    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (!["student", "instructor", "admin"].includes(user_type)) {
      return res.status(400).json({ error: "Tipo de usuário inválido" });
    }

    // Verifica se o email já existe ANTES de tentar criar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        error: "Este email já está cadastrado. Use outro email ou recupere sua senha." 
      });
    }

    const hashed_password = await bcrypt.hash(password, 12);

    const activationToken = crypto.randomBytes(32).toString("hex");
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      full_name: name,
      email,
      password_hash: hashed_password,
      user_type,
      is_active: false,
      activation_token: activationToken,
      activation_token_expires: activationExpires
    });

    // Configuração do transporter com timeout aumentado
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // ✅ URL atualizada para produção
    const activationLink = `https://teledata-deploy-production.up.railway.app/auth/activate/${activationToken}`;

    // Envio de email com tratamento de erro específico
    try {
      await transporter.sendMail({
        from: config.email.user,
        to: email,
        subject: "Ative sua conta TeleData",
        html: `
          <p>Olá ${name}, bem-vindo ao TeleData!</p>
          <p>Clique no link abaixo para ativar sua conta:</p>
          <a href="${activationLink}">${activationLink}</a>
          <p>O link expira em 24 horas.</p>
        `,
      });
      
      console.log(`Usuário ${name} (${email}) cadastrado como ${user_type}. Token enviado para ativação.`);

    } catch (emailError) {
      console.error("Erro ao enviar email de ativação:", emailError);
      // Não falha o registro se o email não for enviado, apenas loga o erro
      // O usuário pode solicitar reenvio do email de ativação depois
    }

    return res.status(201).json({
      message: "Usuário criado com sucesso! Verifique seu e-mail para ativar a conta."
    });

  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    
    // Tratamento específico para erro de constraint única
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: "Este email já está cadastrado. Use outro email ou recupere sua senha." 
      });
    }
    
    // Tratamento para outros erros do Sequelize
    if (err instanceof Sequelize.Error) {
      return res.status(500).json({ 
        error: "Erro no banco de dados. Tente novamente." 
      });
    }
    
    return res.status(500).json({ 
      error: "Erro interno do servidor. Tente novamente." 
    });
  }
};