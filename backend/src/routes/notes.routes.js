const express = require("express");

const {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
} = require("../services/notes.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
    try {
        const notes = await getAllNotes();

        res.json({
            notes,
        });
    } catch (error) {
        console.error("Get notes error:", error);

        res.status(500).json({
            message: "Failed to get notes",
        });
    }
});

// Get one note
router.get("/:id", async (req, res) => {
    try {
        const note = await getNoteById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        res.json({
            note,
        });
    }  catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
        message: "Failed to get notes",
        error: error.message,
    });

}});

// Create note
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            content,
            topicId,
            source,
            license,
            status,
        } = req.body;

        if (!title || !content || !topicId) {
            return res.status(400).json({
                message: "Title, content and topicId are required",
            });
        }

        const note = await createNote(req.user.userId, {
            title,
            content,
            topicId,
            source,
            license,
            status,
        });

        res.status(201).json({
            message: "Note created successfully",
            note,
        });
    } catch (error) {
        console.error("Create note error:", error);

        res.status(500).json({
            message: error.message || "Failed to create note",
        });
    }
});

// Update note
router.put("/:id", authenticateToken, async (req, res) => {
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
        console.error("Update note error:", error);

        res.status(500).json({
            message: error.message || "Failed to update note",
        });
    }
});

module.exports = router;