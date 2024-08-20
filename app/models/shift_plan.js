const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workingDaySchema = new Schema({
  day: {
    type: String,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    required: function(){
      return this.radioStatus === "clockBased";
    },
  },
  from: {
    type: String,
    required: function () {
      return this.radioStatus === "clockBased";
    },
  },
  to: {
    type: String,
    required: function () {
      return this.radioStatus === "clockBased";
    },
  },
  hours: {
    type: String,
    required: function () {
      return this.radioStatus === "flexibleSchedule";
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
      radioStatus: {
        type: String,
        enum: ["flexibleSchedule", "clockBased"],
        required: true,
      },
      minStartTime: {
        type: String,
        required: true,
      },
      maxStartTime: {
        type: String,
        required: function () {
          return this.radioStatus === "flexibleSchedule";
        },
      },
      startTime: {
        type: String,
        required: function () {
          return this.radioStatus === "clockBased";
        },
      },
      endTime: {
        type: String,
        required: function () {
          return this.radioStatus === "clockBased";
        },
      },
      maxEndTime: {
        type: String,
        required: function () {
          return this.radioStatus === "clockBased";
        },
      },
      shiftEndNextDay: { type: Boolean, default: false },
      break: { type: Boolean, default: false },
      breakCountable: { type: Boolean, default: false },
      breakStartTime: { type: String },
      breakEndTime: { type: String }, 
      company: { type: mongoose.Types.ObjectId, ref: "company" },
      user: { type: mongoose.Types.ObjectId, ref: "user" },
      scheduleType:[workingDaySchema]
    },
    {
      timestamps: true,
    }
  )
);
