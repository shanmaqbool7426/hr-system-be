const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("change_shift_request", new Schema({
  effectiveDate: { type: Date },
  validTill: { type: Date },
  previousShift: { type: mongoose.Types.ObjectId, ref: 'shift_plan' },
  requestedShift: { type: mongoose.Types.ObjectId, ref: 'shift_plan' },
  reason: { type: String },
  employee: { type: mongoose.Types.ObjectId, ref: 'user' },
  status: { type: String, enum: ['pending', 'approved', 'reverted'], default: 'pending' },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  updatedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
