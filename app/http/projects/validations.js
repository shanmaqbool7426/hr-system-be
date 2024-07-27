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
                payment: Joi.number().optional().empty(""),
                paymentCycle: Joi.string().optional().empty(""),
                leads: Joi.array().required().messages({
                    'any.required': "leadsRequired",
                }),
                members: Joi.array().required().messages({
                    'any.required': "membersRequired",
                }),
                status: Joi.string().optional().allow(null, ""),
                // attachments: Joi.array().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().optional().empty(""),
                client: Joi.string().optional().empty(""),
                priority: Joi.string().optional().empty(""),
                description: Joi.string().optional().empty(""),
                startDate: Joi.date().optional().empty(""),
                endDate: Joi.date().optional().empty(""),
                payment: Joi.number().optional().empty(""),
                paymentCycle: Joi.string().optional().empty(""),
                leads: Joi.array().optional().empty(""),
                members: Joi.array().optional().empty(""),
                // attachments: Joi.array().optional().empty([]).items(Joi.object({
                //     filename: Joi.string().optional().empty(""),
                //     file: Joi.binary().optional().empty("")
                // })),
                status: Joi.string().optional().empty(""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },

};
