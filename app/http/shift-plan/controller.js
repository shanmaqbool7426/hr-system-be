const { Response, BadRequest, serverError, NotFound } = require("../../util/helpers");
const ShiftPlan = require("../../models/shift_plan");
const { USER_FIELDS } = require('../../util/config')
class ShiftPlanController {
  async #getShift(id) {
    return await ShiftPlan.findById(id)
      .populate("modifiedBy", USER_FIELDS);
  }

  async list(req, res) {
    try {
      const { user } = req.payload;
      const list = await ShiftPlan.find({ company: user.company })
        .populate("modifiedBy", USER_FIELDS);
      return Response(res, { list });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body;
      let insert = {
        name: data.name,
        shiftType: data.shiftType,
        workingDays: data.workingDays,
        shiftEndsOnNextDay: data.shiftEndsOnNextDay,
        breakStartTime: data.breakStartTime,
        breakEndTime: data.breakEndTime,
        isBreakCountable: data.isBreakCountable,
        company: user.company._id,
        modifiedBy: user._id,
      };
      if (data?.startTime) insert.startTime = data.startTime
      if (data?.endTime) insert.endTime = data.endTime
      if (data?.minStartTime) insert.minStartTime = data.minStartTime
      if (data?.maxStartTime) insert.maxStartTime = data.maxStartTime
      if (data?.maxEndTime) insert.maxEndTime = data.maxEndTime

      let shift = await ShiftPlan.create(insert);
      shift = this.#getShift(shift._id)
      return Response(res, { shift });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      const data = req.body;
      let shift = await ShiftPlan.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!shift) {
        return BadRequest(res);
      }
      shift.modifiedBy = user._id
      if (data.name) shift.name = data.name
      if (data.shiftType) shift.shiftType = data.shiftType
      if (data.workingDays) shift.workingDays = data.workingDays
      if (data.breakStartTime) shift.breakStartTime = data.breakStartTime
      if (data.breakEndTime) shift.breakEndTime = data.breakEndTime
      if (Object.keys(data).includes('shiftEndsOnNextDay')) shift.shiftEndsOnNextDay = data.shiftEndsOnNextDay
      if (Object.keys(data).includes('isBreakCountable')) shift.isBreakCountable = data.isBreakCountable
      if (data?.startTime) shift.startTime = data.startTime
      if (data?.endTime) shift.endTime = data.endTime
      if (data?.minStartTime) shift.minStartTime = data.minStartTime
      if (data?.maxStartTime) shift.maxStartTime = data.maxStartTime
      if (data?.maxEndTime) shift.maxEndTime = data.maxEndTime


      await shift.save();
      shift = this.#getShift(shift._id)
      return Response(res, { shift });
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
        return BadRequest(res);
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
