const { Response, BadRequest, serverError, NotFound } = require("../../util/helpers");
const ShiftPlan = require("../../models/shift_plan");

class ShiftPlanController {
  async list(req, res) {
    try {
      const { user } = req.payload;
      const list = await ShiftPlan.find({ company: user.company }).populate("user");
      return Response(res, { list });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async create(req, res) {
    console.log(req.body, "created trigger");
    try {
      const { user } = req.payload;
      const data = req.body;
      let insert = {
        shiftName: data.shiftName,
        shiftCode: data.shiftCode, 
        scheduleType: data.scheduleType,
        minStartTime: data.minStartTime,
        radioStatus: data.radioStatus,
        maxStartTime: data.maxStartTime,
        startTime: data.startTime,
        endTime: data.endTime,
        minEndTime: data.minEndTime,
        maxEndTime: data.maxEndTime,
        shiftEndNextDay: data.shiftEndNextDay,
        break: data.break,
        breakStartTime: data.breakStartTime,
        breakEndTime: data.breakEndTime,
        breakCountable: data.breakCountable,
        workingDays: data.workingDays,
        company: user.company._id,
        user: user._id,
      };
      let plan = await ShiftPlan.create(insert);
      plan = await ShiftPlan.findById(plan._id).populate("scheduleType");
      return Response(res, { plan });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async update(req, res) { 
    try {
      const { id } = req.params;
      const { user } = req.payload;
      const data = req.body;
      let Shift = await ShiftPlan.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!Shift) {
        return BadRequest(res, "notFound");
      }
      if (Shift)
        (Shift.shiftName = data.shiftName),
          (Shift.shiftCode = data.shiftCode), 
          (Shift.scheduleType = data.scheduleType),
          (Shift.minStartTime = data.minStartTime),
          (Shift.radioStatus = data.radioStatus),
          (Shift.maxStartTime = data.maxStartTime),
          (Shift.startTime = data.startTime),
          (Shift.endTime = data.endTime),
          (Shift.minEndTime = data.minEndTime),
          (Shift.maxEndTime = data.maxEndTime),
          (Shift.shiftEndNextDay = data.shiftEndsNextDay),
          (Shift.break = data.break),
          (Shift.breakStartTime = data.breakStartTime),
          (Shift.breakEndTime = data.breakEndTime),
          (Shift.breakCountable = data.breakCountable),
          (Shift.workingDays = data.workingDays),
          (Shift.company = user.company._id),
          (Shift.user = user._id),
          await Shift.save();
      return Response(res, { Shift });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      let exists = await ShiftPlan.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!exists) {
        return BadRequest(res, "notFound");
      }
      await ShiftPlan.deleteOne({
        _id: id,
        company: user.company._id,
      });
      return Response(res);
    } catch (error) {
      return serverError(res, error);
    }
  }
}

module.exports = new ShiftPlanController();
