const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("company", new Schema({
    name: { type: String },
    currentEmployeeCode: { type: String, default: '100001' }
}, {
    timestamps: true,
}));
