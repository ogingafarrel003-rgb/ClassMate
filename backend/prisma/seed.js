const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const adapter = new PrismaMariaDb({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "classmate",
});

const prisma = new PrismaClient({ adapter });

const curriculum = {
    "Grade 1": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Environmental Activities",
        "Creative Activities",
        "Religious Education",
    ],
    "Grade 2": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Environmental Activities",
        "Creative Activities",
        "Religious Education",
    ],
    "Grade 3": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Environmental Activities",
        "Creative Activities",
        "Religious Education",
    ],
    "Grade 4": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Science and Technology",
        "Social Studies",
        "Agriculture",
        "Creative Activities",
        "Religious Education",
    ],
    "Grade 5": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Science and Technology",
        "Social Studies",
        "Agriculture",
        "Creative Activities",
        "Religious Education",
    ],
    "Grade 6": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Science and Technology",
        "Social Studies",
        "Agriculture",
        "Creative Activities",
        "Religious Education",
    ],
    "Grade 7": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Integrated Science",
        "Social Studies",
        "Agriculture",
        "Pre-Technical Studies",
        "Creative Arts and Sports",
        "Religious Education",
    ],
    "Grade 8": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Integrated Science",
        "Social Studies",
        "Agriculture",
        "Pre-Technical Studies",
        "Creative Arts and Sports",
        "Religious Education",
    ],
    "Grade 9": [
        "English",
        "Kiswahili",
        "Mathematics",
        "Integrated Science",
        "Social Studies",
        "Agriculture",
        "Pre-Technical Studies",
        "Creative Arts and Sports",
        "Religious Education",
    ],
};

async function main() {
    // Seed grades and subjects
    for (const [gradeName, subjectNames] of Object.entries(curriculum)) {
        const grade = await prisma.grade.findUnique({
            where: {
                name: gradeName,
            },
        });

        if (!grade) {
            console.log(`Grade not found: ${gradeName}`);
            continue;
        }

        for (const subjectName of subjectNames) {
            await prisma.subject.upsert({
                where: {
                    name_gradeId: {
                        name: subjectName,
                        gradeId: grade.id,
                    },
                },
                update: {},
                create: {
                    name: subjectName,
                    gradeId: grade.id,
                },
            });
        }
    }

    console.log("Grades and subjects seeded successfully ✅");

    // Create or update admin user
// Create or update admin user
const hashedPassword = await bcrypt.hash("Admin@12345", 10);

await prisma.user.upsert({
    where: {
        email: "admin@classmate.com",
    },
    update: {
        role: "ADMIN",
        firstName: "ClassMate",
        lastName: "Admin",
        passwordHash: hashedPassword,
    },
    create: {
        email: "admin@classmate.com",
        firstName: "ClassMate",
        lastName: "Admin",
        passwordHash: hashedPassword,
        role: "ADMIN",
    },
});

console.log("Admin user seeded successfully ✅");

    console.log("Admin user seeded successfully ✅");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });