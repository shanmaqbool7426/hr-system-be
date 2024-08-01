const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
    create: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().required().messages({
                    'any.required': "nameRequired",
                }),
                member: Joi.array().required().messages({
                    'any.required': "memberRequired",
                }),
                rating: Joi.number().required().messages({
                    'any.required': "ratingRequired",
                }),
                comments: Joi.string().required().messages({
                    'any.required': "commentsRequired",
                }),
                feedbackReply: Joi.string().optional().allow(null,""),
                task: Joi.string().optional().allow(null, ""),
                project: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                name: Joi.string().optional().allow(null, ""),
                member:Joi.string().optional().allow(null, ""),
                rating: Joi.string().optional().allow(null, ""),
                comments: Joi.string().optional().allow(null, ""),
                feedbackReply:  Joi.string().required().messages({
                    'any.required': "feedbackReplyRequired",
                }),
                task: Joi.string().optional().allow(null, ""),
                project: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },
};
