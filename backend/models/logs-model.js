const mongoose = require('mongoose')
const user=require('../models/user-model')

const logschema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    skill: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["solved", "stuck", "revised"],
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"]
    },
    timespent: {
        type: Number,
        required: true
    }
}, { timestamps: true });

logschema.index({ user: 1, createdAt: -1 });

module.exports = new mongoose.model('log', logschema)