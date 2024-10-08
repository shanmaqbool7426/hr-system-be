const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  syncRemoteData: async (req, res, next) => {
    try {
      await Joi.object({
        process: Joi.array().optional().allow(null),
        screenshots: Joi.array().optional().allow(null),
        checkInAt: Joi.date().optional().allow(null),
        checkOutAt: Joi.date().optional().allow(null),
        idleIntervals: Joi.array().optional().allow(null),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  processStats: async (req, res, next) => {
    try {
      await Joi.object({
        process: Joi.array().required().messages({
          'any.required': "proccessRequired",
        }),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  screenshots: async (req, res, next) => {
    try {
      await Joi.object({
        urls: Joi.array().required().messages({
          'any.required': "urlsRequired",
        }),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },

}
