const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {

    create: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().required().messages({
                    'any.required': "nameRequired",
                }),
                entitled: Joi.number().required().messages({
                    'any.required': "entitledRequired",
                }),
                encashable: Joi.boolean().required().messages({
                    'any.required': "encashableRequired",
                }),
                carryForward: Joi.boolean().required().messages({
                    'any.required': "carryForwardRequired",
                }),
                entitledToStatus: Joi.array().required().messages({
                    'any.required': "entitledToStatusRequired",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}