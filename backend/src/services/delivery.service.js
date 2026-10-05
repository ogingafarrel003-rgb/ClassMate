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

// Create delivery
async function createDelivery(userId, data) {
    const order = await prisma.order.findFirst({
        where: {
            id: Number(data.orderId),
            userId: Number(userId),
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    const existingDelivery = await prisma.delivery.findUnique({
        where: {
            orderId: order.id,
        },
    });

    if (existingDelivery) {
        throw new Error("Delivery already exists for this order");
    }

    return prisma.delivery.create({
        data: {
            orderId: order.id,
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            county: data.county,
            postalCode: data.postalCode,
            status: "PENDING",
        },
    });
}

// Get user's deliveries
async function getUserDeliveries(userId) {
    return prisma.delivery.findMany({
        where: {
            order: {
                userId: Number(userId),
            },
        },
        include: {
            order: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
// Update delivery status
async function updateDeliveryStatus(deliveryId, status, trackingNumber) {
    return prisma.delivery.update({
        where: {
            id: Number(deliveryId),
        },
        data: {
            status,
            trackingNumber: trackingNumber || undefined,
        },
    });
}

module.exports = {
    createDelivery,
    getUserDeliveries,
    updateDeliveryStatus,
};