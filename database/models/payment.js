const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Payment = sequelize.define("Payment", {
  payment_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  enrollment_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM("credit_card", "boleto", "pix", "paypal"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "processing", "completed", "failed", "cancelled", "refunded"),
    allowNull: false,
    defaultValue: "pending",
  },
  external_payment_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  installments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  payment_details: {
    type: DataTypes.JSON,
    allowNull: true,
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
  tableName: "payments",
  timestamps: false, // o banco já gera automático
});

module.exports = Payment;
