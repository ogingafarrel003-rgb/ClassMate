const express = require("express");

const {
    getPosts,
    getPostById,
    createPost,
    createComment,
    likePost,
    unlikePost,
    reportPost,
    reportComment,
} = require("../services/community.service");

const {
    authenticateToken,
} = require("../middleware/auth.middleware");

const {
    validatePositiveInteger,
} = require("../middleware/validation.middleware");

const router = express.Router();

// Get all community posts
router.get("/", async (req, res) => {
    try {
        const posts = await getPosts();

        res.json({
            posts,
        });
    } catch (error) {
        console.error("Get community posts error:", error);

        res.status(500).json({
            message: "Failed to get community posts",
        });
    }
});

// Get one community post
router.get(
    "/:postId",
    validatePositiveInteger("postId", "params"),
    async (req, res) => {
        try {
            const post = await getPostById(req.params.postId);

            if (!post) {
                return res.status(404).json({
                    message: "Community post not found",
                });
            }

            res.json({
                post,
            });
        } catch (error) {
            console.error("Get community post error:", error);

            res.status(500).json({
                message: "Failed to get community post",
            });
        }
    }
);

// Create community post
router.post(
    "/",
    authenticateToken,
    async (req, res) => {
        try {
            const {
                title,
                content,
                category,
                gradeId,
                subjectId,
            } = req.body;

            if (!title || !content) {
                return res.status(400).json({
                    message: "Title and content are required",
                });
            }

            const post = await createPost({
                userId: req.user.userId,
                title,
                content,
                category,
                gradeId,
                subjectId,
            });

            res.status(201).json({
                message: "Community post created successfully",
                post,
            });
        } catch (error) {
            console.error("Create community post error:", error);

            res.status(500).json({
                message: "Failed to create community post",
            });
        }
    }
);

// Add comment to post
router.post(
    "/:postId/comments",
    authenticateToken,
    validatePositiveInteger("postId", "params"),
    async (req, res) => {
        try {
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({
                    message: "Comment content is required",
                });
            }

            const comment = await createComment({
                postId: req.params.postId,
                userId: req.user.userId,
                content,
            });

            res.status(201).json({
                message: "Comment added successfully",
                comment,
            });
        } catch (error) {
            console.error("Create comment error:", error);

            res.status(500).json({
                message: "Failed to add comment",
            });
        }
    }
);

// Like community post
router.post(
    "/:postId/like",
    authenticateToken,
    validatePositiveInteger("postId", "params"),
    async (req, res) => {
        try {
            const result = await likePost({
                postId: req.params.postId,
                userId: req.user.userId,
            });

            res.status(201).json(result);
        } catch (error) {
            console.error("Like community post error:", error);

            if (error.message === "Community post not found") {
                return res.status(404).json({
                    message: error.message,
                });
            }

            if (error.message === "You already liked this post") {
                return res.status(409).json({
                    message: error.message,
                });
            }

            res.status(500).json({
                message: "Failed to like community post",
            });
        }
    }
);

// Unlike community post
router.delete(
    "/:postId/like",
    authenticateToken,
    validatePositiveInteger("postId", "params"),
    async (req, res) => {
        try {
            const result = await unlikePost({
                postId: req.params.postId,
                userId: req.user.userId,
            });

            res.json(result);
        } catch (error) {
            console.error("Unlike community post error:", error);

            if (error.message === "You have not liked this post") {
                return res.status(404).json({
                    message: error.message,
                });
            }

            res.status(500).json({
                message: "Failed to unlike community post",
            });
        }
    }
);

// Report community post
router.post(
    "/:postId/report",
    authenticateToken,
    validatePositiveInteger("postId", "params"),
    async (req, res) => {
        try {
            const { reason } = req.body;

            if (!reason || String(reason).trim() === "") {
                return res.status(400).json({
                    message: "Report reason is required",
                });
            }

            const result = await reportPost({
                postId: req.params.postId,
                userId: req.user.userId,
                reason,
            });

            res.status(201).json(result);
        } catch (error) {
            console.error("Report community post error:", error);

            if (error.message === "Community post not found") {
                return res.status(404).json({
                    message: error.message,
                });
            }

            res.status(500).json({
                message: "Failed to report community post",
            });
        }
    }
);

// Report community comment
router.post(
    "/comments/:commentId/report",
    authenticateToken,
    validatePositiveInteger("commentId", "params"),
    async (req, res) => {
        try {
            const { reason } = req.body;

            if (!reason || String(reason).trim() === "") {
                return res.status(400).json({
                    message: "Report reason is required",
                });
            }

            const result = await reportComment({
                commentId: req.params.commentId,
                userId: req.user.userId,
                reason,
            });

            res.status(201).json(result);
        } catch (error) {
            console.error("Report community comment error:", error);

            if (error.message === "Community comment not found") {
                return res.status(404).json({
                    message: error.message,
                });
            }

            res.status(500).json({
                message: "Failed to report community comment",
            });
        }
    }
);

module.exports = router;