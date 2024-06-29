const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("role", new Schema({
    name: { type: String },
    rights: { type: Schema.Types.Mixed },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
    timestamps: true,
}));
