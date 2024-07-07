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
                sprintNumber: Joi.string().required().messages({
                    'any.required': "sprintNumberRequired",
                }),
                dueDate: Joi.date().required().messages({
                    'any.required': "endDateRequired",
                }),
                project: Joi.string().required().messages({
                    'any.required': "projectRequired",
                }),
                leads: Joi.array().required().messages({
                    'any.required': "leadsRequired",
                }),
                members: Joi.array().required().messages({
                    'any.required': "membersRequired",
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
                name: Joi.string().optional().allow("", null),
                sprintNumber: Joi.string().optional().allow("", null),
                dueDate: Joi.date().optional().allow("", null),
                leads: Joi.array().optional().allow("", null),
                members: Joi.array().optional().allow("", null),
                status: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}