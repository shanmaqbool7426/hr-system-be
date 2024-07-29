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
                parent: Joi.string().optional().allow(null,""),
                priority: Joi.string().required().messages({
                    'any.required': "priorityRequired",
                }),
                status : Joi.string().optional().allow(null,""),
                description: Joi.string().required().messages({
                    'any.required': "descriptionRequired",
                }),
                requiredTime: Joi.string().required().messages({
                    'any.required': "requiredTimeRequired",
                }),
                assignedTo: Joi.string().required().messages({
                    'any.required': "assignedToRequired",
                }),
                lead: Joi.string().required().messages({
                    'any.required': "leadRequired",
                }),
                board: Joi.string().required().messages({
                    'any.required': "boardRequired",
                }),
                project: Joi.string().required().messages({
                    'any.required': "projectRequired",
                }),
                dueDate: Joi.date().required().messages({
                    'any.required': "dueDateRequired",
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
                parent : Joi.string().optional().allow(null, ""),
                description: Joi.string().optional().allow("", null),
                priority: Joi.string().optional().allow("", null),
                requiredTime: Joi.string().optional().allow("", null),
                dueDate: Joi.date().optional().allow("", null),
                assignedTo: Joi.string().optional().allow("", null),
                lead: Joi.string().optional().allow("", null),
                status: Joi.string().optional().allow(null, ""),
                board: Joi.string().optional().allow(null, ""),
                project :Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}