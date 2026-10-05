const express = require("express");
const multer = require("multer");

const { saveFile, deleteFile } = require("../services/file.service");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

// Upload file
router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded",
                });
            }

            const result = await saveFile(req.file);

            res.status(201).json({
                message: "File uploaded successfully",
                file: result,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "File upload failed",
            });
        }
    }
);

// Delete file
router.delete(
    "/:fileName",
    authenticateToken,
    async (req, res) => {
        try {
            const deleted = await deleteFile(req.params.fileName);

            if (!deleted) {
                return res.status(404).json({
                    message: "File not found",
                });
            }

            res.json({
                message: "File deleted successfully",
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "File deletion failed",
            });
        }
    }
);

module.exports = router;