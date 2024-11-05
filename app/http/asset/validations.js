const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {

    create: async (req, res, next) => {
        try {
            await Joi.object({
                assetType: Joi.string().required().messages({
                    'any.required': "Name is required",
                }),
                warrantyExpiry: Joi.date().required().messages({
                    'any.required': "Warranty expiry is required",
                }),
                purchaseDate: Joi.date().required().messages({
                    'any.required': "Purchase date is required",
                }),
                cost: Joi.number().required().messages({
                    'any.required': "Cost is required",
                }),
                vendor: Joi.string().required().messages({
                    'any.required': "Vendor is required",
                }),
                condition: Joi.number().optional().allow(1, 2, 3, 4, 5).messages({
                    'any.optional': "Condition is required",
                }),
                fields: Joi.any().optional().allow("", null),
                status: Joi.string().optional().allow('', null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    assignAsset: async (req, res, next) => {
        try {
            await Joi.object({
                assignDate: Joi.date().required().messages({
                    'any.required': "Assign date is required",
                }),
                assignTo: Joi.string().required().messages({
                    'any.required': "Assign to is required",
                }),
                remarks: Joi.string().required().messages({
                    'any.required': "Remarks is required",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    returnAsset: async (req, res, next) => {
        try {
            await Joi.object({
                returnDate: Joi.date().required().messages({
                    'any.required': "Return date is required",
                }),
                returnTo: Joi.string().required().messages({
                    'any.required': "Return to is required",
                }),
                remarks: Joi.string().required().messages({
                    'any.required': "Remarks is required",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            await Joi.object({
                status: Joi.string().required().messages({
                    'any.required': "Status is required",
                }),
                remarks: Joi.string().required().messages({
                    'any.required': "Remarks is required",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}