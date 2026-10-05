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

// Get teacher profile
async function getTeacherProfile(userId) {
    return prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
}

// Update teacher profile
async function updateTeacherProfile(userId, data) {
    return prisma.user.update({
        where: {
            id: Number(userId),
        },
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
}

module.exports = {
    getTeacherProfile,
    updateTeacherProfile,
};