const express = require("express");

const {
    getQuestionsByPastPaper,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../services/questions.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get questions for a past paper
router.get("/past-paper/:pastPaperId", async (req, res) => {
    try {
        const questions = await getQuestionsByPastPaper(
            req.params.pastPaperId
        );

        res.json({
            questions,
        });
    } catch (error) {
        console.error("Get questions error:", error);

        res.status(500).json({
            message: "Failed to get questions",
        });
    }
});

// Get one question
router.get("/:id", async (req, res) => {
    try {
        const question = await getQuestionById(req.params.id);

        if (!question) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        res.json({
            question,
        });
    } catch (error) {
        console.error("Get question error:", error);

        res.status(500).json({
            message: "Failed to get question",
        });
    }
});

// Create question
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            question,
            answer,
            explanation,
            marks,
            order,
            pastPaperId,
        } = req.body;

        if (!question || !order || !pastPaperId) {
            return res.status(400).json({
                message: "Question, order and pastPaperId are required",
            });
        }

        const newQuestion = await createQuestion({
            question,
            answer,
            explanation,
            marks,
            order,
            pastPaperId,
        });

        res.status(201).json({
            message: "Question created successfully",
            question: newQuestion,
        });
    } catch (error) {
        console.error("Create question error:", error);

        res.status(500).json({
            message: "Failed to create question",
        });
    }
});

// Update question
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const question = await updateQuestion(
            req.params.id,
            req.body
        );

        res.json({
            message: "Question updated successfully",
            question,
        });
    } catch (error) {
        console.error("Update question error:", error);

        res.status(500).json({
            message: "Failed to update question",
        });
    }
});

// Delete question
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await deleteQuestion(req.params.id);

        res.json({
            message: "Question deleted successfully",
        });
    } catch (error) {
        console.error("Delete question error:", error);

        res.status(500).json({
            message: "Failed to delete question",
        });
    }
});

module.exports = router;