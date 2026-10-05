function validateRequiredFields(fields) {
    return (req, res, next) => {
        const missingFields = [];

        for (const field of fields) {
            const value = req.body[field];

            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                fields: missingFields,
            });
        }

        next();
    };
}

function validatePositiveInteger(field, source = "body") {
    return (req, res, next) => {
        const value =
            source === "params"
                ? Number(req.params[field])
                : Number(req.body[field]);

        if (
            !Number.isInteger(value) ||
            value <= 0
        ) {
            return res.status(400).json({
                message: `${field} must be a positive integer`,
            });
        }

        next();
    };
}

// Validate email address
function validateEmail(field) {
    return (req, res, next) => {
        const value = req.body[field];

        if (
            typeof value !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ) {
            return res.status(400).json({
                message: `${field} must be a valid email address`,
            });
        }

        next();
    };
}

module.exports = {
    validateRequiredFields,
    validatePositiveInteger,
    validateEmail,
};