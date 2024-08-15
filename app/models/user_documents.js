const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("user_document", new Schema({
    documentType: { type: mongoose.Types.ObjectId, ref: 'custom_field' },
    attachment: { type: String },
    documentPath: { type: String },
    uploadedDate: { type: Date },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
