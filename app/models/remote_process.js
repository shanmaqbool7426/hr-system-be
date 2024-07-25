const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_process", new Schema({
  name: { type: String },
  nature: {
    type: String,
    enum: ['productive', 'neutral', 'unproductive'],
    default: "unproductive"
  },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
  timestamps: true,
}));
