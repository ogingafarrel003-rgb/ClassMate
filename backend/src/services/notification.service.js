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

// Get user's notifications
async function getUserNotifications(userId) {
    return prisma.notification.findMany({
        where: {
            userId: Number(userId),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Create notification
async function createNotification({
    userId,
    title,
    message,
    type,
}) {
    return prisma.notification.create({
        data: {
            userId: Number(userId),
            title,
            message,
            type,
        },
    });
}

// Mark notification as read
async function markNotificationAsRead(id, userId) {
    return prisma.notification.updateMany({
        where: {
            id: Number(id),
            userId: Number(userId),
        },
        data: {
            isRead: true,
        },
    });
}

module.exports = {
    getUserNotifications,
    createNotification,
    markNotificationAsRead,
};