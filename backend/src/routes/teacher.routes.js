const express = require("express");

const {
    createNote,
    getAllNotes,
    updateNote,
} = require("../services/notes.service");

const {
    createPastPaper,
    getPastPapers,
    updatePastPaper,
} = require("../services/pastPapers.service");

const {
    createQuestion,
} = require("../services/questions.service");

const {
    createQuiz,
    getAllQuizzes,
    updateQuiz,
} = require("../services/quiz.service");

const {
    addQuestionToQuiz,
} = require("../services/quizQuestions.service");

const {
    getTeacherProfile,
    updateTeacherProfile,
} = require("../services/teacherProfile.service");

const {
    getTeacherDashboardStats,
} = require("../services/teacherDashboard.service");

const {
    validateRequiredFields,
    validatePositiveInteger,
    validateEmail,
} = require("../middleware/validation.middleware");

const { authenticateToken } = require("../middleware/auth.middleware");
const { requireTeacher } = require("../middleware/teacher.middleware");

const router = express.Router();

// ==========================================
// TEACHER DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    authenticateToken,
    requireTeacher,
    async (req, res) => {
        try {
            const stats = await getTeacherDashboardStats();

            res.json({
                message: "Teacher dashboard accessed successfully",
                teacherId: req.user.userId,
                role: req.user.role,
                stats,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to load teacher dashboard",
            });
        }
    }
);

// ==========================================
// TEACHER PROFILE
// ==========================================

router.get(
    "/profile",
    authenticateToken,
    requireTeacher,
    async (req, res) => {
        try {
            const profile = await getTeacherProfile(
                req.user.userId
            );

            if (!profile) {
                return res.status(404).json({
                    message: "Teacher profile not found",
                });
            }

            res.json({
                profile,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to get teacher profile",
            });
        }
    }
);

router.put(
    "/profile",
    authenticateToken,
    requireTeacher,

    validateRequiredFields([
        "firstName",
        "lastName",
        "email",
    ]),

    validateEmail("email"),

    async (req, res) => {
        try {
            const profile = await updateTeacherProfile(
                req.user.userId,
                req.body
            );

            res.json({
                message: "Teacher profile updated successfully",
                profile,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to update teacher profile",
            });
        }
    }
);

// ==========================================
// NOTES
// ==========================================

router.post(
    "/notes",
    authenticateToken,
    requireTeacher,
    validateRequiredFields([
        "title",
        "content",
        "topicId",
    ]),
    validatePositiveInteger("topicId"),
    async (req, res) => {
        try {
            const note = await createNote(
                req.user.userId,
                req.body
            );

            res.status(201).json({
                message: "Note created successfully",
                note,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to create note",
            });
        }
    }
);

router.get(
    "/notes",
    authenticateToken,
    requireTeacher,
    async (req, res) => {
        try {
            const notes = await getAllNotes();

            res.json(notes);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to get notes",
            });
        }
    }
);

router.put(
    "/notes/:id",
    authenticateToken,
    requireTeacher,
    validatePositiveInteger("id", "params"),
    async (req, res) => {
        try {
            const note = await updateNote(
                req.params.id,
                req.body
            );

            res.json({
                message: "Note updated successfully",
                note,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to update note",
            });
        }
    }
);

// ==========================================
// PAST PAPERS
// ==========================================

router.post(
    "/past-papers",
    authenticateToken,
    requireTeacher,
    validateRequiredFields([
        "title",
        "year",
        "examType",
        "gradeId",
        "subjectId",
    ]),
    validatePositiveInteger("year"),
    validatePositiveInteger("gradeId"),
    validatePositiveInteger("subjectId"),
    async (req, res) => {
        try {
            const pastPaper = await createPastPaper(
                req.body
            );

            res.status(201).json({
                message: "Past paper created successfully",
                pastPaper,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to create past paper",
            });
        }
    }
);

router.get(
    "/past-papers",
    authenticateToken,
    requireTeacher,
    async (req, res) => {
        try {
            const pastPapers = await getPastPapers();

            res.json(pastPapers);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to get past papers",
            });
        }
    }
);

router.put(
    "/past-papers/:id",
    authenticateToken,
    requireTeacher,
    validatePositiveInteger("id", "params"),
    async (req, res) => {
        try {
            const pastPaper = await updatePastPaper(
                req.params.id,
                req.body
            );

            res.json({
                message: "Past paper updated successfully",
                pastPaper,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to update past paper",
            });
        }
    }
);

// ==========================================
// QUESTIONS
// ==========================================

router.post(
    "/questions",
    authenticateToken,
    requireTeacher,
    validateRequiredFields([
        "question",
        "order",
        "pastPaperId",
    ]),
    validatePositiveInteger("order"),
    validatePositiveInteger("pastPaperId"),
    async (req, res) => {
        try {
            const question = await createQuestion(
                req.body
            );

            res.status(201).json({
                message: "Question created successfully",
                question,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to create question",
            });
        }
    }
);

// ==========================================
// QUIZZES
// ==========================================

router.post(
    "/quizzes",
    authenticateToken,
    requireTeacher,
    validateRequiredFields([
        "title",
        "gradeId",
        "subjectId",
    ]),
    validatePositiveInteger("gradeId"),
    validatePositiveInteger("subjectId"),
    async (req, res) => {
        try {
            const quiz = await createQuiz(
                req.body
            );

            res.status(201).json({
                message: "Quiz created successfully",
                quiz,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to create quiz",
            });
        }
    }
);

router.get(
    "/quizzes",
    authenticateToken,
    requireTeacher,
    async (req, res) => {
        try {
            const quizzes = await getAllQuizzes();

            res.json(quizzes);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to get quizzes",
            });
        }
    }
);

router.put(
    "/quizzes/:id",
    authenticateToken,
    requireTeacher,
    validatePositiveInteger("id", "params"),
    async (req, res) => {
        try {
            const quiz = await updateQuiz(
                req.params.id,
                req.body
            );

            res.json({
                message: "Quiz updated successfully",
                quiz,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to update quiz",
            });
        }
    }
);

// ==========================================
// ADD QUESTION TO QUIZ
// ==========================================

router.post(
    "/quizzes/:quizId/questions",
    authenticateToken,
    requireTeacher,
    validatePositiveInteger("quizId", "params"),
    validateRequiredFields([
        "questionId",
        "order",
    ]),
    validatePositiveInteger("questionId"),
    validatePositiveInteger("order"),
    async (req, res) => {
        try {
            const quizQuestion = await addQuestionToQuiz({
                quizId: req.params.quizId,
                questionId: req.body.questionId,
                order: req.body.order,
            });

            res.status(201).json({
                message:
                    "Question added to quiz successfully",
                quizQuestion,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message:
                    error.message ||
                    "Failed to add question to quiz",
            });
        }
    }
);

// ==========================================
// ALL TEACHER CONTENT
// ==========================================

router.get(
    "/content",
    authenticateToken,
    requireTeacher,
    async (req, res) => {
        try {
            const [
                notes,
                pastPapers,
                quizzes,
            ] = await Promise.all([
                getAllNotes(),
                getPastPapers(),
                getAllQuizzes(),
            ]);

            res.json({
                notes,
                pastPapers,
                quizzes,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Failed to get teacher content",
            });
        }
    }
);

module.exports = router;