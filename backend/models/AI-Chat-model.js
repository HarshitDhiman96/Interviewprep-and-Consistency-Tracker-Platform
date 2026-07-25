const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    conversationId: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return new mongoose.Types.ObjectId().toString();
        }
    },
    fullChat: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    summary: {
        type: String,
        default: ""
    },
    lastSummarizedMessageCount: {
        type: Number,
        default: 0
    },
    lastActivityAt: {
        type: Date,
        default: Date.now
    },
    isSummaryGenerated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);