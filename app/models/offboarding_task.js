const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("offboarding_task", new Schema({
    name: { type: String },
    active: { type: Boolean, default: true },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
