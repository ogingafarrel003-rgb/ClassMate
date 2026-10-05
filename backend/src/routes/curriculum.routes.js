const express = require("express");

const {
    getGrades,
    getSubjectsByGrade,
} = require("../services/curriculum.service");

const router = express.Router();

// Get all grades
router.get("/grades", async (req, res) => {
    try {
        const grades = await getGrades();

        res.json({
            grades,
        });
    } catch (error) {
        console.error("Get grades error:", error);

        res.status(500).json({
            message: "Failed to get grades",
        });
    }
});

// Get subjects for a grade
router.get("/grades/:gradeId/subjects", async (req, res) => {
    try {
        const subjects = await getSubjectsByGrade(req.params.gradeId);

        res.json({
            subjects,
        });
    } catch (error) {
        console.error("Get subjects error:", error);

        res.status(500).json({
            message: "Failed to get subjects",
        });
    }
});

module.exports = router;