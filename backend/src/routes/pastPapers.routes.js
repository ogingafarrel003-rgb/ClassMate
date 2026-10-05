const express = require("express");

const {
    getPastPapers,
    getPastPaperById,
    getPastPapersByGrade,
    getPastPapersBySubject,
    createPastPaper,
} = require("../services/pastPapers.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all past papers
router.get("/", async (req, res) => {
    try {
        const papers = await getPastPapers();

        res.json({
            papers,
        });
    } catch (error) {
        console.error("Get past papers error:", error);

        res.status(500).json({
            message: "Failed to get past papers",
        });
    }
});

// Get past papers by grade
router.get("/grade/:gradeId", async (req, res) => {
    try {
        const papers = await getPastPapersByGrade(req.params.gradeId);

        res.json({
            papers,
        });
    } catch (error) {
        console.error("Get past papers by grade error:", error);

        res.status(500).json({
            message: "Failed to get past papers",
        });
    }
});

// Get past papers by subject
router.get("/subject/:subjectId", async (req, res) => {
    try {
        const papers = await getPastPapersBySubject(req.params.subjectId);

        res.json({
            papers,
        });
    } catch (error) {
        console.error("Get past papers by subject error:", error);

        res.status(500).json({
            message: "Failed to get past papers",
        });
    }
});

// Get one past paper
router.get("/:id", async (req, res) => {
    try {
        const paper = await getPastPaperById(req.params.id);

        if (!paper) {
            return res.status(404).json({
                message: "Past paper not found",
            });
        }

        res.json({
            paper,
        });
    } catch (error) {
        console.error("Get past paper error:", error);

        res.status(500).json({
            message: "Failed to get past paper",
        });
    }
});

// Create past paper
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            year,
            examType,
            gradeId,
            subjectId,
            fileUrl,
            markingUrl,
            source,
            license,
            status,
        } = req.body;

        if (!title || !year || !gradeId || !subjectId) {
            return res.status(400).json({
                message: "Title, year, gradeId and subjectId are required",
            });
        }

        const paper = await createPastPaper({
            title,
            year,
            examType,
            gradeId,
            subjectId,
            fileUrl,
            markingUrl,
            source,
            license,
            status,
        });

        res.status(201).json({
            message: "Past paper created successfully",
            paper,
        });
    } catch (error) {
        console.error("Create past paper error:", error);

        res.status(500).json({
            message: "Failed to create past paper",
        });
    }
});

module.exports = router;