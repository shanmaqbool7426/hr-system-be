const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "shift_flag",
  new Schema(
    {
      name: { type: String },
      deduction: { type: Number },
      company: { type: mongoose.Types.ObjectId, ref: "company" },
      modifiedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    },
    {
      timestamps: true,
    }
  )
);
