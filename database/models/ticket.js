const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require("./user");

const Ticket = sequelize.define("Ticket", {
  ticket_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM("open", "in_progress", "closed"), defaultValue: "open" },
  category: { type: DataTypes.STRING(100), allowNull: true },
  attachments: { type: DataTypes.JSON, allowNull: true },
  created_by: { type: DataTypes.BIGINT, allowNull: false },
  assigned_to: { type: DataTypes.BIGINT, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "Tickets",
  timestamps: false
});

// Relacionamentos
Ticket.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Ticket.belongsTo(User, { as: "assignee", foreignKey: "assigned_to" });

module.exports = Ticket;
