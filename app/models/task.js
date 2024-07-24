const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("task", new Schema({
    name: { type: String },
    taskId:  { type: String },
    parent: { type: mongoose.Types.ObjectId, ref: 'task', default:null},
    description: { type: String },
    status: { type: String },
    requiredTime: { type: String },
    dueDate: { type: Date },
    priority: { type: String },
    assignedTo: { type: mongoose.Types.ObjectId, ref: 'user' },
    leader: { type: mongoose.Types.ObjectId, ref: 'user' },
    project: { type: mongoose.Types.ObjectId, ref: 'project' },
    board: { type: mongoose.Types.ObjectId, ref: 'task_board' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
