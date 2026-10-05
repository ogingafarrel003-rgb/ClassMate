const express = require("express");

const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
} = require("../services/order.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Create order
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order items are required",
            });
        }

        const order = await createOrder(
            req.user.userId,
            items
        );

        res.status(201).json({
            message: "Order created successfully",
            order,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create order",
        });
    }
});

// Get my orders
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const orders = await getUserOrders(
            req.user.userId
        );

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get orders",
        });
    }
});
// Get all orders
router.get("/all", authenticateToken, async (req, res) => {
    try {
        const orders = await getAllOrders();

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get all orders",
        });
    }
});


// Update order status
router.put("/:id/status", authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;

        const order = await updateOrderStatus(
            req.params.id,
            status
        );

        res.json({
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update order status",
        });
    }
});

module.exports = router;