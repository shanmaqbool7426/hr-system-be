const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("user_acadamic", new Schema({
    institution: { type: String },
    degree: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
