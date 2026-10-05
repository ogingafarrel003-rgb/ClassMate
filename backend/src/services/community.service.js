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

// Get all posts
async function getPosts() {
    return prisma.communityPost.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
            comments: {
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
                    createdAt: "asc",
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get one post
async function getPostById(id) {
    return prisma.communityPost.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
            comments: {
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
                    createdAt: "asc",
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
    });
}

// Create post
async function createPost({
    userId,
    title,
    content,
    category,
    gradeId,
    subjectId,
}) {
    return prisma.communityPost.create({
        data: {
            userId: Number(userId),
            title,
            content,
            category,
            gradeId: gradeId ? Number(gradeId) : null,
            subjectId: subjectId ? Number(subjectId) : null,
        },
    });
}

// Add comment
async function createComment({
    postId,
    userId,
    content,
}) {
    return prisma.communityComment.create({
        data: {
            postId: Number(postId),
            userId: Number(userId),
            content,
        },
    });
}

// Like post
async function likePost({
    postId,
    userId,
}) {
    const post = await prisma.communityPost.findUnique({
        where: {
            id: Number(postId),
        },
    });

    if (!post) {
        throw new Error("Community post not found");
    }

    const existingLike = await prisma.communityLike.findUnique({
        where: {
            postId_userId: {
                postId: Number(postId),
                userId: Number(userId),
            },
        },
    });

    if (existingLike) {
        throw new Error("You already liked this post");
    }

    await prisma.communityLike.create({
        data: {
            postId: Number(postId),
            userId: Number(userId),
        },
    });

    const likeCount = await prisma.communityLike.count({
        where: {
            postId: Number(postId),
        },
    });

    return {
        message: "Post liked successfully",
        postId: Number(postId),
        liked: true,
        likeCount,
    };
}

// Unlike post
async function unlikePost({
    postId,
    userId,
}) {
    const existingLike = await prisma.communityLike.findUnique({
        where: {
            postId_userId: {
                postId: Number(postId),
                userId: Number(userId),
            },
        },
    });

    if (!existingLike) {
        throw new Error("You have not liked this post");
    }

    await prisma.communityLike.delete({
        where: {
            postId_userId: {
                postId: Number(postId),
                userId: Number(userId),
            },
        },
    });

    const likeCount = await prisma.communityLike.count({
        where: {
            postId: Number(postId),
        },
    });

    return {
        message: "Post unliked successfully",
        postId: Number(postId),
        liked: false,
        likeCount,
    };
}

// Report a community post
async function reportPost({
    postId,
    userId,
    reason,
}) {
    const post = await prisma.communityPost.findUnique({
        where: {
            id: Number(postId),
        },
    });

    if (!post) {
        throw new Error("Community post not found");
    }

    if (!reason || String(reason).trim() === "") {
        throw new Error("Report reason is required");
    }

    const report = await prisma.communityReport.create({
        data: {
            postId: Number(postId),
            userId: Number(userId),
            reason: String(reason).trim(),
        },
    });

    return {
        message: "Post reported successfully",
        report,
    };
}

// Report a community comment
async function reportComment({
    commentId,
    userId,
    reason,
}) {
    const comment = await prisma.communityComment.findUnique({
        where: {
            id: Number(commentId),
        },
    });

    if (!comment) {
        throw new Error("Community comment not found");
    }

    if (!reason || String(reason).trim() === "") {
        throw new Error("Report reason is required");
    }

    const report = await prisma.communityReport.create({
        data: {
            commentId: Number(commentId),
            userId: Number(userId),
            reason: String(reason).trim(),
        },
    });

    return {
        message: "Comment reported successfully",
        report,
    };
}

module.exports = {
    getPosts,
    getPostById,
    createPost,
    createComment,
    likePost,
    unlikePost,
    reportPost,
    reportComment,
};