const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const settingsController = require("../controllers/settingsController");

// Configurações Gerais
router.get("/general", authenticateToken, authorizeRoles("admin"), settingsController.getGeneral);
router.put("/general", authenticateToken, authorizeRoles("admin"), settingsController.updateGeneral);

// Notificações
router.get("/notifications", authenticateToken, authorizeRoles("admin"), settingsController.getNotifications);
router.put("/notifications", authenticateToken, authorizeRoles("admin"), settingsController.updateNotifications);

// Segurança
router.get("/security", authenticateToken, authorizeRoles("admin"), settingsController.getSecurity);
router.put("/security", authenticateToken, authorizeRoles("admin"), settingsController.updateSecurity);

// Backup
router.get("/backup", authenticateToken, authorizeRoles("admin"), settingsController.getBackup);
router.post("/backup", authenticateToken, authorizeRoles("admin"), settingsController.runBackup);

module.exports = router;
