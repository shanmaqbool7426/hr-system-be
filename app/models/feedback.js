const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("feedback", new Schema({
    name: { type: String },
    member :  [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    rating: { type: Number },
    comments: { type: String },
    feedbackReply: { type: String },
    task: { type: mongoose.Types.ObjectId, ref: 'task'},
    project: { type: mongoose.Types.ObjectId, ref: 'project' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
