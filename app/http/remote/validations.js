const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  syncRemoteData: async (req, res, next) => {
    try {
      await Joi.object({
        process: Joi.array().items(Joi.object({
          name: Joi.string().required(),
          time_spent: Joi.number().required()
        })).optional().allow(null),
        screenshots: Joi.array().items(Joi.object({
          url: Joi.string().required(),
          process_name: Joi.string().required(),
          taken_at: Joi.date().required()
        })).optional().allow(null),
        checkInAt: Joi.date().optional().allow(null),
        checkOutAt: Joi.date().optional().allow(null),
        idleIntervals: Joi.array().items(Joi.object({
          start_at: Joi.date().required(),
          end_at: Joi.date().required()
        })).optional().allow(null),
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
