function errorHandler(err, req, res, next) {
    console.error("Server error:", err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode =
        Number.isInteger(err.statusCode) && err.statusCode >= 400
            ? err.statusCode
            : 500;

    if (statusCode === 500) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }

    res.status(statusCode).json({
        message: err.message || "Request failed",
    });
}

module.exports = {
    errorHandler,
};