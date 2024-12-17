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
                effectiveDate: Joi.date().required().messages({
                    'any.required': "Effective date is required",
                }),
                lastWorkingDay: Joi.date().required().messages({
                    'any.required': "Last working day is required",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "Reason is required",
                }),
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
                effectiveDate: Joi.date().optional().allow("", null),
                lastWorkingDay: Joi.date().optional().allow("", null),
                reason: Joi.string().optional().allow("", null),
                remarks: Joi.string().optional().allow("", null),
                status: Joi.string().optional().allow("", null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}