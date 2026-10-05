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

// Get teacher dashboard statistics
async function getTeacherDashboardStats() {
    const [
        totalNotes,
        totalPastPapers,
        totalQuestions,
        totalQuizzes,
    ] = await Promise.all([
        prisma.note.count(),
        prisma.pastPaper.count(),
        prisma.question.count(),
        prisma.quiz.count(),
    ]);

    return {
        totalNotes,
        totalPastPapers,
        totalQuestions,
        totalQuizzes,
    };
}

module.exports = {
    getTeacherDashboardStats,
};