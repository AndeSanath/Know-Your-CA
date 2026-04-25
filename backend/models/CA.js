const mongoose = require("mongoose");

const CASchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    experience: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        default: "Contact for pricing",
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            userName: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

module.exports = mongoose.model("CA", CASchema);
