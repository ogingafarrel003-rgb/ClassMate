require("dotenv").config();

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

async function test() {
    try {
        const notes = await prisma.note.findMany();
        console.log("NOTES RESULT:");
        console.log(notes);
    } catch (error) {
        console.error("PRISMA ERROR:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

test();