const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const courseController = require("../controllers/courseController");

// Admin/Instructor
router.post("/add", authenticateToken, authorizeRoles("admin", "instructor"), courseController.addCourse);
router.put("/edit/:id", authenticateToken, authorizeRoles("admin", "instructor"), courseController.editCourse);
router.delete("/delete/:id", authenticateToken, authorizeRoles("admin", "instructor"), courseController.deleteCourse);

// Admin/Instructor/Student
router.get("/list", authenticateToken, authorizeRoles("admin", "instructor", "student"), courseController.listCourses);

// Relatório de inscritos
router.get("/enrollments/:courseId", authenticateToken, authorizeRoles("admin", "instructor"), courseController.enrollmentsReport);

module.exports = router;
