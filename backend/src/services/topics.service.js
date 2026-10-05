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

// Get topics for a subject
async function getTopicsBySubject(subjectId) {
    return prisma.topic.findMany({
        where: {
            subjectId: Number(subjectId),
        },
        orderBy: {
            name: "asc",
        },
    });
}

// Get one topic
async function getTopicById(id) {
    return prisma.topic.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            subject: true,
        },
    });
}

// Create topic
async function createTopic({ name, subjectId }) {
    return prisma.topic.create({
        data: {
            name,
            subjectId: Number(subjectId),
        },
    });
}

module.exports = {
    getTopicsBySubject,
    getTopicById,
    createTopic,
};