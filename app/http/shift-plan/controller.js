const {
  Response,
  BadRequest,
  serverError,
  NotFound,
} = require("../../util/helpers");
const ShiftPlan = require("../../models/shift_plan");

class ShiftPlanController {
  async list(req, res) {}

  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body;

      let insert = {
        shiftName: data.shiftName,
        shiftCode: data.shiftCode,
        workingHours: data.workingHours,
        scheduleType: data.scheduleType,
        minStartTime: data.minStartTime,
        maxStartTime: data.maxStartTime,
        startTime: data.startTime,
        endTime: data.endTime,
        minEndTime: data.minEndTime,
        maxEndTime: data.maxEndTime,
        shiftEndsNextDay: data.shiftEndsNextDay,
        breakEnabled: data.breakEnabled,
        breakStartTime: data.breakStartTime,
        breakEndTime: data.breakEndTime,
        workingDays: data.workingDays,
        company: data.company,
        user: user._id,
      };
      let plan = await ShiftPlan.create(insert);
      plan = await ShiftPlan.findById(plan._id).populate("workingDays");
      return Response(res, { plan });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async update(req, res) {}

  async delete(req, res) {}
}

module.exports = new ShiftPlanController();
