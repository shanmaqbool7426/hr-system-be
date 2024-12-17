const { Response, BadRequest, serverError } = require('../../util/helpers')
const Request = require("../../models/employee_resignation")
const moment = require('moment')
class EmployeeResignationController {
  async #getRequest(id) {
    return await Request.findById(id)
      .populate('employee')
      .populate('updatedBy')
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await Request.find({ company: user.company, })
        .populate('employee')
        .populate('updatedBy')
      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body

      const resignation = await Request.create({
        employee: data.employee,
        effectiveDate: data.effectiveDate,
        lastWorkingDay: data.lastWorkingDay,
        reason: data.reason,
        company: user.company,
        updatedBy: user._id
      })
      return Response(res, { resignation })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload;
      const { id } = req.params
      const data = req.body
      let resignation = await Request.findOne({
        _id: id, company: user.company._id
      })
      if (!resignation) {
        return BadRequest(res)
      }
      if (data.status) resignation.status = data.status
      if (data.remarks) resignation.remarks = data.remarks
      if (data.effectiveDate) resignation.effectiveDate = data.effectiveDate
      if (data.lastWorkingDay) resignation.lastWorkingDay = data.lastWorkingDay
      resignation.updatedBy = user._id
      await resignation.save()
      resignation = this.#getRequest(resignation._id)
      return Response(res, { resignation })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async approve(req, res) {
    try {
      const { user } = req.payload;
      const { id } = req.params
      const data = req.body
      let request = await Request.findOne({
        _id: id, company: user.company._id
      })

      if (!request) {
        return BadRequest(res)
      }

      request.status = "approved"
      request.updatedBy = user._id
      if (data.remarks) request.remarks = data.remarks
      await request.save()
      request = this.#getRequest(request._id)
      return Response(res, { request })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async reject(req, res) {
    try {
      const { user } = req.payload;
      const { id } = req.params
      const data = req.body
      let request = await Request.findOne({
        _id: id, company: user.company._id
      })

      if (!request) {
        return BadRequest(res)
      }

      request.status = "rejected"
      request.updatedBy = user._id
      if (data.remarks) request.remarks = data.remarks
      await request.save()
      request = this.#getRequest(request._id)
      return Response(res, { request })

    } catch (error) {
      return serverError(res, error)
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params
      const { user } = req.payload
      let exists = await Request.findOne({
        _id: id, company: user.company._id
      })
      if (!exists) {
        return BadRequest(res)
      }
      await Request.deleteOne({
        _id: id, company: user.company._id
      })
      return Response(res)
    } catch (error) {
      return serverError(res, error)
    }
  }
}
module.exports = new EmployeeResignationController