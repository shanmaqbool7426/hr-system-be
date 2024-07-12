const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("attendance", new Schema({
  date: { type: String },
  checkInAt: { type: Date },
  checkOutAt: { type: Date },
  breaks: [{ type: mongoose.Types.ObjectId, ref: 'attendance_break' }],
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
