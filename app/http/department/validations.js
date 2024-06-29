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
                code: Joi.string().required().messages({
                    'any.required': "codeRequired",
                }),
                head: Joi.string().optional().allow(null, ""),
                parent: Joi.string().optional().allow(null, ""),
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
                code: Joi.string().required().messages({
                    'any.required': "codeRequired",
                }),
                head: Joi.string().optional().allow(null, ""),
                parent: Joi.string().optional().allow(null, ""),
                status: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}