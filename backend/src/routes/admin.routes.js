const express = require("express");

const {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getCommunityReports,
    updateCommunityReportStatus,
} = require("../services/admin.service");

const { authenticateToken } = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");
const {
    validatePositiveInteger,
} = require("../middleware/validation.middleware");

const router = express.Router();

// Get all users
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await getAllUsers();

        res.json(users);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get users",
        });
    }
});

// Update user role
router.put(
    "/users/:id/role",
    authenticateToken,
    requireAdmin,
    validatePositiveInteger("id", "params"),
    async (req, res) => {
        try {
            const { role } = req.body;

            const user = await updateUserRole(
                req.params.id,
                role
            );

            res.json({
                message: "User role updated successfully",
                user,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message: error.message || "Failed to update user role",
            });
        }
    }
);

// Delete user
router.delete(
    "/users/:id",
    authenticateToken,
    requireAdmin,
    validatePositiveInteger("id", "params"),
    async (req, res) => {
        try {
            const user = await deleteUser(
                req.params.id,
                req.user.userId
            );

            res.json({
                message: "User deleted successfully",
                user,
            });
        } catch (error) {
            console.error(error);

            res.status(400).json({
                message: error.message || "Failed to delete user",
            });
        }
    }
);

// Get community reports
router.get(
    "/community-reports",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const reports = await getCommunityReports(
                req.query.status
            );

            res.json({
                reports,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to get community reports",
            });
        }
    }
);

// Update community report status
router.put(
    "/community-reports/:id/status",
    authenticateToken,
    requireAdmin,
    validatePositiveInteger("id", "params"),
    async (req, res) => {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    message: "Report status is required",
                });
            }

            const report = await updateCommunityReportStatus(
                req.params.id,
                status
            );

            res.json({
                message: "Community report status updated successfully",
                report,
            });
        } catch (error) {
            console.error(error);

            if (error.message === "Community report not found") {
                return res.status(404).json({
                    message: error.message,
                });
            }

            if (error.message === "Invalid report status") {
                return res.status(400).json({
                    message: error.message,
                });
            }

            res.status(500).json({
                message: "Failed to update community report status",
            });
        }
    }
);

module.exports = router;