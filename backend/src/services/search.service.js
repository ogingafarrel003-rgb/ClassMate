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

// Search notes
async function searchNotes(query) {
    return prisma.note.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                    },
                },
                {
                    content: {
                        contains: query,
                    },
                },
            ],
        },
        include: {
            topic: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Search past papers
async function searchPastPapers(query) {
    return prisma.pastPaper.findMany({
        where: {
            title: {
                contains: query,
            },
        },
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Search quizzes
async function searchQuizzes(query) {
    return prisma.quiz.findMany({
        where: {
            title: {
                contains: query,
            },
        },
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Search community posts
async function searchCommunity(query) {
    return prisma.communityPost.findMany({
        where: {
            status: "PUBLISHED",
            OR: [
                {
                    title: {
                        contains: query,
                    },
                },
                {
                    content: {
                        contains: query,
                    },
                },
            ],
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Search everything
async function searchAll(query) {
    const [notes, pastPapers, quizzes, community] =
        await Promise.all([
            searchNotes(query),
            searchPastPapers(query),
            searchQuizzes(query),
            searchCommunity(query),
        ]);

    return {
        notes,
        pastPapers,
        quizzes,
        community,
    };
}

module.exports = {
    searchNotes,
    searchPastPapers,
    searchQuizzes,
    searchCommunity,
    searchAll,
};