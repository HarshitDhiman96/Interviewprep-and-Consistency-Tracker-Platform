const mongoose = require('mongoose');

const inconsistencyReasonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  tag: {
    type: String,
    enum: ['burnout', 'distraction', 'no plan', 'health', 'other', ''],
    default: ''
  },
  gapDays: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InconsistencyReason', inconsistencyReasonSchema);
