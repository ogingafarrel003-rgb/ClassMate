const express = require("express");

const {
    getUserNotifications,
    createNotification,
    markNotificationAsRead,
} = require("../services/notification.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get current user's notifications
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const notifications = await getUserNotifications(
            req.user.userId
        );

        res.json({
            notifications,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            message: "Failed to get notifications",
        });
    }
});

// Create notification
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            title,
            message,
            type,
        } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                message: "Title and message are required",
            });
        }

        const notification = await createNotification({
            userId: req.user.userId,
            title,
            message,
            type,
        });

        res.status(201).json({
            message: "Notification created successfully",
            notification,
        });
    } catch (error) {
        console.error("Create notification error:", error);

        res.status(500).json({
            message: "Failed to create notification",
        });
    }
});

// Mark notification as read
router.put("/:id/read", authenticateToken, async (req, res) => {
    try {
        const result = await markNotificationAsRead(
            req.params.id,
            req.user.userId
        );

        if (result.count === 0) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.json({
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error("Mark notification read error:", error);

        res.status(500).json({
            message: "Failed to mark notification as read",
        });
    }
});

module.exports = router;