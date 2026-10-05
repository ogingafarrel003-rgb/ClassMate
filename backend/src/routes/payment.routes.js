const express = require("express");

const {
    createPayment,
    getUserPayments,
} = require("../services/payment.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Create payment
router.post("/", authenticateToken, async (req, res) => {
    try {
        const payment = await createPayment(
            req.user.userId,
            req.body
        );

        res.status(201).json({
            message: "Payment created successfully",
            payment,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message || "Failed to create payment",
        });
    }
});

// Get my payments
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const payments = await getUserPayments(
            req.user.userId
        );

        res.json(payments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get payments",
        });
    }
});

module.exports = router;