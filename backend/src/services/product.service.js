const prisma = require("../lib/prisma");

// Get all products
async function getProducts() {
    return prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get product by ID
async function getProductById(id) {
    return prisma.product.findUnique({
        where: {
            id: Number(id),
        },
    });
}

// Create product
async function createProduct(data) {
    return prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            price: Number(data.price),
            stock: Number(data.stock || 0),
            category: data.category,
            status: data.status || "ACTIVE",
        },
    });
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
};