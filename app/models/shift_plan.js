const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shiftCode: {
    type: String,
  },
  shiftType: {
    type: String,
    enum: ['flexible', 'fixed'],
    required: true
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  minStartTime: {
    type: String,
  },
  maxStartTime: {
    type: String,
  },
  maxEndTime: {
    type: String,
  },
  shiftEndsOnNextDay: {
    type: Boolean,
    default: false
  },
  break: {
    type: Boolean,
    default: false
  },
  breakStartTime: {
    type: String,
  },
  breakEndTime: {
    type: String,
  },
  isBreakCountable: {
    type: Boolean,
    default: false
  },
  workingDays: {
    Monday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
    Tuesday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
    Wednesday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
    Thursday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
    Friday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
    Saturday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
    Sunday: {
      isWorkingDay: {
        type: Boolean,
        default: false
      },
      hours: String,
      startTime: String,
      endTime: String,
    },
  },
  company: { type: mongoose.Types.ObjectId, ref: 'company' },
  modifiedBy: { type: mongoose.Types.ObjectId, ref: 'user' },
})

schema.pre('save', async function (next) {
  const shiftPlan = this;
  const prefix = 'SF-';
  if (!shiftPlan.isNew) {
    return next();
  }
  try {
    const lastShiftPlan = await mongoose.model('shift_plan').findOne({ company: shiftPlan.company }).sort({ shiftCode: -1 });
    let newShiftCode;
    if (lastShiftPlan && lastShiftPlan.shiftCode) {
      const lastShiftNumber = parseInt(lastShiftPlan.shiftCode.replace(prefix, ''), 10);
      newShiftCode = `${prefix}${String(lastShiftNumber + 1).padStart(3, '0')}`;
    } else {
      newShiftCode = `${prefix}001`;
    }
    shiftPlan.shiftCode = newShiftCode;
    next();
  } catch (error) {
    next(error);
  }
})
const shift_plan = mongoose.model('shift_plan', schema);
module.exports = shift_plan;