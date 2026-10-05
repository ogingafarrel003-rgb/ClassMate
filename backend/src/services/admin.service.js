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

// Get all users
async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Update user role
async function updateUserRole(userId, role) {
    const allowedRoles = ["STUDENT", "TEACHER", "ADMIN"];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role");
    }

    return prisma.user.update({
        where: {
            id: Number(userId),
        },
        data: {
            role,
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

// Delete user
async function deleteUser(userId, currentAdminId) {
    const id = Number(userId);

    if (id === Number(currentAdminId)) {
        throw new Error("Admin cannot delete their own account");
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    await prisma.user.delete({
        where: {
            id,
        },
    });

    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
}

// Get community reports
async function getCommunityReports(status) {
    const where = status
        ? {
              status: String(status).toUpperCase(),
          }
        : {};

    return prisma.communityReport.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            post: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            comment: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Update community report status
async function updateCommunityReportStatus(reportId, status) {
    const allowedStatuses = [
        "PENDING",
        "RESOLVED",
        "DISMISSED",
    ];

    const normalizedStatus = String(status).toUpperCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
        throw new Error("Invalid report status");
    }

    const report = await prisma.communityReport.findUnique({
        where: {
            id: Number(reportId),
        },
    });

    if (!report) {
        throw new Error("Community report not found");
    }

    return prisma.communityReport.update({
        where: {
            id: Number(reportId),
        },
        data: {
            status: normalizedStatus,
        },
    });
}

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getCommunityReports,
    updateCommunityReportStatus,
};