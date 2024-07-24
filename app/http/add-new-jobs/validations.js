const Joi = require("joi");
const { BadRequest } = require("../../util/helpers");

module.exports = {
    create: async (req, res, next) => {
        try {
            await Joi.object({
                jobTitle: Joi.string().required().messages({
                    'any.required': "jobTitleRequired",
                }),
                jobLocation: Joi.string().required().messages({
                    'any.required': "jobLocationRequired",
                }),
                noOfVacancies: Joi.number().required().messages({
                    'any.required': "noOfVacanciesRequired",
                }),
                experience: Joi.number().required().messages({
                    'any.required': "experienceRequired",
                }),
                age: Joi.string().required().messages({
                    'any.required': "ageRequired",
                }),
                salaryFrom: Joi.number().required().messages({
                    'any.required': "salaryFromRequired",
                }),
                salaryTo: Joi.number().required().messages({
                    'any.required': "salaryToRequired",
                }),
                flagCount: Joi.string().required().messages({
                    'any.required': "flagCountRequired",
                }),
                jobType: Joi.string().valid("Full Time", "Part Time").required().messages({
                    'any.required': "jobTypeRequired",
                    'any.only': "jobTypeInvalid",
                }),
                status: Joi.string().valid("Open", "Closed").required().messages({
                    'any.required': "statusRequired",
                    'any.only': "statusInvalid",
                }),
                department: Joi.string().optional().messages({
                    'any.only': "departmentInvalid",
                }),
                description: Joi.string().optional(),
                startDate: Joi.date().optional().allow(null, ""),
                expireDate: Joi.date().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message);
        }
    },
};
