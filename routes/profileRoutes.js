const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const profileController = require("../controllers/profileController");
const authController = require("../controllers/authController");

// Perfil
router.get("/view", authenticateToken, profileController.viewProfile);
router.put("/edit", authenticateToken, profileController.editProfile);
router.put("/change-password", authenticateToken, profileController.changePassword);

// 2FA (supondo que você já tenha authController ou profileController tratando)
router.post("/2fa/enable", authenticateToken, authController.enableEmail2FA);
router.post("/2fa/disable", authenticateToken, authController.disableEmail2FA);

// Atividades recentes (apenas admin)
router.get("/activities", authenticateToken, authorizeRoles("admin"), profileController.getActivities);

module.exports = router;
