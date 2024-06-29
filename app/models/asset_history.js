const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("asset_history", new Schema({
    issueDdate: { type: Date },
    issueTo: { type: mongoose.Types.ObjectId, ref: 'user' },
    issueRemarks: { type: String },
    returnDate: { type: Date },
    returnTo: { type: mongoose.Types.ObjectId, ref: 'user' },
    returnRemarks: { type: String },
    asset: { type: mongoose.Types.ObjectId, ref: 'asset' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
