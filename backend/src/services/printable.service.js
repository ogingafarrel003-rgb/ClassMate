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

// Get all printables
async function getPrintables() {
    return prisma.printable.findMany({
        include: {
            grade: true,
            subject: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get printable by ID
async function getPrintableById(id) {
    return prisma.printable.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            grade: true,
            subject: true,
        },
    });
}

// Create printable
async function createPrintable(data) {
    return prisma.printable.create({
        data: {
            title: data.title,
            description: data.description,
            fileUrl: data.fileUrl,
            gradeId: data.gradeId ? Number(data.gradeId) : null,
            subjectId: data.subjectId ? Number(data.subjectId) : null,
            type: data.type,
            price: data.price ? Number(data.price) : null,
            isFree: data.isFree !== false,
            status: data.status || "DRAFT",
        },
    });
}

module.exports = {
    getPrintables,
    getPrintableById,
    createPrintable,
};