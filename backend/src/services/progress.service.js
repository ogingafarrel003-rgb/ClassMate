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

// Get student's overall progress
async function getStudentProgress(userId) {
    const attempts = await prisma.quizAttempt.findMany({
        where: {
            userId: Number(userId),
            completedAt: {
                not: null,
            },
        },
        include: {
            quiz: {
                include: {
                    subject: true,
                    grade: true,
                },
            },
        },
        orderBy: {
            completedAt: "desc",
        },
    });

    const quizzesCompleted = attempts.length;

    const totalScore = attempts.reduce(
        (total, attempt) => total + attempt.score,
        0
    );

    const totalMarks = attempts.reduce(
        (total, attempt) => total + attempt.totalMarks,
        0
    );

    const percentage =
        totalMarks > 0
            ? Math.round((totalScore / totalMarks) * 100)
            : 0;

    const scores = attempts.map((attempt) =>
        attempt.totalMarks > 0
            ? Math.round(
                  (attempt.score / attempt.totalMarks) * 100
              )
            : 0
    );

    const averageScore =
        scores.length > 0
            ? Math.round(
                  scores.reduce(
                      (total, score) => total + score,
                      0
                  ) / scores.length
              )
            : 0;

    const highestScore =
        scores.length > 0
            ? Math.max(...scores)
            : 0;

    const lowestScore =
        scores.length > 0
            ? Math.min(...scores)
            : 0;

    const recentAttempts = attempts
        .slice(0, 5)
        .map((attempt) => ({
            id: attempt.id,
            quizId: attempt.quizId,
            quizTitle: attempt.quiz.title,
            subject: attempt.quiz.subject.name,
            grade: attempt.quiz.grade.name,
            score: attempt.score,
            totalMarks: attempt.totalMarks,
            percentage:
                attempt.totalMarks > 0
                    ? Math.round(
                          (attempt.score /
                              attempt.totalMarks) *
                              100
                      )
                    : 0,
            completedAt: attempt.completedAt,
        }));

    return {
        userId: Number(userId),
        quizzesCompleted,
        totalScore,
        totalMarks,
        percentage,
        averageScore,
        highestScore,
        lowestScore,
        recentAttempts,
        attempts,
    };
}

// Get progress by subject
async function getProgressBySubject(userId) {
    const attempts = await prisma.quizAttempt.findMany({
        where: {
            userId: Number(userId),
            completedAt: {
                not: null,
            },
        },
        include: {
            quiz: {
                include: {
                    subject: true,
                },
            },
        },
    });

    const subjectProgress = {};

    for (const attempt of attempts) {
        const subjectId = attempt.quiz.subjectId;
        const subjectName = attempt.quiz.subject.name;

        if (!subjectProgress[subjectId]) {
            subjectProgress[subjectId] = {
                subjectId,
                subjectName,
                quizzesCompleted: 0,
                totalScore: 0,
                totalMarks: 0,
            };
        }

        subjectProgress[subjectId].quizzesCompleted += 1;
        subjectProgress[subjectId].totalScore += attempt.score;
        subjectProgress[subjectId].totalMarks += attempt.totalMarks;
    }

    return Object.values(subjectProgress).map((subject) => ({
        ...subject,
        percentage:
            subject.totalMarks > 0
                ? Math.round(
                      (subject.totalScore /
                          subject.totalMarks) *
                          100
                  )
                : 0,
    }));
}

module.exports = {
    getStudentProgress,
    getProgressBySubject,
};