const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("task_board", new Schema({
    name: { type: String },
    status: { type: String, default: "open" },
    dueDate: { type: Date },
    sprintNumber: { type: String },
    leads: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    project: { type: mongoose.Types.ObjectId, ref: 'project' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
