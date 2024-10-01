const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("exemption_request", new Schema({
  date: { type: String },
  reason: { type: String },
  status: { type: String, default: "pending" },
  statusReason: { type: String },
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  updatedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
