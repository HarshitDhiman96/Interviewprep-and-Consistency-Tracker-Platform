const mongoose = require('mongoose')
const user=require('../models/user-model')

const streakschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date
    }
}, { timestamps: true })

module.exports = new mongoose.model('Streak', streakschema);