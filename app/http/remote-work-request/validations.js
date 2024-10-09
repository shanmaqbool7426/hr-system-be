const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  create: async (req, res, next) => {
    try {
      await Joi.object({
        employee: Joi.string().required().messages({
          'any.required': "Employee is required",
        }),
        startDate: Joi.date().required().messages({
          'any.required': "Start date is required",
        }),
        endDate: Joi.date().optional().allow(null, ""),
        reason: Joi.string().required().messages({
          'any.required': "Reason is required",
        }),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  updateStatus: async (req, res, next) => {
    try {
      await Joi.object({
        status: Joi.string().required().messages({
          'any.required': "Status is required",
        }),
        reason: Joi.string().optional().allow(null),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  }
}
