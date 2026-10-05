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

// Get all questions for a past paper
async function getQuestionsByPastPaper(pastPaperId) {
    return prisma.question.findMany({
        where: {
            pastPaperId: Number(pastPaperId),
        },
        orderBy: {
            order: "asc",
        },
    });
}

// Get one question
async function getQuestionById(id) {
    return prisma.question.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            pastPaper: true,
        },
    });
}

// Create question
async function createQuestion({
    question,
    answer,
    explanation,
    marks,
    order,
    pastPaperId,
}) {
    return prisma.question.create({
        data: {
            question,
            answer,
            explanation,
            marks: marks ? Number(marks) : null,
            order: Number(order),
            pastPaperId: Number(pastPaperId),
        },
    });
}

// Update question
async function updateQuestion(id, data) {
    return prisma.question.update({
        where: {
            id: Number(id),
        },
        data,
    });
}

// Delete question
async function deleteQuestion(id) {
    return prisma.question.delete({
        where: {
            id: Number(id),
        },
    });
}

module.exports = {
    getQuestionsByPastPaper,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};