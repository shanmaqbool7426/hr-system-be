const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
    create: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'any.required': "Name is required",
            }),
            shiftType: Joi.string().required().messages({
                'any.required': "Shift Type is required",
            }),
            workingDays: Joi.any().required().messages({
                'any.required': "Working Days are required",
            }),
            shiftEndsOnNextDay: Joi.boolean().required().messages({
                'any.required': "Shift Ends On Next Day is required",
            }),
            break: Joi.boolean().allow(null, ''),
            breakStartTime: Joi.string().allow(null, '').messages({
                'string.base': "Break Start Time must be a string"
            }),
            breakEndTime: Joi.string().allow(null, '').messages({
                'string.base': "Break End Time must be a string"
            }),
            isBreakCountable: Joi.boolean().required().messages({
                'any.required': "Is Break Countable is required",
            }),
            startTime: Joi.string().allow(null, '').messages({
                'string.base': "Start Time must be a string"
            }),
            endTime: Joi.string().allow(null, '').messages({
                'string.base': "End Time must be a string"
            }),
            minStartTime: Joi.string().allow(null, '').messages({
                'string.base': "Minimum Start Time must be a string"
            }),
            maxStartTime: Joi.string().allow(null, '').messages({
                'string.base': "Maximum Start Time must be a string"
            }),
            maxEndTime: Joi.string().allow(null, '').messages({
                'string.base': "Maximum End Time must be a string"
            }),
        });
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },
    update: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().messages({
                'string.base': "Name must be a string",
            }),
            shiftType: Joi.string().messages({
                'string.base': "Shift Type must be a string",
                'string.empty': "Shift Type cannot be empty"
            }),
            workingDays: Joi.array().items(Joi.string()).messages({
                'array.base': "Working Days must be an array"
            }),
            shiftEndsOnNextDay: Joi.boolean().messages({
                'boolean.base': "Shift Ends On Next Day must be a boolean"
            }),
            break: Joi.boolean().allow(null, ''),
            breakStartTime: Joi.string().allow(null, '').messages({
                'string.base': "Break Start Time must be a string"
            }),
            breakEndTime: Joi.string().allow(null, '').messages({
                'string.base': "Break End Time must be a string"
            }),
            isBreakCountable: Joi.boolean().messages({
                'boolean.base': "Is Break Countable must be a boolean"
            }),
            startTime: Joi.string().allow(null, '').messages({
                'string.base': "Start Time must be a string"
            }),
            endTime: Joi.string().allow(null, '').messages({
                'string.base': "End Time must be a string"
            }),
            minStartTime: Joi.string().allow(null, '').messages({
                'string.base': "Minimum Start Time must be a string"
            }),
            maxStartTime: Joi.string().allow(null, '').messages({
                'string.base': "Maximum Start Time must be a string"
            }),
            maxEndTime: Joi.string().allow(null, '').messages({
                'string.base': "Maximum End Time must be a string"
            }),
        });

        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },
};
