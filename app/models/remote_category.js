const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_category", new Schema({
    name: { type: String },
    color: { type: String },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
