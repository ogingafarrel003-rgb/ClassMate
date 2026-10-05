const express = require("express");

const {
    getPrintables,
    getPrintableById,
    createPrintable,
} = require("../services/printable.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all printables
router.get("/", async (req, res) => {
    try {
        const printables = await getPrintables();

        res.json(printables);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get printables",
        });
    }
});

// Get printable by ID
router.get("/:id", async (req, res) => {
    try {
        const printable = await getPrintableById(req.params.id);

        if (!printable) {
            return res.status(404).json({
                message: "Printable not found",
            });
        }

        res.json(printable);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get printable",
        });
    }
});

// Create printable
router.post("/", authenticateToken, async (req, res) => {
    try {
        const printable = await createPrintable(req.body);

        res.status(201).json({
            message: "Printable created successfully",
            printable,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create printable",
        });
    }
});

module.exports = router;