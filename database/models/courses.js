const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Course = sequelize.define("Course", {
  course_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  subtitle: { type: DataTypes.STRING(500), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "Courses",
  timestamps: false
});

module.exports = Course;
