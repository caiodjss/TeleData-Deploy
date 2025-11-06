// Importando o Sequelize e a conexão com o banco
const { DataTypes } = require("sequelize");
const sequelize = require("../connection"); 

// Definindo o modelo de usuário
const User = sequelize.define("User", {

  // Identificador único
  user_id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },

  // Nome completo
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  // E-mail único
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  // Senha criptografada
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  

  // Tipo de usuário: estudante, instrutor ou admin
  user_type: {
    type: DataTypes.ENUM("student", "instructor", "admin"),
    allowNull: false,
    defaultValue: "student"
  },

  // Informações de perfil
  profile_headline: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profile_image_url: {
    type: DataTypes.STRING(2048),
    allowNull: true
  },

  // Datas automáticas
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  // Autenticação 2FA antiga (pode ser removida se não for mais usada)
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  two_factor_secret: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  // NOVO: 2FA via e-mail
  two_factor_email_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  two_factor_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  two_factor_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Recuperação de senha
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },

  // Lembrar-me
  refresh_token: {
    type: DataTypes.STRING(512),
    allowNull: true
  },

  // Ativação de conta
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  activation_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  activation_token_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: "Users",
  timestamps: false,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,
  deletedAt: "deleted_at"
});
module.exports = User;