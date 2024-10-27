const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_user_process", new Schema({
  title: { type: String },
  time_spent: { type: Number }, // in seconds
  application: { type: mongoose.Types.ObjectId, ref: 'remote_application' },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
