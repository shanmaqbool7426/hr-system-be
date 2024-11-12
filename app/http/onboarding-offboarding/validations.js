const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  createTask: async (req, res, next) => {
    try {
      await Joi.object({
        name: Joi.string().required().messages({
          'any.required': "Name is required",
        }),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  updateTask: async (req, res, next) => {
    try {
      await Joi.object({
        name: Joi.string().optional().allow('', null),
        active: Joi.boolean().optional().allow('', null),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  }

}
