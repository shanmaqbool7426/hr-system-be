const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("project", new Schema({
    projectId: { type: String, index: true },
    name: { type: String },
    client: { type: String },
    priority: { type: String },
    description: { type: String },
    status: { type: String, default: "new" },
    startDate: { type: Date },
    endDate: { type: Date },
    payment: { type: Number },
    paymentCycle: { type: String },
    leads: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    members: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    boards: [{ type: mongoose.Types.ObjectId, ref: 'task_board' }],
    attachments: [{ type: String }],
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
