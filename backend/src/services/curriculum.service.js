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

async function getGrades() {
    return prisma.grade.findMany({
        orderBy: {
            id: "asc",
        },
    });
}

async function getSubjectsByGrade(gradeId) {
    return prisma.subject.findMany({
        where: {
            gradeId: Number(gradeId),
        },
        orderBy: {
            name: "asc",
        },
    });
}

module.exports = {
    getGrades,
    getSubjectsByGrade,
};