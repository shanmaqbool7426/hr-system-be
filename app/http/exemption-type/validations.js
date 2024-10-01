const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {

    create: async (req, res, next) => {
        try {
            await Joi.object({
                title: Joi.string().required().messages({
                    'any.required': "Title is required",
                }),
                minHours: Joi.number().required().messages({
                    'any.required': "Minimum hours is required",
                })
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}