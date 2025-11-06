const express = require("express");
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const userController = require("../controllers/userController");

const router = express.Router();

// Rotas testadas via Postman. Todas funcionais.

// ADMIN
// Adicionar novo admin
router.post( "/admin/add", authenticateToken, authorizeRoles("admin"), userController.adminAddUser);
// Editar admin por email
router.put("/admin/edit",authenticateToken,authorizeRoles("admin"),userController.adminEditUser);
// Deletar admin por email
router.delete("/admin/delete",authenticateToken,authorizeRoles("admin"),userController.adminDeleteUser);
// Listar admins (com filtros: nível de acesso, status)
router.get("/admin/list",authenticateToken,authorizeRoles("admin"),userController.adminListUsers);

// INSTRUCTOR
// Editar docente (instrutor pode editar a própria conta)
router.put("/instructor/edit",authenticateToken,authorizeRoles("instructor"),userController.instructorEditAccount);
// Deletar docente (instrutor pode deletar a própria conta, admin pode deletar qualquer)
router.delete("/instructor/delete/",authenticateToken,authorizeRoles("instructor"),userController.instructorDeleteAccount);

// STUDENT
// Editar estudante (aluno pode editar a própria conta)
router.put("/student/edit",authenticateToken,authorizeRoles("student"),userController.studentEditAccount);
// Deletar estudante (aluno pode deletar a própria conta)
router.delete("/student/delete/",authenticateToken,authorizeRoles("student"),userController.studentDeleteAccount);

module.exports = router;