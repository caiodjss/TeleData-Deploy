const bcrypt = require("bcrypt");
const User = require("../database/models/user");
const Activity = require("../database/models/activity");

module.exports = {
  async viewProfile(req, res) {
    try {
      const { email } = req.user; // do token JWT
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async editProfile(req, res) {
    try {
      const { email } = req.user;
      const updates = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      const editableFields = ["full_name", "profile_image_url", "biography"];
      editableFields.forEach((key) => {
        if (updates[key]) user[key] = updates[key];
      });

      await user.save();
      res.json({ message: "Perfil atualizado com sucesso", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async changePassword(req, res) {
    try {
      const { email } = req.user;
      const { oldPassword, newPassword } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      const match = await bcrypt.compare(oldPassword, user.password_hash);
      if (!match) return res.status(400).json({ message: "Senha antiga incorreta" });

      user.password_hash = await bcrypt.hash(newPassword, 12);
      await user.save();
      res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async getActivities(req, res) {
    try {
      const { email } = req.user;
      const activities = await Activity.findAll({
        where: { user_email: email },
        order: [["created_at", "DESC"]],
        limit: 50,
      });
      res.json({ activities });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
};
