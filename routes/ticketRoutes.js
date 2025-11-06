const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

// Abrir chamado (todos)
router.post("/add", auth, ticketController.addTicket);

// Listar chamados (admin/instructor)
router.get("/list", auth, authorizeRoles("admin", "instructor"), ticketController.listTickets);

// Visualizar chamado
router.get("/view/:id", auth, authorizeRoles("admin", "instructor"), ticketController.viewTicket);

// Atualizar chamado
router.put("/update/:id", auth, authorizeRoles("admin", "instructor"), ticketController.updateTicket);

// Excluir chamado (admin)
router.delete("/delete/:id", auth, authorizeRoles("admin"), ticketController.deleteTicket);

module.exports = router;
