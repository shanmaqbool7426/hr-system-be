const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("asset", new Schema({
    assetId: { type: String, index: true },
    purchaseDate: { type: Date },
    warrantyExpiry: { type: Date },
    cost: { type: Number },
    status: { type: String, default: "new", enum: ["new", "assigned", "returned", "reported", "expired", "sold", "deleted"] },
    vendor: { type: String },
    fields: { type: Object },
    isRepaired: { type: Boolean, default: false },
    assetType: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    assetHistory: { type: mongoose.Types.ObjectId, ref: 'asset_history' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    condition: { type: Number, default: 1 },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
    remarks: { type: String },
}, {
    timestamps: true,
}));
