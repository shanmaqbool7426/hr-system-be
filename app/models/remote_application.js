const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("remote_application", new Schema({
  name: { type: String },
  url: { type: String },
  nature: {
    type: String,
    enum: ['productive', 'neutral', 'unproductive'],
    default: "unproductive"
  },
  category: { type: mongoose.Types.ObjectId, ref: 'remote_category', default: null },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
}, {
  timestamps: true,
}));
