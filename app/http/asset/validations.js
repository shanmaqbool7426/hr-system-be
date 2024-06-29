const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {

    create: async (req, res, next) => {
        try {
            await Joi.object({
                assetType: Joi.string().required().messages({
                    'any.required': "nameRequired",
                }),
                warrantyExpiry: Joi.date().required().messages({
                    'any.required': "warrantyExpiryRequired",
                }),
                purchaseDate: Joi.date().required().messages({
                    'any.required': "purchaseDateRequired",
                }),
                cost: Joi.number().required().messages({
                    'any.required': "costRequired",
                }),
                vendor: Joi.string().required().messages({
                    'any.required': "vendorRequired",
                }),
                fields: Joi.any().optional().allow("", null),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                assetType: Joi.string().required().messages({
                    'any.required': "nameRequired",
                }),
                warrantyExpiry: Joi.date().required().messages({
                    'any.required': "warrantyExpiryRequired",
                }),
                purchaseDate: Joi.date().required().messages({
                    'any.required': "purchaseDateRequired",
                }),
                cost: Joi.number().required().messages({
                    'any.required': "costRequired",
                }),
                vendor: Joi.string().required().messages({
                    'any.required': "vendorRequired",
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
                    'any.required': "assignDateRequired",
                }),
                assignTo: Joi.string().required().messages({
                    'any.required': "assignToRequired",
                }),
                remarks: Joi.string().required().messages({
                    'any.required': "remarksRequired",
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
                    'any.required': "returnDateRequired",
                }),
                returnTo: Joi.string().required().messages({
                    'any.required': "returnToRequired",
                }),
                remarks: Joi.string().required().messages({
                    'any.required': "remarksRequired",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}