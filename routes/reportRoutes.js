const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

//  CSV/PDF de usuários 
router.get("/export/csv", auth, authorizeRoles("admin"), reportController.exportCSV);
router.get("/export/pdf", auth, authorizeRoles("admin"), reportController.exportPDF);

//  Relatórios avançados 
// Relatório de cursos e inscritos
router.get("/courses", auth, authorizeRoles("admin"), reportController.coursesReport);
// Relatório de progresso dos estudantes
router.get("/enrollments", auth, authorizeRoles("admin"), reportController.enrollmentsReport);
// Relatório de chamados/tickets por status e categoria
//router.get("/tickets", auth, authorizeRoles("admin"), reportController.ticketsReport);

module.exports = router;