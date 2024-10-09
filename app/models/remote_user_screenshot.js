const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_user_screenshot", new Schema({
  url: { type: String },
  processName: { type: String },
  takenAt: { type: Date },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
