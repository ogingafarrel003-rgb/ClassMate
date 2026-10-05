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

// Get current student's profile
async function getStudentProfile(userId) {
    return prisma.studentProfile.findUnique({
        where: {
            userId: Number(userId),
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
            grade: true,
        },
    });
}

// Create student profile
async function createStudentProfile({
    userId,
    educationLevel,
    gradeId,
}) {
    return prisma.studentProfile.create({
        data: {
            userId: Number(userId),
            educationLevel,
            gradeId: gradeId ? Number(gradeId) : null,
        },
        include: {
            grade: true,
        },
    });
}

// Update student profile
async function updateStudentProfile(userId, {
    educationLevel,
    gradeId,
}) {
    return prisma.studentProfile.update({
        where: {
            userId: Number(userId),
        },
        data: {
            educationLevel,
            gradeId: gradeId ? Number(gradeId) : null,
        },
        include: {
            grade: true,
        },
    });
}

module.exports = {
    getStudentProfile,
    createStudentProfile,
    updateStudentProfile,
};