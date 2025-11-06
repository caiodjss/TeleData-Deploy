const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Activity = sequelize.define("Activity", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "activities",
  timestamps: false,
  underscored: true,
});

module.exports = Activity;
