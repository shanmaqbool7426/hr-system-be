const {
  Response,
  BadRequest,
  serverError,
  NotFound,
} = require("../../util/helpers");
const ShiftFlag = require("../../models/shift_flag");

class ShiftFlagController {
  async list(req, res) {
    try {
      const { user } = req.payload;
      const list = await ShiftFlag.find({ company: user.company._id }).populate(
        "modifiedBy",
        "_id firstName lastName email avatar employeeCode"
      );

      return Response(res, { list });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body;

      let flag = await ShiftFlag.create({
        name: data.name,
        deduction: data.deduction,
        company: user.company._id,
        modifiedBy: user._id,
      });
      flag = await ShiftFlag.findById(flag._id).populate(
        "modifiedBy",
        "_id firstName lastName email avatar employeeCode"
      );
      return Response(res, { flag });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      const data = req.body;

      let flag = await ShiftFlag.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!flag) {
        return BadRequest(res, "shiftFlagNotFound");
      }

      flag.name = data.name;
      flag.deduction = data.deduction;
      flag.modifiedBy = user._id;
      await flag.save();
      flag = await ShiftFlag.findById(flag._id).populate(
        "modifiedBy",
        "_id firstName lastName email avatar employeeCode"
      );
      return Response(res, { flag });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;

      let flag = await ShiftFlag.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!flag) {
        return NotFound(res, "shiftFlagNotFound");
      }

      await ShiftFlag.deleteOne({ _id: id, company: user.company._id });
      return Response(res);
    } catch (error) {
      return serverError(res, error);
    }
  }
}

module.exports = new ShiftFlagController();
