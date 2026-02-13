const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

// Register
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({
            name,
            email,
            password,
            role: role || "user",
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, isSubscribed: user.isSubscribed },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isSubscribed: user.isSubscribed,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign(
                { id: user._id, role: user.role, name: user.name, isSubscribed: user.isSubscribed },
                JWT_SECRET,
                { expiresIn: "30d" }
            );

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isSubscribed: user.isSubscribed,
                token,
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
