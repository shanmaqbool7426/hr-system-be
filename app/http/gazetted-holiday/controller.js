const { Response, BadRequest, serverError } = require("../../util/helpers");
const Holiday = require("../../models/gazetted_holiday");
const moment = require('moment')
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
        fromDate: moment(data.fromDate).utc().format(),
        toDate: moment(data.toDate).utc().format(),
        countries: data.countries,
        provinces: data.provinces,
        cities: data.cities,
        areas: data.areas,
        stations: data.stations,
        grades: data.grades,
        exemptedEmployees: data.exemptedEmployees,
        description: data.description,
        recursive: data.recursive || false,
        company: user.company._id,
        modifiedBy: user._id,
      };
      if (data?.sendEmail) {
        // TODO : notify all the relevent employees 
      }

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
      
      if (data?.title) holiday.title = data.title;
      if (data?.fromDate) holiday.fromDate = moment(data.fromDate).utc().format();
      if (data?.toDate) holiday.toDate = moment(data.toDate).utc().format();
      if (data?.countries) holiday.countries = data.countries;
      if (data?.provinces) holiday.provinces = data.provinces;
      if (data?.citeis) holiday.citeis = data.citeis;
      if (data?.areas) holiday.areas = data.areas;
      if (data?.stations) holiday.stations = data.stations;
      if (data?.grades) holiday.grades = data.grades;
      if (data?.exemptedEmployees) holiday.exemptedEmployees = data.exemptedEmployees;

      if (data?.description) holiday.description = data.description;
      if (data?.recursive) holiday.recursive = data.recursive;

      if (data?.sendEmail) {
        // TODO : notify all the relevent employees 
      }
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
