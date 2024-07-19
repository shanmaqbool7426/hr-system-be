const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
    create: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().required().messages({
                    'any.required': "nameRequired",
                }),
                client: Joi.string().required().messages({
                    'any.required': "clientRequired",
                }),
                priority: Joi.string().required().messages({
                    'any.required': "priorityRequired",
                }),
                description: Joi.string().required().messages({
                    'any.required': "descriptionRequired",
                }),
                startDate: Joi.date().required().messages({
                    'any.required': "startDateRequired",
                }),
                endDate: Joi.date().required().messages({
                    'any.required': "endDateRequired",
                }),
                payment: Joi.number().optional().allow("", null),
                paymentCycle: Joi.string().optional().allow("", null),
                leads: Joi.array().required().messages({
                    'any.required': "leadsRequired",
                }),
                members: Joi.array().required().messages({
                    'any.required': "membersRequired",
                }),
                status: Joi.string().optional().allow(null, ""),
                attachments: Joi.array().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().optional().allow("", null),
                client: Joi.string().optional().allow("", null),
                priority: Joi.string().optional().allow("", null),
                description: Joi.string().optional().allow("", null),
                startDate: Joi.date().optional().allow("", null),
                endDate: Joi.date().optional().allow("", null),
                payment: Joi.number().optional().allow("", null),
                paymentCycle: Joi.string().optional().allow("", null),
                leads: Joi.array().optional().allow("", null),
                members: Joi.array().optional().allow("", null),
                attachments: Joi.array().allow(null, ""),
                status: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}