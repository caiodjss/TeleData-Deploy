const { Sequelize } = require("sequelize");

// Para ler as variáveis do .env
require("dotenv").config();

// Instância do Sequelize usando as variáveis de ambiente
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nome do banco de dados
  process.env.DB_USER,      // Usuário do banco de dados
  process.env.DB_PASSWORD,  // Senha do banco de dados
  {
    host: process.env.DB_HOST,  // Host do banco de dados
    dialect: process.env.DB_DIALECT || "mysql",  // Dialeto do banco de dados (mysql por padrão)
    port: process.env.DB_PORT || 3306,  // Porta do banco de dados (3306 por padrão)
    logging: false,  // Desativa logs SQL (opcional)
  }
);

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log("Conexão com o banco de dados estabelecida com sucesso!"))
  .catch((err) => console.error("Erro ao conectar ao banco de dados:", err));

module.exports = sequelize;
