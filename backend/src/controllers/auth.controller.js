const {
    registerUser,
    loginUser,
} = require("../services/auth.service");

async function register(req, res) {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "Email, password, first name and last name are required",
            });
        }

        const result = await registerUser({
            email,
            password,
            firstName,
            lastName,
            role,
        });

        res.status(201).json({
            message: "Registration successful",
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(400).json({
            message: error.message,
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const result = await loginUser({
            email,
            password,
        });

        res.json({
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(401).json({
            message: error.message,
        });
    }
}

module.exports = {
    register,
    login,
};