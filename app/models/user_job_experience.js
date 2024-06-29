const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("user_job_experience", new Schema({
    organization: { type: String },
    location: { type: String },
    designation: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
