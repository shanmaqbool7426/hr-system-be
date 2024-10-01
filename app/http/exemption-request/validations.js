const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {
    create: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "Employee is required",
                }),
                date: Joi.date().required().messages({
                    'any.required': "Date is required",
                }),
                exemptionType: Joi.string().required().messages({
                    'any.required': "Exemption type is required",
                }),
                reason: Joi.string().optional().allow("", null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().optional().allow("", null),
                date: Joi.date().optional().allow("", null),
                exemptionType: Joi.string().optional().allow("", null),
                reason: Joi.string().optional().allow("", null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}