const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("user_change_request", new Schema({
    employee: { type: mongoose.Types.ObjectId, ref: 'user' },
    effectiveDate: { type: Date },
    type: { type: String },
    currentValue: { type: String },
    reason: { type: String },
    detail : {type:String},
    employeeCode: { type: String },
    attachment: { type: String },
    salary: { type: Number },
    lineManager: { type: mongoose.Types.ObjectId, ref: 'user' },
    department: { type: mongoose.Types.ObjectId, ref: 'department' },
    designation: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    grade: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
