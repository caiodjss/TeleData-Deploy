const { DataTypes } = require("sequelize");
const sequelize = require("../connection"); // sua instância do Sequelize

const Settings = sequelize.define("Settings", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // cada tipo de configuração deve ser único
    validate: {
      isIn: [["general", "notifications", "security", "backup"]],
    },
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}, // guarda todas as configurações específicas em JSON
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "settings",
  timestamps: false,
  underscored: true,
});

// Hook para atualizar updated_at automaticamente
Settings.beforeUpdate((settings) => {
  settings.updated_at = new Date();
});

module.exports = Settings;
