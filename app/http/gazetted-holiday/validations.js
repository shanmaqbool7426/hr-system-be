const Joi = require("joi");
const { BadRequest } = require("../../util/helpers");

module.exports = {
  create: async (req, res, next) => {
    try {
      await Joi.object({
        title: Joi.string().required().messages({
          "any.required": "titleRequired",
        }),
        fromDate: Joi.date().required().messages({
          "any.required": "fromDateRequired",
        }),
        toDate: Joi.date().required().messages({
          "any.required": "toDateRequired",
        }),
        countries: Joi.array().required().messages({
          "any.required": "countryRequired",
        }),
        provinces: Joi.array().required().messages({
          "any.required": "provinceRequired",
        }),
        cities: Joi.array().required().messages({
          "any.required": "cityRequired",
        }),
        areas: Joi.array().required().messages({
          "any.required": "areaRequired",
        }),
        stations: Joi.array().required().messages({
          "any.required": "stationRequired",
        }),
        grades: Joi.array().required().messages({
          "any.required": "gradeRequired",
        }),
        exemptedEmployees: Joi.array().optional().allow(null),
        description: Joi.string().required().messages({
          "any.required": "descriptionRequired",
        }),
        sendEmail: Joi.boolean().optional().allow("", null),
        recursive: Joi.boolean().optional().allow("", null),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message);
    }
  },
};
