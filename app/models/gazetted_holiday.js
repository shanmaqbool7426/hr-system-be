const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "gazetted_holiday",
  new Schema(
    {
      title: { type: String, required: true },
      date: { type: Date },
      country: { type: mongoose.Types.ObjectId, ref: "custom_field" },
      province: { type: mongoose.Types.ObjectId, ref: "custom_field" },
      city: { type: mongoose.Types.ObjectId, ref: "custom_field" },
      area: { type: mongoose.Types.ObjectId, ref: "custom_field" },
      station: { type: mongoose.Types.ObjectId, ref: "custom_field" },
      grade: { type: mongoose.Types.ObjectId, ref: "custom_field" },
      exemptedEmployees: [{ type: mongoose.Types.ObjectId, ref: "user" }],
      description: { type: String },
      sendEmail: { type: Boolean, default: false },
      recursive: { type: Boolean, default: false },
      company: { type: mongoose.Types.ObjectId, ref: "company" },
      modifiedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    },
    {
      timestamps: true,
    }
  )
);
