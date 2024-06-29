const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("leave_request", new Schema({
    duration: { type: Number }, // in days
    formDate: { type: Date },
    toDate: { type: Date },
    status: { type: String },
    reason: { type: String },
    attachment: { type: String },
    leave: { type: mongoose.Types.ObjectId, ref: 'leave' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
