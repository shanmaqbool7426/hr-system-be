const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  create: async (req, res, next) => {
    try {
      await Joi.object({
        title: Joi.string().required().messages({
          'any.required': "Title is required",
        }),
        description: Joi.string().required().messages({
          'any.required': "Description is required",
        }),
        type: Joi.string().required().messages({
          'any.required': "Type is required",
        }),
        priority: Joi.string().required().messages({
          'any.required': "Priority is required",
        }),
        attachment: Joi.string().optional().allow("", null),
        asset: Joi.string().optional().allow("", null)
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },


}
