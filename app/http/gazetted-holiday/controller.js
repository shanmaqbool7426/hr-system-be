const { Response, BadRequest, serverError } = require("../../util/helpers");
const Holiday = require("../../models/gazetted_holiday");
class GazettedHolidayController {
  async list(req, res) {
    try {
      const { user } = req.payload;
      let list = await Holiday.find({ company: user.company._id }).populate(
        "exemptedEmployees"
      );
      return Response(res, { list });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async create(req, res) {
    try {
      const data = req.body;
      const { user } = req.payload;

      let insert = {
        title: data.title,
        date: data.date,
        country: data.country,
        province: data.province,
        city: data.city,
        area: data.area,
        station: data.station,
        grade: data.grade,
        exemptedEmployees: data.exemptedEmployees,
        description: data.description,
        sendEmail: data.sendEmail,
        recursive: data.recursive,
        company: user.company._id,
        modifiedBy: user._id,
      };

      let holiday = await Holiday.create(insert);
      holiday = await Holiday.findById(holiday._id).populate(
        "exemptedEmployees"
      );
      return Response(res, { holiday });
    } catch (error) {
      return serverError(res, error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      const data = req.body;

      let holiday = await Holiday.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!holiday) {
        return BadRequest(res, "notFound");
      }
      holiday.title = data.title;
      holiday.date = data.date;
      holiday.country = data.country;
      holiday.province = data.province;
      holiday.city = data.city;
      holiday.area = data.area;
      holiday.station = data.station;
      holiday.grade = data.grade;
      holiday.exemptedEmployees = data.exemptedEmployees;
      holiday.sendEmail = data.sendEmail;
      holiday.description = data.description;
      holiday.recursive = data.recursive;

      await holiday.save();
      holiday = await Holiday.findById(holiday._id).populate(
        "exemptedEmployees"
      );
      return Response(res, { holiday });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.payload;
      let exists = await Holiday.findOne({
        _id: id,
        company: user.company._id,
      });
      if (!exists) {
        return BadRequest(res, "notFound");
      }
      await Holiday.deleteOne({
        _id: id,
        company: user.company._id,
      });
      return Response(res);
    } catch (error) {
      return serverError(res, error);
    }
  }
}
module.exports = new GazettedHolidayController();
