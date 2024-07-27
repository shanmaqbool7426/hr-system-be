const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workingDaySchema = new Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  from: {
    type: String,
    required: function () {
      return this.scheduleType === "Clock Based";
    },
  },
  to: {
    type: String,
    required: function () {
      return this.scheduleType === "Clock Based";
    },
  },
  workingHours: {
    type: String,
    required: function () {
      return this.scheduleType === "Flexible";
    },
  },
  enabled: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "shift_plan",
  new Schema(
    {
      shiftName: { type: String, required: true },
      shiftCode: { type: String },
      workingHours: { type: String },
      scheduleType: {
        type: String,
        enum: ["Flexible", "Clock Based"],
        required: true,
      },
      minStartTime: {
        type: String,
        required: function () {
          return this.scheduleType === "Flexible" || "Clock Based";
        },
      },
      maxStartTime: {
        type: String,
        required: function () {
          return this.scheduleType === "Flexible";
        },
      },
      startTime: {
        type: String,
        required: function () {
          return this.scheduleType === "Clock Based";
        },
      },
      endTime: {
        type: String,
        required: function () {
          return this.scheduleType === "Clock Based";
        },
      },
      maxEndTime: {
        type: String,
        required: function () {
          return this.scheduleType === "Clock Based";
        },
      },
      shiftEndsNextDay: { type: Boolean, default: false },
      breakEnabled: { type: Boolean, default: false },
      breakStartTime: { type: String },
      breakEndTime: { type: String },
      workingDays: [workingDaySchema],
      company: { type: mongoose.Types.ObjectId, ref: "company" },
      user: { type: mongoose.Types.ObjectId, ref: "user" },
    },
    {
      timestamps: true,
    }
  )
);
