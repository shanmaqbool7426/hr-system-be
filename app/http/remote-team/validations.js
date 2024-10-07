const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  create: async (req, res, next) => {
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


}
