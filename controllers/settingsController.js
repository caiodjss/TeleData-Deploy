const Settings = require("../database/models/settings"); // Crie este modelo se ainda não existir

module.exports = {
  // Configurações Gerais
  async getGeneral(req, res) {
    try {
      const general = await Settings.findOne({ where: { type: "general" } });
      res.json(general);
    } catch (err) {
      console.error("Erro ao buscar configurações gerais:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async updateGeneral(req, res) {
    try {
      const updates = req.body;
      const general = await Settings.findOne({ where: { type: "general" } });
      if (!general) return res.status(404).json({ message: "Configuração não encontrada" });

      await general.update(updates);
      res.json({ message: "Configuração geral atualizada com sucesso", general });
    } catch (err) {
      console.error("Erro ao atualizar configurações gerais:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Notificações
  async getNotifications(req, res) {
    try {
      const notifications = await Settings.findOne({ where: { type: "notifications" } });
      res.json(notifications);
    } catch (err) {
      console.error("Erro ao buscar configurações de notificações:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async updateNotifications(req, res) {
    try {
      const updates = req.body;
      const notifications = await Settings.findOne({ where: { type: "notifications" } });
      if (!notifications) return res.status(404).json({ message: "Configuração não encontrada" });

      await notifications.update(updates);
      res.json({ message: "Configuração de notificações atualizada com sucesso", notifications });
    } catch (err) {
      console.error("Erro ao atualizar notificações:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Segurança
  async getSecurity(req, res) {
    try {
      const security = await Settings.findOne({ where: { type: "security" } });
      res.json(security);
    } catch (err) {
      console.error("Erro ao buscar configurações de segurança:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async updateSecurity(req, res) {
    try {
      const updates = req.body;
      const security = await Settings.findOne({ where: { type: "security" } });
      if (!security) return res.status(404).json({ message: "Configuração não encontrada" });

      await security.update(updates);
      res.json({ message: "Configuração de segurança atualizada com sucesso", security });
    } catch (err) {
      console.error("Erro ao atualizar segurança:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Backup
  async getBackup(req, res) {
    try {
      const backup = await Settings.findOne({ where: { type: "backup" } });
      res.json(backup);
    } catch (err) {
      console.error("Erro ao buscar configurações de backup:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  async runBackup(req, res) {
    try {
      // Aqui você pode implementar a lógica de backup (ex: copiar arquivos ou exportar DB)
      res.json({ message: "Backup executado com sucesso" });
    } catch (err) {
      console.error("Erro ao executar backup:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};
