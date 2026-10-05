const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./lib/prisma");

const authRoutes = require("./routes/auth.routes");
const curriculumRoutes = require("./routes/curriculum.routes");
const notesRoutes = require("./routes/notes.routes");
const topicsRoutes = require("./routes/topics.routes");
const pastPapersRoutes = require("./routes/pastPapers.routes");
const questionsRoutes = require("./routes/questions.routes");
const quizRoutes = require("./routes/quiz.routes");
const progressRoutes = require("./routes/progress.routes");
const communityRoutes = require("./routes/community.routes");
const studentProfileRoutes = require("./routes/student-profile.routes");
const notificationRoutes = require("./routes/notification.routes");
const fileRoutes = require("./routes/file.routes");
const searchRoutes = require("./routes/search.routes");
const printableRoutes = require("./routes/printable.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const adminRoutes = require("./routes/admin.routes");
const teacherRoutes = require("./routes/teacher.routes");
const aiRoutes = require("./routes/ai.routes");

const { errorHandler } = require("./middleware/error.middleware");
const { authenticateToken } = require("./middleware/auth.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "ClassMate API is running 🚀"
    });
});

// Test database
app.get("/api/test-db", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            message: "Database connection successful ✅"
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed ❌"
        });
    }
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Curriculum
app.use("/api/curriculum", curriculumRoutes);

// Learning resources
app.use("/api/notes", notesRoutes);
app.use("/api/topics", topicsRoutes);
app.use("/api/past-papers", pastPapersRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);

// Community
app.use("/api/community", communityRoutes);

// Student
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/notifications", notificationRoutes);

// Files and search
app.use("/api/files", fileRoutes);
app.use("/api/search", searchRoutes);

// Printables
app.use("/api/printables", printableRoutes);

// Shop and orders
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Admin and teacher
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);

// AI
app.use("/api/ai", aiRoutes);

// Authenticated profile test
app.get("/api/profile", authenticateToken, (req, res) => {
    res.json({
        message: "You are authenticated ✅",
        user: req.user,
    });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ClassMate backend running on http://localhost:${PORT}`);
});