const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticateToken = require("../middleware/auth");
const authController = require("../controllers/authController");

// Ativação de conta
router.get("/activate/:token", authController.activateAccount);

// Login e tokens
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// 2FA
router.post("/twofactor/enable", authenticateToken, authController.enableEmail2FA);
router.post("/twofactor/disable", authenticateToken, authController.disableEmail2FA);
router.post("/verify-login", authController.verifyLoginEmail);

// Recuperação de senha
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Login com Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google", { session: false, failureRedirect: "/login" }),authController.googleCallback);

module.exports = router;