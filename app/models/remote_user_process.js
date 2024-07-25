const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_user_process", new Schema({
  time_spent: { type: Number }, // in seconds
  process: { type: mongoose.Types.ObjectId, ref: 'remote_process' },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
}, {
  timestamps: true,
}));
