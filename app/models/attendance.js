const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("attendance", new Schema({
    checkInAt: { type: Date },
    checkOutAt: { type: Date },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
