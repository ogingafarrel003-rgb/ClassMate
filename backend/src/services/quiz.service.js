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

// Get all quizzes
async function getAllQuizzes() {
    return prisma.quiz.findMany({
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get quiz by ID
async function getQuizById(id) {
    return prisma.quiz.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            grade: true,
            subject: true,
            questions: {
                include: {
                    question: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
}

// Create quiz
async function createQuiz({
    title,
    description,
    gradeId,
    subjectId,
}) {
    return prisma.quiz.create({
        data: {
            title,
            description,
            gradeId: Number(gradeId),
            subjectId: Number(subjectId),
        },
        include: {
            grade: true,
            subject: true,
        },
    });
}

// Update quiz
async function updateQuiz(id, data) {
    return prisma.quiz.update({
        where: {
            id: Number(id),
        },
        data: {
            title: data.title,
            description: data.description,
            gradeId: data.gradeId !== undefined
                ? Number(data.gradeId)
                : undefined,
            subjectId: data.subjectId !== undefined
                ? Number(data.subjectId)
                : undefined,
        },
        include: {
            grade: true,
            subject: true,
        },
    });
}

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
};