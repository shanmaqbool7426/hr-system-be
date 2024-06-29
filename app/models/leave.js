const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("leave", new Schema({
    name: { type: String, index: true },
    entitled: { type: Number },
    encashable: { type: Boolean },
    carryForward: { type: Boolean },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    entitledToStatus: [{ type: mongoose.Types.ObjectId, ref: 'custom_field' }],
}, {
    timestamps: true,
}));
