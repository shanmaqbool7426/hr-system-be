const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
    create: async (req, res, next) => {
        try {
            await Joi.object({
                ipAddress: Joi.string().required().messages({
                    'any.required': "ipAddressRequired",
                }),
                port: Joi.number().required().messages({
                    'any.required': "portRequired",
                }),
                station: Joi.string().required().messages({
                    'any.required': "stationRequired",
                }),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    
}