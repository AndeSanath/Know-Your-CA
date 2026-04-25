const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");

// Get Inbox (list of conversations)
router.get("/inbox/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all messages involving this user
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }],
        }).sort({ timestamp: -1 });

        const conversations = {};

        messages.forEach((msg) => {
            const otherUser = msg.sender.toString() === userId ? msg.receiver : msg.sender;
            if (!conversations[otherUser]) {
                conversations[otherUser] = {
                    lastMessage: msg.content,
                    timestamp: msg.timestamp,
                };
            }
        });

        const inboxData = await Promise.all(
            Object.keys(conversations).map(async (otherUserId) => {
                const user = await User.findById(otherUserId);
                return {
                    userId: otherUserId,
                    name: user ? user.name : "Unknown User", // Fallback if user deleted or CA ID mismatch
                    lastMessage: conversations[otherUserId].lastMessage,
                    timestamp: conversations[otherUserId].timestamp,
                };
            })
        );

        res.json(inboxData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const mongoose = require("mongoose");

// Get messages between two users
router.get("/:userId/:otherUserId", async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;

        // Validate ObjectIds to prevent crashes
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId },
            ],
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (err) {
        console.error("Chat fetch error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
