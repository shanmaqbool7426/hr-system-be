const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("userdevice", new Schema({
    userAgent: { type: String },
    token: { type: String },
    refreshToken: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
    timestamps: true,
}));
