const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model(
  "gazetted_holiday",
  new Schema(
    {
      title: { type: String, required: true },
      fromDate: { type: Date },
      toDate: { type: Date },
      countries: [{ type: mongoose.Types.ObjectId, ref: "custom_field" }],
      provinces: [{ type: mongoose.Types.ObjectId, ref: "custom_field" }],
      cities: [{ type: mongoose.Types.ObjectId, ref: "custom_field" }],
      areas: [{ type: mongoose.Types.ObjectId, ref: "custom_field" }],
      stations: [{ type: mongoose.Types.ObjectId, ref: "custom_field" }],
      grades: [{ type: mongoose.Types.ObjectId, ref: "custom_field" }],
      exemptedEmployees: [{ type: mongoose.Types.ObjectId, ref: "user" }],
      description: { type: String },
      recursive: { type: Boolean, default: false },
      company: { type: mongoose.Types.ObjectId, ref: "company" },
      modifiedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    },
    {
      timestamps: true,
    }
  )
);
