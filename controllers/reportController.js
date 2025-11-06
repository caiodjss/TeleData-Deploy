const { Op } = require("sequelize");
const User = require("../database/models/user");
const Course = require("../database/models/courses");
const Enrollment = require("../database/models/enrollment");
const Ticket = require("../database/models/ticket"); // <-- apenas UMA vez
const { createObjectCsvWriter } = require("csv-writer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

//  CSV/PDF de usuários (existentes) 
exports.exportCSV = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true, order: [["user_id", "ASC"]] });

    const csvPath = path.join(__dirname, "../tmp/report_users.csv");
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: "user_id", title: "ID" },
        { id: "full_name", title: "Nome" },
        { id: "email", title: "Email" },
        { id: "created_at", title: "Data Cadastro" },
        { id: "lastLogin", title: "Último Login" }
      ]
    });

    await csvWriter.writeRecords(users);
    res.download(csvPath, "report_users.csv", err => {
      if (err) console.log(err);
      fs.unlinkSync(csvPath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar CSV" });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true, order: [["user_id", "ASC"]] });

    const pdfPath = path.join(__dirname, "../tmp/report_users.pdf");
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(18).text("Relatório de Usuários", { align: "center" });
    doc.moveDown();

    users.forEach(user => {
      doc.fontSize(12).text(
        `ID: ${user.user_id} | Nome: ${user.full_name} | Email: ${user.email} | Cadastro: ${user.created_at}`
      );
    });

    doc.end();

    doc.on("finish", () => {
      res.download(pdfPath, "report_users.pdf", err => {
        if (err) console.log(err);
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar PDF" });
  }
};

//  Relatório de cursos e inscritos 

exports.coursesReport = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: Enrollment, include: [User] }]
    });

    const report = courses.map(course => ({
      course_id: course.course_id,
      title: course.title,
      enrolled_students: course.Enrollments.length
    }));

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar relatório de cursos" });
  }
};

//  Relatório de progresso dos estudantes 

exports.enrollmentsReport = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [User, Course],
      order: [["enrolled_at", "DESC"]]
    });

    const report = enrollments.map(e => ({
      enrollment_id: e.enrollment_id,
      student: e.User.full_name,
      course: e.Course.title,
      progress_percentage: e.progress_percentage,
      enrolled_at: e.enrolled_at,
      completed_at: e.completed_at
    }));

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar relatório de inscrições" });
  }
};

//  Relatório de chamados 

exports.ticketsReport = async (req, res) => {
  try {
    if (!Ticket) return res.status(400).json({ error: "Modelo Ticket não encontrado" });

    const tickets = await Ticket.findAll({
      include: [User],
      order: [["created_at", "DESC"]]
    });

    const report = tickets.map(t => ({
      ticket_id: t.id,
      subject: t.subject,
      category: t.category,
      status: t.status,
      created_at: t.created_at,
      user: t.User.full_name
    }));

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar relatório de chamados" });
  }
};
