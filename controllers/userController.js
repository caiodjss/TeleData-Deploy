const bcrypt = require("bcrypt");
const User = require("../database/models/user");
const { Op } = require("sequelize");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const config = require("../config/config");


const editableFields = [
  "full_name",
  "email",
  "profile_image_url",
  "biography",
  "user_type",
  "is_active"
];

module.exports = {
  // ADMIN 
  async adminAddUser(req, res) {
    try {
      const { name, email, password, user_type } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ message: "Campos obrigatórios faltando" });

      const existing = await User.findOne({ where: { email } });
      if (existing)
        return res.status(400).json({ message: "Usuário com este email já existe" });

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

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });

      const activationLink = `http://localhost:3001/auth/activate/${activationToken}`;

      await transporter.sendMail({
        from: config.email.user,
        to: email,
        subject: "Ative sua conta TeleData",
        html: `
          <p>Olá ${name}, bem-vindo ao TeleData!</p>
          <p>Você foi cadastrado como ${user_type}
          <p>Clique no link abaixo para ativar sua conta:</p>
          <a href="${activationLink}">${activationLink}</a>
          <p>O link expira em 24 horas.</p>
        `,
      });

      res.status(201).json({ message: "Usuário adicionado com sucesso", user: newUser });
    } catch (err) {
      console.error("Erro ao adicionar usuário (admin):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

async adminEditUser(req, res) {
  try {
    const { email, password, ...updates } = req.body;

    if (!email)
      return res.status(400).json({ message: "E-mail é obrigatório para atualização" });

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado" });

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 12);
    }

    for (const key in updates) {
      if (editableFields.includes(key)) {
        user[key] = updates[key];
      }
    }

    await user.save();

    res.json({ message: "Usuário atualizado com sucesso (admin)", user });
  } catch (err) {
    console.error("Erro ao editar usuário (admin):", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
},

  async adminDeleteUser(req, res) {
    try {
      const { user_id, email } = req.body;
      const user = user_id
        ? await User.findByPk(user_id)
        : await User.findOne({ where: { email } });

      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      user.deleted_at = new Date();
      await user.save();

      res.json({ message: "Usuário excluído (soft delete) com sucesso (admin)" });
    } catch (err) {
      console.error("Erro ao excluir usuário (admin):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async adminListUsers(req, res) {
    try {
      const { user_type, status } = req.body || {}; // filtros opcionais
      const where = {};
      if (user_type) where.user_type = user_type;
      if (status === "active") where.deleted_at = null;
      if (status === "deleted") where.deleted_at = { [Op.ne]: null };

      const users = await User.findAll({ where });
      res.json(users);
    } catch (err) {
      console.error("Erro ao listar usuários (admin):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },


  async instructorEditAccount(req, res) {
    try {
      const { email } = req.user;
      const updates = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      if (updates.password) {
        updates.password_hash = await bcrypt.hash(updates.password, 12);
        delete updates.password;
      }

      for (const key in updates) {
        if (editableFields.includes(key)) user[key] = updates[key];
      }

      await user.save();
      res.json({ message: "Conta atualizada com sucesso", user });
    } catch (err) {
      console.error("Erro ao editar conta (instrutor):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async instructorDeleteAccount(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      user.deleted_at = new Date();
      await user.save();

      res.json({ message: "Conta excluída (soft delete) com sucesso" });
    } catch (err) {
      console.error("Erro ao excluir conta (instrutor):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // STUDENT
  async studentEditAccount(req, res) {
    try {
      const { email } = req.user;
      const updates = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      if (updates.password) {
        updates.password_hash = await bcrypt.hash(updates.password, 12);
        delete updates.password;
      }

      for (const key in updates) {
        if (editableFields.includes(key)) user[key] = updates[key];
      }

      await user.save();
      res.json({ message: "Conta atualizada com sucesso (estudante)", user });
    } catch (err) {
      console.error("Erro ao editar conta (estudante):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async studentDeleteAccount(req, res) {
    try {
      const { email } = req.params;
  
      if (email) {
        return res.status(400).json({ message: "ID do usuário é obrigatório." });
      }
  
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
  
      await User.update(
        { deleted_at: new Date() },
        { where: { user_id: email } }
      );
  
      res.json({ message: "Conta excluída (soft delete) com sucesso (estudante)" });
    } catch (err) {
      console.error("Erro ao excluir conta (estudante):", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
};