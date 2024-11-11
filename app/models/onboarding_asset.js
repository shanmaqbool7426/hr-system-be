const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("onboarding_asset", new Schema({
    assetType: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    active: { type: Boolean, default: true },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
