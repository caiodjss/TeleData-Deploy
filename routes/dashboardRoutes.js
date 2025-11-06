const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const dashboardController = require("../controllers/dashboardController");

// Métricas principais
router.get("/metrics", authenticateToken, authorizeRoles("admin"), dashboardController.getMetrics);

// Últimos usuários
router.get("/users/recent", authenticateToken, authorizeRoles("admin"), dashboardController.getRecentUsers);

// Distribuição de perfis (gráfico de pizza)
router.get("/profiles-distribution", authenticateToken, authorizeRoles("admin"), dashboardController.getProfilesDistribution);

// Cursos adquiridos (gráfico de barras)
router.get("/courses-acquired", authenticateToken, authorizeRoles("admin"), dashboardController.getCoursesAcquired);

// Timeline de atividades recentes
router.get("/activities", authenticateToken, authorizeRoles("admin"), dashboardController.getActivities);

module.exports = router;
