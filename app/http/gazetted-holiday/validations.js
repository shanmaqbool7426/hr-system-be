const Joi = require("joi");
const { BadRequest } = require("../../util/helpers");

module.exports = {
  create: async (req, res, next) => {
    try {
      await Joi.object({
        title: Joi.string().required().messages({
          "any.required": "titleRequired",
        }),
        date: Joi.date().required().messages({
          "any.required": "dateRequired",
        }),
        country: Joi.string().required().messages({
          "any.required": "countryRequired",
        }),
        province: Joi.string().required().messages({
          "any.required": "provinceRequired",
        }),
        city: Joi.string().required().messages({
          "any.required": "cityRequired",
        }),
        area: Joi.string().required().messages({
          "any.required": "areaRequired",
        }),
        station: Joi.string().required().messages({
          "any.required": "stationRequired",
        }),
        grade: Joi.string().required().messages({
          "any.required": "gradeRequired",
        }),
        exemptedEmployees: Joi.array().required().messages({
          "any.required": "exemptedEmployeesRequired",
        }),
        description: Joi.string().required().messages({
          "any.required": "descriptionRequired",
        }),
        sendEmail: Joi.boolean().required().messages({
          "any.required": "sendEmailRequired",
        }),
        recursive: Joi.boolean().required().messages({
          "any.required": "recursiveRequired",
        }),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message);
    }
  },
};
