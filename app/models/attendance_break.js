const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("attendance_break", new Schema({
  startAt: { type: Date },
  endAt: { type: Date },
  attendance: { type: mongoose.Types.ObjectId, ref: 'attendance' },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
  timestamps: true,
}));
