const express = require("express");

const {
    getQuizzes,
    getQuizById,
    createQuiz,
    addQuestionToQuiz,
    startQuizAttempt,
    submitQuizAttempt,
    getUserQuizAttempts,
} = require("../services/quiz.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all quizzes
router.get("/", async (req, res) => {
    try {
        const quizzes = await getQuizzes();

        res.json({
            quizzes,
        });
    } catch (error) {
        console.error("Get quizzes error:", error);

        res.status(500).json({
            message: "Failed to get quizzes",
        });
    }
});

// Get current user's quiz attempts
router.get("/attempts/me", authenticateToken, async (req, res) => {
    try {
        const attempts = await getUserQuizAttempts(req.user.userId);

        res.json({
            attempts,
        });
    } catch (error) {
        console.error("Get quiz attempts error:", error);

        res.status(500).json({
            message: "Failed to get quiz attempts",
        });
    }
});

// Get one quiz
router.get("/:id", async (req, res) => {
    try {
        const quiz = await getQuizById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        res.json({
            quiz,
        });
    } catch (error) {
        console.error("Get quiz error:", error);

        res.status(500).json({
            message: "Failed to get quiz",
        });
    }
});

// Create quiz
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            description,
            gradeId,
            subjectId,
        } = req.body;

        if (!title || !gradeId || !subjectId) {
            return res.status(400).json({
                message: "Title, gradeId and subjectId are required",
            });
        }

        const quiz = await createQuiz({
            title,
            description,
            gradeId,
            subjectId,
        });

        res.status(201).json({
            message: "Quiz created successfully",
            quiz,
        });
    } catch (error) {
        console.error("Create quiz error:", error);

        res.status(500).json({
            message: "Failed to create quiz",
        });
    }
});

// Add question to quiz
router.post("/:quizId/questions", authenticateToken, async (req, res) => {
    try {
        const {
            questionId,
            order,
        } = req.body;

        if (!questionId || !order) {
            return res.status(400).json({
                message: "questionId and order are required",
            });
        }

        const quizQuestion = await addQuestionToQuiz({
            quizId: req.params.quizId,
            questionId,
            order,
        });

        res.status(201).json({
            message: "Question added to quiz successfully",
            quizQuestion,
        });
    } catch (error) {
        console.error("Add question to quiz error:", error);

        res.status(500).json({
            message: "Failed to add question to quiz",
        });
    }
});

// Start quiz attempt
router.post("/:quizId/start", authenticateToken, async (req, res) => {
    try {
        const attempt = await startQuizAttempt(
            req.user.userId,
            req.params.quizId
        );

        res.status(201).json({
            message: "Quiz attempt started successfully",
            attempt,
        });
    } catch (error) {
        console.error("Start quiz error:", error);

        res.status(500).json({
            message: error.message || "Failed to start quiz",
        });
    }
});

// Submit quiz attempt
router.post(
    "/:quizId/attempts/:attemptId/submit",
    authenticateToken,
    async (req, res) => {
        try {
            const { answers } = req.body;

            if (!Array.isArray(answers)) {
                return res.status(400).json({
                    message: "answers must be an array",
                });
            }

            const result = await submitQuizAttempt(
                req.params.attemptId,
                answers
            );

            res.json({
                message: "Quiz submitted successfully",
                result,
            });
        } catch (error) {
            console.error("Submit quiz error:", error);

            res.status(500).json({
                message: error.message || "Failed to submit quiz",
            });
        }
    }
);

module.exports = router;