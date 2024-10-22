const Joi = require("joi");
const { BadRequest } = require('../../util/helpers');

module.exports = {
  create: async (req, res, next) => {
    try {
      await Joi.object({
        title: Joi.string().required().messages({
          'any.required': "Title is required",
        }),
        description: Joi.string().required().messages({
          'any.required': "Description is required",
        }),
        type: Joi.string().required().messages({
          'any.required': "Type is required",
        }),
        hardwareType: Joi.string().optional().allow("", null),
        priority: Joi.string().required().messages({
          'any.required': "Priority is required",
        }),
        attachment: Joi.string().optional().allow("", null),
        asset: Joi.string().optional().allow("", null)
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },

  assign: async (req, res, next) => {
    try {
      await Joi.object({ assignTo: Joi.string().required().messages({ 'any.required': "Assign to is required" }) }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  transfer: async (req, res, next) => {
    try {
      await Joi.object({ assignTo: Joi.string().required().messages({ 'any.required': "Assign to is required" }) }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  close: async (req, res, next) => {
    try {
      await Joi.object({
        remarks: Joi.string().required().messages({ 'any.required': "Remarks is required" }),
        repairCost: Joi.number().optional().allow(null)
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  },
  feedback: async (req, res, next) => {
    try {
      await Joi.object({
        feedback: Joi.string().required().messages({ 'any.required': "Feedback is required" }),
        rating: Joi.number().min(1).max(5).required().messages({ 'any.required': "Rating is required" })
      }).validateAsync(req.body);
      next();
    } catch (error) {
      return BadRequest(res, error.message)
    }
  }
}
