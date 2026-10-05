const express = require("express");

const {
    searchAll,
    searchNotes,
    searchPastPapers,
    searchQuizzes,
    searchCommunity,
} = require("../services/search.service");

const router = express.Router();

// Search everything
router.get("/", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const results = await searchAll(query);

        res.json(results);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Search failed",
        });
    }
});

// Search notes
router.get("/notes", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const results = await searchNotes(query);

        res.json(results);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Note search failed",
        });
    }
});

// Search past papers
router.get("/past-papers", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const results = await searchPastPapers(query);

        res.json(results);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Past paper search failed",
        });
    }
});

// Search quizzes
router.get("/quizzes", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const results = await searchQuizzes(query);

        res.json(results);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Quiz search failed",
        });
    }
});

// Search community
router.get("/community", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const results = await searchCommunity(query);

        res.json(results);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Community search failed",
        });
    }
});

module.exports = router;