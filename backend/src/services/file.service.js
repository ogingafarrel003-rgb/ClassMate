const path = require("path");
const fs = require("fs");

// Upload directory
const uploadDir = path.join(__dirname, "../../uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Save uploaded file
async function saveFile(file) {
    if (!file) {
        throw new Error("No file provided");
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return {
        fileName,
        filePath,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
    };
}

// Delete file
async function deleteFile(fileName) {
    const filePath = path.join(uploadDir, fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }

    return false;
}

module.exports = {
    saveFile,
    deleteFile,
};