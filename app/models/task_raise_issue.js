const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("task_raise_issue", new Schema({
    name: { type: String },
    description: { type: String },
    task: { type: mongoose.Types.ObjectId, ref: 'task'},
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
