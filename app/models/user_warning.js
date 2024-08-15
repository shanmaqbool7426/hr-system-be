const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("user_warning", new Schema({
    name: { type: String },
    description: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
