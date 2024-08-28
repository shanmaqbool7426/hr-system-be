const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("custom_field", new Schema({
    name: { type: String, index: true },
    type: { type: String, index: true },
    category: { type: String },
    prefix: { type: String },
    icon: { type: String },
    fields: [{ type: String }],
    parent: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
