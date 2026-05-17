const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    collegename: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    rememberMe: {
        type: Boolean,
        default: false
    },
    lastActiveDate: {
        type: Date
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date
    },
    isFirstTimeUser: {
        type: Boolean,
        default: true
    },
    needsInconsistencyReason: {
        type: Boolean,
        default: false
    },
    inconsistencyGapDays: {
        type: Number,
        default: 0
    },
    skills: [{
        name: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true })

module.exports = new mongoose.model('user', userschema)
