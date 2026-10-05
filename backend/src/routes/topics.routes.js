const express = require("express");

const {
    getTopicsBySubject,
    getTopicById,
    createTopic,
} = require("../services/topics.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get topics for a subject
router.get("/subject/:subjectId", async (req, res) => {
    try {
        const topics = await getTopicsBySubject(req.params.subjectId);

        res.json({
            topics,
        });
    } catch (error) {
        console.error("Get topics error:", error);

        res.status(500).json({
            message: "Failed to get topics",
        });
    }
});

// Get one topic
router.get("/:id", async (req, res) => {
    try {
        const topic = await getTopicById(req.params.id);

        if (!topic) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        res.json({
            topic,
        });
    } catch (error) {
        console.error("Get topic error:", error);

        res.status(500).json({
            message: "Failed to get topic",
        });
    }
});

// Create topic
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, subjectId } = req.body;

        if (!name || !subjectId) {
            return res.status(400).json({
                message: "Name and subjectId are required",
            });
        }

        const topic = await createTopic({
            name,
            subjectId,
        });

        res.status(201).json({
            message: "Topic created successfully",
            topic,
        });
    } catch (error) {
        console.error("Create topic error:", error);

        res.status(500).json({
            message: "Failed to create topic",
        });
    }
});

module.exports = router;