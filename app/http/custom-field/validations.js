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
                type: Joi.string().required().messages({
                    'any.required': "typeRequired",
                }),
                icon: Joi.string().optional().allow('', null),
                prefix: Joi.string().optional().allow('', null),
                fields: Joi.array().optional().allow('', null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().required().messages({
                    'any.required': "nameRequired",
                }),
                type: Joi.string().optional().allow('', null),
                icon: Joi.string().optional().allow('', null),
                prefix: Joi.string().optional().allow('', null),
                fields: Joi.array().optional().allow('', null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },

}