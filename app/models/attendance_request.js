const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("attendance_request", new Schema({
  date: { type: String },
  checkInAt: { type: Date },
  checkOutAt: { type: Date },
  reason: { type: String },
  status: { type: String, default: "pending" },
  statusReason: { type: String },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
