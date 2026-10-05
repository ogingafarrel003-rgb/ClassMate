const express = require("express");

const {
    getStudentProfile,
    createStudentProfile,
    updateStudentProfile,
} = require("../services/student-profile.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get current student's profile
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const profile = await getStudentProfile(req.user.userId);

        if (!profile) {
            return res.status(404).json({
                message: "Student profile not found",
            });
        }

        res.json({
            profile,
        });
    } catch (error) {
        console.error("Get student profile error:", error);

        res.status(500).json({
            message: "Failed to get student profile",
        });
    }
});

// Create student profile
router.post("/me", authenticateToken, async (req, res) => {
    try {
        const {
            educationLevel,
            gradeId,
        } = req.body;

        if (!educationLevel) {
            return res.status(400).json({
                message: "educationLevel is required",
            });
        }

        const existingProfile = await getStudentProfile(
            req.user.userId
        );

        if (existingProfile) {
            return res.status(409).json({
                message: "Student profile already exists",
            });
        }

        const profile = await createStudentProfile({
            userId: req.user.userId,
            educationLevel,
            gradeId,
        });

        res.status(201).json({
            message: "Student profile created successfully",
            profile,
        });
    } catch (error) {
        console.error("Create student profile error:", error);

        res.status(500).json({
            message: "Failed to create student profile",
        });
    }
});

// Update student profile
router.put("/me", authenticateToken, async (req, res) => {
    try {
        const {
            educationLevel,
            gradeId,
        } = req.body;

        const profile = await updateStudentProfile(
            req.user.userId,
            {
                educationLevel,
                gradeId,
            }
        );

        res.json({
            message: "Student profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Update student profile error:", error);

        res.status(500).json({
            message: "Failed to update student profile",
        });
    }
});

module.exports = router;