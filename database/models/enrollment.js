const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require("./user");
const Course = require("./courses");

const Enrollment = sequelize.define("enrollment", {
  enrollment_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  price_paid: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  progress_percentage: { type: DataTypes.INTEGER, defaultValue: 0 },
  enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completed_at: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: "Enrollments",
  timestamps: false
});

// Relacionamentos
Enrollment.belongsTo(User, { foreignKey: "user_id" });
Enrollment.belongsTo(Course, { foreignKey: "course_id" });

module.exports = Enrollment;
