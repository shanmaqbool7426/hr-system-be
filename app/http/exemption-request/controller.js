const { Response, BadRequest, serverError } = require('../../util/helpers')
const Attendance = require("../../models/attendance")
const Request = require("../../models/exemption_request")
const ExemptionType = require("../../models/exemption_request_type")
const moment = require('moment')
class ExemptionRequestController {
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

      const exemptionType = await ExemptionType.findById(data.exemptionType)
      if (exemptionType?.minHours > 0) {
        const current_attendance = await Attendance.findOne({
          date: { $gte: moment(data.date).utc().startOf('D').format() },
          user: data.employee,
          company: user.company
        })
        // TODO check the min hours
      }

      const attendance = await Request.create({
        user: data.employee,
        exemptionType: data.exemptionType,
        date: moment(data.date).utc().format(),
        reason: data.reason,
        company: user.company,
      })
      return Response(res, { attendance })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload;
      const { id } = req.params
      const data = req.body
      let request = await Request.findOne({
        _id: id, company: user.company._id
      })
      if (!request) {
        return BadRequest(res, 'notFound')
      }
      if (data?.employee) request.user = data.employee
      if (data?.date) request.date = moment(data.date).utc().format()
      if (data?.exemptionType) request.exemptionType = data.exemptionType
      if (data?.reason) request.reason = data.reason
      await request.save()
      request = this.#getRequest(request._id)
      return Response(res, { request })
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
        return BadRequest(res, 'notFound')
      }

      request.status = "approved"
      request.updatedBy = auth._id
      if (data.reason) request.statusReason = data.reason
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
        return BadRequest(res, 'notFound')
      }

      request.status = "rejected"
      request.updatedBy = auth._id
      if (data.reason) request.statusReason = data.reason
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
        return BadRequest(res, 'notFound')
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
module.exports = new ExemptionRequestController
