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

// Get all past papers
async function getPastPapers() {
    return prisma.pastPaper.findMany({
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            year: "desc",
        },
    });
}

// Get one past paper
async function getPastPaperById(id) {
    return prisma.pastPaper.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            grade: true,
            subject: true,
        },
    });
}

// Get past papers by grade
async function getPastPapersByGrade(gradeId) {
    return prisma.pastPaper.findMany({
        where: {
            gradeId: Number(gradeId),
        },
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            year: "desc",
        },
    });
}

// Get past papers by subject
async function getPastPapersBySubject(subjectId) {
    return prisma.pastPaper.findMany({
        where: {
            subjectId: Number(subjectId),
        },
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            year: "desc",
        },
    });
}

// Create past paper
async function createPastPaper({
    title,
    year,
    examType,
    gradeId,
    subjectId,
    fileUrl,
    markingUrl,
    source,
    license,
    status = "DRAFT",
}) {
    return prisma.pastPaper.create({
        data: {
            title,
            year: Number(year),
            examType,
            gradeId: Number(gradeId),
            subjectId: Number(subjectId),
            fileUrl,
            markingUrl,
            source,
            license,
            status,
        },
    });
}

// Update past paper
async function updatePastPaper(id, data) {
    return prisma.pastPaper.update({
        where: {
            id: Number(id),
        },
        data: {
            title: data.title,
            year: data.year !== undefined
                ? Number(data.year)
                : undefined,
            examType: data.examType,
            gradeId: data.gradeId !== undefined
                ? Number(data.gradeId)
                : undefined,
            subjectId: data.subjectId !== undefined
                ? Number(data.subjectId)
                : undefined,
            fileUrl: data.fileUrl,
            markingUrl: data.markingUrl,
            source: data.source,
            license: data.license,
            status: data.status,
        },
        include: {
            grade: true,
            subject: true,
        },
    });
}

module.exports = {
    getPastPapers,
    getPastPaperById,
    getPastPapersByGrade,
    getPastPapersBySubject,
    createPastPaper,
    updatePastPaper,
};