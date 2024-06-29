const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("resetpassword", new Schema({
    email: { type: String },
    otp: { type: String },
}, {
    timestamps: true,
}));
