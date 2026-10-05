const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "classmate",
});

const prisma = new PrismaClient({ adapter });

// Create order
async function createOrder(userId, items) {
    return prisma.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await tx.product.findUnique({
                where: {
                    id: Number(item.productId),
                },
            });

            if (!product) {
                throw new Error("Product not found");
            }

            const quantity = Number(item.quantity);

            if (quantity <= 0) {
                throw new Error("Quantity must be greater than zero");
            }

            if (product.stock < quantity) {
                throw new Error(
                    `Not enough stock for ${product.name}`
                );
            }

            const price = Number(product.price);

            totalAmount += price * quantity;

            orderItems.push({
                productId: product.id,
                quantity,
                price,
            });

            await tx.product.update({
                where: {
                    id: product.id,
                },
                data: {
                    stock: {
                        decrement: quantity,
                    },
                },
            });
        }

        return tx.order.create({
            data: {
                userId: Number(userId),
                totalAmount,
                orderItems: {
                    create: orderItems,
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    });
}

// Get user's orders
async function getUserOrders(userId) {
    return prisma.order.findMany({
        where: {
            userId: Number(userId),
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
// Get all orders (admin)
async function getAllOrders() {
    return prisma.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                },
            },
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}


// Update order status
async function updateOrderStatus(orderId, status) {
    return prisma.order.update({
        where: {
            id: Number(orderId),
        },
        data: {
            status,
        },
    });
}

module.exports = {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
};
