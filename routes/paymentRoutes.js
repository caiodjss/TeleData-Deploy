const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", authenticateToken, authorizeRoles("student"), paymentController.createPayment);
router.post("/notify", paymentController.handleWebhook);

module.exports = router;
