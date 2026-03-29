const mongoose = require('mongoose');

const HeatmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  elementId: {
    type: String,
    default: null
  },
  resolution: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Heatmap', HeatmapSchema);
