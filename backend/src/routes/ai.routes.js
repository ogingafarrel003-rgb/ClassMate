const express = require("express");

const {
    askClassMateAI,
} = require("../services/ai.service");

const {
    authenticateToken,
} = require("../middleware/auth.middleware");

const {
    validateRequiredFields,
} = require("../middleware/validation.middleware");

const router = express.Router();

// Ask ClassMate AI
router.post(
    "/ask",
    authenticateToken,
    validateRequiredFields(["question"]),
    async (req, res) => {
        try {
            const {
                question,
                grade,
                subject,
            } = req.body;

            const result = await askClassMateAI({
                question,
                grade,
                subject,
            });

            res.json({
                message: "ClassMate AI response generated successfully",
                question,
                grade: grade || null,
                subject: subject || null,
                answer: result.answer,
            });
        } catch (error) {
            console.error("ClassMate AI error:", error);

            res.status(500).json({
                message:
                    error.message ||
                    "Failed to generate AI response",
            });
        }
    }
);

module.exports = router;