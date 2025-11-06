const { Op } = require("sequelize");
const User = require("../database/models/user");
const Enrollment = require("../database/models/enrollment");
const Course = require("../database/models/courses");
const Activity = require("../database/models/activity");

// Métricas principais - Testado e funcional parcial.
async function getMetrics(req, res) {
  try {
    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { user_type: "student" } });
    const totalInstructors = await User.count({ where: { user_type: "instructor" } });
    const totalAdmins = await User.count({ where: { user_type: "admin" } });

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar métricas do dashboard" });
  }
}

// Últimos usuários cadastrados - Testado tudo ok.
async function getRecentUsers(req, res) {
  try {
    const users = await User.findAll({
      order: [["created_at", "DESC"]],
      limit: 10,
      attributes: ["user_id", "full_name", "email", "user_type", "created_at"]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários recentes" });
  }
}

// Distribuição de perfis (gráfico de pizza)
async function getProfilesDistribution(req, res) {
  try {
    const students = await User.count({ where: { user_type: "student" } });
    const instructors = await User.count({ where: { user_type: "instructor" } });
    const admins = await User.count({ where: { user_type: "admin" } });

    res.json([
      { type: "student", count: students },
      { type: "instructor", count: instructors },
      { type: "admin", count: admins }
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar distribuição de perfis" });
  }
}

// Cursos adquiridos (gráfico de barras)
async function getCoursesAcquired(req, res) {
  try {
    const enrollments = await Enrollment.findAll({ attributes: ["course_id"], raw: true });
    const courseCount = {};
    enrollments.forEach(e => {
      courseCount[e.course_id] = (courseCount[e.course_id] || 0) + 1;
    });

    const courses = await Course.findAll({ attributes: ["course_id", "title"], raw: true });
    const result = courses.map(c => ({
      course: c.title,
      enrolled: courseCount[c.course_id] || 0
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar cursos adquiridos" });
  }
}

// Timeline de atividades recentes
async function getActivities(req, res) {
  try {
    const activities = await Activity.findAll({
      order: [["created_at", "DESC"]],
      limit: 50
    });
    res.json({ activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

// ----------------------
// Exportar todos os métodos
// ----------------------
module.exports = {
  getMetrics,
  getRecentUsers,
  getProfilesDistribution,
  getCoursesAcquired,
  getActivities
};
