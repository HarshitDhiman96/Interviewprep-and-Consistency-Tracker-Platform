const mongoose=require("mongoose");

const revisionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  revisionCount: {
    type: Number,
    default: 1
  },
  lastRevisedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports= new mongoose.model("Revision", revisionSchema);