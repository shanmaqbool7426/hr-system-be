const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  update: async (req, res, next) => {
    try {
      await Joi.object({
        ids: Joi.array().items(Joi.string()).required(),
        category: Joi.string().optional().allow(null, ""),
        nature: Joi.string().optional().allow(null, ""),
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
}
