const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true
    },

    conversationId: {
        type: String,
        index: true
    },

     summary: {
        type: String,
        required: true
    },

    embedding: {
        type: [Number],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("embed", embeddingSchema);