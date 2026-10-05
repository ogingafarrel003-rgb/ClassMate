const express = require("express");

const {
    getStudentProgress,
    getProgressBySubject,
} = require("../services/progress.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get current student's overall progress
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const progress = await getStudentProgress(req.user.userId);

        res.json({
            progress,
        });
    } catch (error) {
        console.error("Get student progress error:", error);

        res.status(500).json({
            message: "Failed to get student progress",
        });
    }
});

// Get current student's progress by subject
router.get("/me/subjects", authenticateToken, async (req, res) => {
    try {
        const progress = await getProgressBySubject(req.user.userId);

        res.json({
            progress,
        });
    } catch (error) {
        console.error("Get subject progress error:", error);

        res.status(500).json({
            message: "Failed to get subject progress",
        });
    }
});

module.exports = router;