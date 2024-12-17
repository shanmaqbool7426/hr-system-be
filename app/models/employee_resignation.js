const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("employee_resignation", new Schema({
  employee: { type: mongoose.Types.ObjectId, ref: 'user' },
  effectiveDate: { type: Date },
  lastWorkingDay: { type: Date },
  reason: { type: String },
  status: { type: String, default: "pending", enum: ["pending", "approved", "rejected"] },
  remarks: { type: String },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  updatedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
