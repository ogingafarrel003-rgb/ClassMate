const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct,
} = require("../services/product.service");

const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await getProducts();

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get products",
        });
    }
});

// Get product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get product",
        });
    }
});

// Create product
router.post("/", authenticateToken, async (req, res) => {
    try {
        const product = await createProduct(req.body);

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create product",
        });
    }
});

module.exports = router;