const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_work_request", new Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
  team: { type: mongoose.Types.ObjectId, ref: 'remote_team' },
  startDate: { type: Date },
  endDate: { type: Date },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: "pending" },
  statusReason: { type: String },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
