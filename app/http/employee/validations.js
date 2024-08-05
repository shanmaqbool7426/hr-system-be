const Joi = require("joi");
const { BadRequest, serverError } = require('../../util/helpers');
const User = require("../../models/user");
const { salary } = require("./changeRequestController");
module.exports = {
    uniqueEmail: async (req, res, next) => {
        try {
            if (req.body.email) {
                const exists = await User.exists({ email: req.body.email })
                if (exists) {
                    return BadRequest(res, 'emailAlreadyExist')
                }
            }
            next()
        } catch (error) {
            return serverError(res, error)
        }
    },
    create: async (req, res, next) => {
        try {
            await Joi.object({
                firstName: Joi.string().required().messages({
                    'any.required': "firstNameRequired",
                }),
                lastName: Joi.string().required().messages({
                    'any.required': "lastNameRequired",
                }),
                fatherName: Joi.string().required().messages({
                    'any.required': "fatherNameRequired",
                }),
                email: Joi.string().email().required().messages({
                    'any.required': "emailRequired",
                }),
                dateOfBirth: Joi.date().required().messages({
                    'any.required': "dateOfBirthRequired",
                }),
                joiningDate: Joi.date().required().messages({
                    'any.required': "joiningDateRequired",
                }),
                employeeCode: Joi.string().required().messages({
                    'any.required': "employeeCodeRequired",
                }),
                status: Joi.string().required().messages({
                    'any.required': "employeeStatusRequired",
                }),
                designation: Joi.string().required().messages({
                    'any.required': "designationRequired",
                }),
                contact: Joi.string().required().messages({
                    'any.required': "contactRequired",
                }),
                lineManager: Joi.string().optional().allow(null, ""),
                mobileAttendance: Joi.boolean(),
                webAttendance: Joi.boolean(),
                sendEmail: Joi.boolean(),
                password: Joi.string().optional().allow(null, ""),
                cnic: Joi.string().optional().allow(null, ""),
                fatherCnic: Joi.string().optional().allow(null, ""),
                avatar: Joi.string().optional().allow(null, ""),
                role: Joi.string().optional().allow(null, ""),
                canLogin: Joi.boolean().optional().allow(null, ""),
                department: Joi.string().optional().allow(null, ""),
                confirmationDate: Joi.date().optional().allow(null, ""),
                resignDate: Joi.date().optional().allow(null, ""),
                lastWorkingDate: Joi.date().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    update: async (req, res, next) => {
        try {
            await Joi.object({
                firstName: Joi.string().optional().allow(null, ""),
                lastName: Joi.string().optional().allow(null, ""),
                fatherName: Joi.string().optional().allow(null, ""),
                email: Joi.string().email().optional().allow(null, ""),
                dateOfBirth: Joi.date().optional().allow(null, ""),
                joiningDate: Joi.date().optional().allow(null, ""),
                confirmationDate: Joi.date().optional().allow(null, ""),
                resignDate: Joi.date().optional().allow(null, ""),
                lastWorkingDate: Joi.date().optional().allow(null, ""),
                lineManager: Joi.string().optional().allow(null, ""),
                mobileAttendance: Joi.boolean().optional().allow(null, ""),
                status: Joi.string().optional().allow(null, ""),
                designation: Joi.string().optional().allow(null, ""),
                webAttendance: Joi.boolean().optional().allow(null, ""),
                sendEmail: Joi.boolean().optional().allow(null, ""),
                password: Joi.string().optional().allow(null, ""),
                cnic: Joi.string().optional().allow(null, ""),
                fatherCnic: Joi.string().optional().allow(null, ""),
                contact: Joi.string().optional().allow(null, ""),
                employeeCode: Joi.string().optional().allow(null, ""),
                passportNumber: Joi.string().optional().allow(null, ""),
                gender: Joi.string().optional().allow(null, ""),
                maritalStatus: Joi.string().optional().allow(null, ""),
                nationality: Joi.string().optional().allow(null, ""),
                religion: Joi.string().optional().allow(null, ""),
                avatar: Joi.string().optional().allow(null, ""),
                role: Joi.string().optional().allow(null, ""),
                department: Joi.string().optional().allow(null, ""),
                emergencyContact: Joi.any().optional().allow(null, ""),
                nextOfKin: Joi.any().optional().allow(null, ""),
                reference1: Joi.any().optional().allow(null, ""),
                reference2: Joi.any().optional().allow(null, ""),
                bankDetails: Joi.any().optional().allow(null, ""),
                cnicIssueDate: Joi.any().optional().allow(null, ""),
                cnicExpiryDate: Joi.any().optional().allow(null, ""),
                EOBI: Joi.any().optional().allow(null, ""),
                SSA: Joi.any().optional().allow(null, ""),
                canLogin: Joi.boolean().optional().allow(null, ""),
                grade: Joi.string().optional().allow(null, ""),
                station: Joi.string().optional().allow(null, ""),
                mobileAttendance: Joi.boolean().optional().allow(null, ""),
                webAttendance: Joi.boolean().optional().allow(null, ""),
                address: Joi.string().optional().allow(null, ""),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    academics: async (req, res, next) => {
        try {
            await Joi.object({
                institution: Joi.string().required().messages({
                    'any.required': "institutionRequired",
                }),
                degree: Joi.string().required().messages({
                    'any.required': "degreeRequired",
                }),
                startDate: Joi.date().required().messages({
                    'any.required': "startDateRequired",
                }),
                endDate: Joi.date().optional().allow("", null),
                user: Joi.string(),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    experience: async (req, res, next) => {
        try {
            await Joi.object({
                company: Joi.string().required().messages({
                    'any.required': "companyRequired",
                }),
                location: Joi.string().required().messages({
                    'any.required': "locationRequired",
                }),
                designation: Joi.string().required().messages({
                    'any.required': "designationRequired",
                }),
                startDate: Joi.date().required().messages({
                    'any.required': "startDateRequired",
                }),
                endDate: Joi.date().required().messages({
                    'any.required': "endDateRequired",
                }),
                user: Joi.string(),
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeDesignation: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "employeeRequired",
                }),
                designation: Joi.string().required().messages({
                    'any.required': "designationRequired",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "effectiveDateRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                detail: Joi.string().optional().allow("", null),
                attachment: Joi.string().optional().allow(null)
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeDepartment: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "employeeRequired",
                }),
                department: Joi.string().required().messages({
                    'any.required': "departmentRequired",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "effectiveDateRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                detail: Joi.string().optional().allow("", null),
                attachment: Joi.string().optional().allow(null)
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeEmployeeCode: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "employeeRequired",
                }),
                employeeCode: Joi.string().required().messages({
                    'any.required': "employeeCodeRequired",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "effectiveDateRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                detail: Joi.string().optional().allow("", null),
                attachment: Joi.string().optional().allow(null)
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeSalary: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "employeeRequired",
                }),
                salary: Joi.number().required().messages({
                    'any.required': "salaryRequired",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "effectiveDateRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                detail: Joi.string().optional().allow("", null),
                attachment: Joi.string().optional().allow(null)
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeGrade: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "employeeRequired",
                }),
                grade: Joi.string().required().messages({
                    'any.required': "gradeRequired",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "effectiveDateRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                detail: Joi.string().optional().allow("", null),
                attachment: Joi.string().optional().allow(null)
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
    changeLineManager: async (req, res, next) => {
        try {
            await Joi.object({
                employee: Joi.string().required().messages({
                    'any.required': "employeeRequired",
                }),
                lineManager: Joi.string().required().messages({
                    'any.required': "lineManagerRequired",
                }),
                effectiveDate: Joi.date().required().messages({
                    'any.required': "effectiveDateRequired",
                }),
                reason: Joi.string().required().messages({
                    'any.required': "reasonRequired",
                }),
                detail: Joi.string().optional().allow("", null),
                attachment: Joi.string().optional().allow(null)
            }).validateAsync(req.body);
            next();
        } catch (error) {
            return BadRequest(res, error.message)
        }
    },
}