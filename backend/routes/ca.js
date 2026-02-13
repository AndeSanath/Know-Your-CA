const express = require("express");
const router = express.Router();
const CA = require("../models/CA");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create CA Profile
router.post("/", async (req, res) => {
    try {
        const { userId, name, image, headerImage, specialization, location, experience, about, price } = req.body;

        // Check if CA profile already exists for this user
        let existingCA = await CA.findOne({ userId });
        if (existingCA) {
            return res.status(400).json({ message: "CA Profile already exists" });
        }

        const newCA = new CA({
            userId,
            name,
            image,
            headerImage,
            specialization,
            location,
            experience,
            about,
            price
        });

        await newCA.save();
        res.status(201).json(newCA);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all CAs with optional search
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { specialization: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                ],
            };
        }

        const cas = await CA.find(query);
        res.json(cas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a Review
router.post("/:id/review", async (req, res) => {
    try {
        const { userId, userName, rating, comment } = req.body;
        const ca = await CA.findById(req.params.id);

        if (!ca) {
            return res.status(404).json({ message: "CA not found" });
        }

        const review = {
            userId,
            userName,
            rating: Number(rating),
            comment,
        };

        ca.reviews.push(review);

        // Calculate new average rating
        const totalRating = ca.reviews.reduce((acc, item) => item.rating + acc, 0);
        ca.rating = (totalRating / ca.reviews.length).toFixed(1);

        await ca.save();
        res.status(201).json({ message: "Review added", ca });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get CA by ID
router.get("/:id", async (req, res) => {
    try {
        const ca = await CA.findById(req.params.id);
        if (!ca) return res.status(404).json({ message: "CA not found" });
        res.json(ca);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Seed API to populate dummy data
router.post("/seed", async (req, res) => {
    try {
        await CA.deleteMany({}); // Clear existing CA data
        await User.deleteMany({ role: "ca" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const dummyCAs = [
            {
                name: "Rahul Sharma",
                image: "https://randomuser.me/api/portraits/men/1.jpg",
                specialization: "Taxation & GST",
                location: "Mumbai, India",
                rating: 4.8,
                experience: "12 Years",
                about: "Expert in corporate taxation and GST compliance for startups and SMEs.",
                price: "₹1500/hr",
            },
            {
                name: "Priya Verma",
                image: "https://randomuser.me/api/portraits/women/2.jpg",
                specialization: "Internal Audit",
                location: "Delhi, India",
                rating: 4.6,
                experience: "8 Years",
                about: "Specialized in internal audits and financial risk assessment for large enterprises.",
                price: "₹2000/hr",
            },
            {
                name: "Amit Patel",
                image: "https://randomuser.me/api/portraits/men/3.jpg",
                specialization: "Corporate Finance",
                location: "Ahmedabad, India",
                rating: 4.9,
                experience: "15 Years",
                about: "Helping businesses with fundraising, valuation, and financial modeling.",
                price: "₹2500/hr",
            },
            {
                name: "Sneha Gupta",
                image: "https://randomuser.me/api/portraits/women/4.jpg",
                specialization: "Forensic Accounting",
                location: "Bangalore, India",
                rating: 4.7,
                experience: "10 Years",
                about: "Expert in fraud detection and forensic accounting investigations.",
                price: "₹1800/hr",
            },
            {
                name: "Vikram Singh",
                image: "https://randomuser.me/api/portraits/men/5.jpg",
                specialization: "International Taxation",
                location: "Hyderabad, India",
                rating: 4.5,
                experience: "9 Years",
                about: "Advising on cross-border transactions and international tax treaties.",
                price: "₹2200/hr",
            },
            {
                name: "Anjali Mehta",
                image: "https://randomuser.me/api/portraits/women/6.jpg",
                specialization: "GST & Indirect Tax",
                location: "Pune, India",
                rating: 4.8,
                experience: "11 Years",
                about: "Comprehensive GST solutions for manufacturing and service sectors.",
                price: "₹1600/hr",
            }
        ];

        const createdCAs = [];

        for (const caData of dummyCAs) {
            // Create User for CA
            const email = caData.name.toLowerCase().replace(" ", ".") + "@example.com";

            // Check if user already exists
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    name: caData.name,
                    email: email,
                    password: hashedPassword,
                    role: "ca"
                });
                // We set password again because of pre-save hook behavior if needed, 
                // but actually if we pass hashed password, we should NOT trigger re-hash.
                // The pre-save hook checks isModified('password').
                // If we set it in constructor, it is modified.
                // So we should pass plain text "password123" and let pre-save hash it.
                user.password = "password123";
                await user.save();
            }

            // Create CA linked to User
            const newCA = new CA({
                ...caData,
                userId: user._id
            });
            await newCA.save();
            createdCAs.push(newCA);
        }

        res.json({ message: "Database seeded successfully with dummy CAs and linked Users", createdCAs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
