const prisma = require("../lib/prisma");

// Get all notes
async function getAllNotes() {
    return prisma.note.findMany({
        include: {
            topic: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get all notes
async function getAllNotes() {
    return prisma.note.findMany({
        include: {
            topic: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get note by ID
async function getNoteById(id) {
    return prisma.note.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            topic: true,
        },
    });
}

// Create note
async function createNote(userId, data) {
    const topic = await prisma.topic.findUnique({
        where: {
            id: Number(data.topicId),
        },
    });

    if (!topic) {
        throw new Error("Topic not found");
    }

    return prisma.note.create({
        data: {
            title: data.title,
            content: data.content,
            topicId: topic.id,
            source: data.source || "ClassMate Original",
            license: data.license || "Original ClassMate Content",
            status: data.status || "DRAFT",
        },
        include: {
            topic: true,
        },
    });
}
async function updateNote(id, data) {
    return prisma.note.update({
        where: {
            id: Number(id),
        },
        data: {
            title: data.title,
            content: data.content,
            source: data.source,
            license: data.license,
            status: data.status,
        },
        include: {
            topic: true,
        },
    });
}

module.exports = {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
};