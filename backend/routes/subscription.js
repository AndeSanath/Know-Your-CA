const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

// Purchase Subscription (Mock)
router.post("/purchase", async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isSubscribed = true;
        await user.save();

        // Generate new token with updated subscription status
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, isSubscribed: true },
            JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({ message: "Subscription successful", user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
