const express = require("express");

const {
    createDelivery,
    getUserDeliveries,
    updateDeliveryStatus,
} = require("../services/delivery.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Create delivery
router.post("/", authenticateToken, async (req, res) => {
    try {
        const delivery = await createDelivery(
            req.user.userId,
            req.body
        );

        res.status(201).json({
            message: "Delivery created successfully",
            delivery,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message || "Failed to create delivery",
        });
    }
});

// Get my deliveries
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const deliveries = await getUserDeliveries(
            req.user.userId
        );

        res.json(deliveries);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get deliveries",
        });
    }
});
router.put("/:id/status", authenticateToken, async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;

        const delivery = await updateDeliveryStatus(
            req.params.id,
            status,
            trackingNumber
        );

        res.json({
            message: "Delivery status updated successfully",
            delivery,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update delivery status",
        });
    }
});

module.exports = router;