const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("asset", new Schema({
    assetId: { type: String, index: true },
    purchaseDate: { type: Date },
    warrantyExpiry: { type: Date },
    cost: { type: Number },
    status: { type: String, default: "New" },
    vendor: { type: String },
    fields: { type: Object },
    assetType: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
