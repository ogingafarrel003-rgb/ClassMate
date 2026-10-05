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

// Create payment
async function createPayment(userId, data) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
            where: {
                id: Number(data.orderId),
                userId: Number(userId),
            },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        const paymentStatus = data.status || "PENDING";

        const payment = await tx.payment.create({
            data: {
                orderId: order.id,
                amount: order.totalAmount,
                method: data.method,
                transactionId: data.transactionId || null,
                status: paymentStatus,
            },
        });

        if (paymentStatus === "PAID") {
            await tx.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    status: "PAID",
                },
            });
        }

        return payment;
    });
}

// Get payments for the current user
async function getUserPayments(userId) {
    return prisma.payment.findMany({
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

module.exports = {
    createPayment,
    getUserPayments,
};