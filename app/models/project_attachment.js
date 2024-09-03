const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("project_attachment", new Schema({
    name: { type: String },
    link: { type: String },
    size: { type: Number },
    project: { type: mongoose.Types.ObjectId, ref: 'project' },
    company: { type: mongoose.Types.ObjectId, ref: 'company' },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
    timestamps: true,
}));
