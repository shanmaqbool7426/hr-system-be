const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("biometric_device", new Schema({
    ipAddress: { type: String, index: true },
    port: { type: Number },
    station: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
