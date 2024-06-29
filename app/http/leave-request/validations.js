const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {

    create: async (req, res, next) => {
        try {
            await Joi.object({
                duration: Joi.number().required().messages({
                    'any.required': "durationRequired",
                }),
                formDate: Joi.date().required().messages({
                    'any.required': "formDateRequired",
                }),
                toDate: Joi.date().required().messages({
                    'any.required': "toDateRequired",
                }),
                status: Joi.string().required().messages({
                    'any.required': "statusRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                attachment: Joi.object().required().messages({
                    'any.required': "attachmentRequired",
                }),
                leave: Joi.string().required().messages({
                    'any.required': "leaveRequired",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}