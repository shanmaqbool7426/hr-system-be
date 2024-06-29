const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("department", new Schema({
    name: { type: String, index: true },
    code: { type: String, index: true },
    status: { type: String, default: 'active', index: true },
    head: { type: mongoose.Types.ObjectId, ref: 'user' },
    parent: { type: mongoose.Types.ObjectId, ref: 'department' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
