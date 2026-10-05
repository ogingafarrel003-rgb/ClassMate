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

// Get all questions for a quiz
async function getQuizQuestions(quizId) {
    return prisma.quizQuestion.findMany({
        where: {
            quizId: Number(quizId),
        },
        include: {
            question: true,
        },
        orderBy: {
            order: "asc",
        },
    });
}

// Add a question to a quiz
async function addQuestionToQuiz({
    quizId,
    questionId,
    order,
}) {
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: Number(quizId),
        },
    });

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    const question = await prisma.question.findUnique({
        where: {
            id: Number(questionId),
        },
    });

    if (!question) {
        throw new Error("Question not found");
    }

    return prisma.quizQuestion.create({
        data: {
            quizId: Number(quizId),
            questionId: Number(questionId),
            order: Number(order),
        },
        include: {
            quiz: true,
            question: true,
        },
    });
}

// Remove a question from a quiz
async function removeQuestionFromQuiz(id) {
    return prisma.quizQuestion.delete({
        where: {
            id: Number(id),
        },
    });
}

module.exports = {
    getQuizQuestions,
    addQuestionToQuiz,
    removeQuestionFromQuiz,
};