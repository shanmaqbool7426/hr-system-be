const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
    create: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "Employee is required",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "Effective Date is required",
                }),
                validTill: Joi.date().optional().allow(null, ""),
                requestedShift: Joi.string().required().messages({
                    'any.required': "Requested Shift is required",
                }),
                reason: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },

}