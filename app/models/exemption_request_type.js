const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("exemption_request_type", new Schema({
  title: { type: String },
  minHours: { type: Number },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
