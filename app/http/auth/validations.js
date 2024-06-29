const Joi = require("joi");
const User = require("../../models/user");
const { BadRequest } = require('../../util/helpers');

module.exports = {

    signin: async (req, res, next) => {
        try {
            await Joi.object({
                email: Joi.string().email().required().messages({
                    'any.required': "emailRequired",
                    'string.email': 'invalidEmail'
                }),
                password: Joi.string().required().messages({
                    'any.required': "passwordRequired"
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            await Joi.object({
                email: Joi.string().email().required().messages({
                    'any.required': "emailRequired",
                    'string.email': 'invalidEmail'
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },

    verifyOTP: async (req, res, next) => {
        try {
            await Joi.object({
                email: Joi.string().email().required().messages({
                    'any.required': "emailRequired",
                    'string.email': 'invalidEmail'
                }),
                otp: Joi.string().required().messages({
                    'any.required': "otpRequired",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            await Joi.object({
                email: Joi.string().email().required().messages({
                    'any.required': "emailRequired",
                    'string.email': 'invalidEmail'
                }),
                otp: Joi.string().required().messages({
                    'any.required': "otpRequired",
                }),
                password: Joi.string().required().messages({
                    'any.required': "passwordRequired",
                }),
                confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
                    'any.only': "confirmPasswordMismatch",
                    'any.required': "confirmPasswordRequired",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },

}