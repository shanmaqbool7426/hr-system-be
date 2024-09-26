const { Response, BadRequest, serverError } = require('../../util/helpers')
const Request = require("../../models/attendance_request")
const moment = require('moment')
class AttendanceRequestController {
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await Request.find({ company: user.company, }).populate('user')
      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body
      const attendance = await Request.create({
        date: moment(data.date).utc().format(),
        checkInAt: moment(data.checkInAt).utc().format(),
        checkOutAt: moment(data.checkOutAt).utc().format(),
        reason: data.reason,
        company: user.company,
        user: user._id
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
      const request = await Request.findOne({
        _id: id, company: user.company._id
      })
      if (!request) {
        return BadRequest(res, 'notFound')
      }
      if (data?.checkInAt) request.checkInAt = moment(data.checkInAt).utc().format()
      if (data?.checkOutAt) request.checkOutAt = moment(data.checkOutAt).utc().format()
      if (data?.reason) request.reason = moment(data.reason).utc().format()
      await request.save()
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
      const request = await Request.findOne({
        _id: id, company: user.company._id
      })

      if (!request) {
        return BadRequest(res, 'notFound')
      }

      request.status = "approved"
      if (data.reason) request.statusReason = data.reason
      await request.save()
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
      const request = await Request.findOne({
        _id: id, company: user.company._id
      })

      if (!request) {
        return BadRequest(res, 'notFound')
      }

      request.status = "rejected"
      if (data.reason) request.statusReason = data.reason
      await request.save()
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
module.exports = new AttendanceRequestController
