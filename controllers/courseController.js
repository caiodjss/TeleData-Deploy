const Course = require("../database/models/courses");
const Enrollment = require("../database/models/enrollment");
const User = require("../database/models/user");

module.exports = {
  // Criar curso
  async addCourse(req, res) {
    try {
      const { title, subtitle, description, price, is_published } = req.body;
      const course = await Course.create({ title, subtitle, description, price, is_published });
      res.status(201).json({ message: "Curso criado com sucesso", course });
    } catch (err) {
      console.error("Erro ao criar curso:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Editar curso
  async editCourse(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const course = await Course.findByPk(id);
      if (!course) return res.status(404).json({ message: "Curso não encontrado" });

      await course.update(updates);
      res.json({ message: "Curso atualizado com sucesso", course });
    } catch (err) {
      console.error("Erro ao editar curso:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Deletar curso
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id);
      if (!course) return res.status(404).json({ message: "Curso não encontrado" });

      await course.destroy();
      res.json({ message: "Curso excluído com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar curso:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Listar cursos
  async listCourses(req, res) {
    try {
      const courses = await Course.findAll({ order: [["course_id", "ASC"]] });
      res.json(courses);
    } catch (err) {
      console.error("Erro ao listar cursos:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  // Relatório de inscritos
  async enrollmentsReport(req, res) {
    try {
      const { courseId } = req.params;
      const enrollments = await Enrollment.findAll({
        where: { course_id: courseId },
        include: [{ model: User, attributes: ["full_name", "email"] }]
      });
      res.json(enrollments);
    } catch (err) {
      console.error("Erro ao gerar relatório de inscritos:", err);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};
