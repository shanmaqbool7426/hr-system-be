const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("offboarding", new Schema({
    employee: { type: mongoose.Types.ObjectId, ref: 'user', required: true, unique: true },
    completedTasks: [{ type: mongoose.Types.ObjectId, ref: 'offboarding_task' }],
    isCompleted: { type: Boolean, default: false },
    company: { type: mongoose.Types.ObjectId, ref: 'company', required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
}, {
    timestamps: true,
}));
