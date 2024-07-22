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
                status: Joi.string().required().messages({
                    'any.required': "statusRequired",
                }),
                priority: Joi.string().required().messages({
                    'any.required': "priorityRequired",
                }),
                subTask: Joi.string().required().messages({
                    'any.required': "subTaskRequired",
                }),
                description: Joi.string().required().messages({
                    'any.required': "descriptionRequired",
                }),
                requiredTime: Joi.string().required().messages({
                    'any.required': "requiredTimeRequired",
                }),
                assignedTo: Joi.string().required().messages({
                    'any.required': "assignedToRequired",
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
                description: Joi.string().optional().allow("", null),
                priority: Joi.string().optional().allow("", null),
                requiredTime: Joi.string().optional().allow("", null),
                dueDate: Joi.date().optional().allow("", null),
                assignedTo: Joi.array().optional().allow("", null),
                status: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}