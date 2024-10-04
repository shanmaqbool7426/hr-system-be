const { Response, BadRequest, serverError } = require('../../util/helpers')
const Attendance = require("../../models/attendance")
const Request = require("../../models/attendance_request")
const moment = require('moment')
class AttendanceRequestController {
  async #getRequest(id) {
    return await Request.findById(id)
      .populate('user')
      .populate('updatedBy')
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await Request.find({ company: user.company, })
        .populate('user')
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
      const attendance = await Request.create({
        user: data.employee,
        date: moment(data.date).utc().format(),
        checkInAt: moment(data.checkInAt).utc().format(),
        checkOutAt: moment(data.checkOutAt).utc().format(),
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
        return BadRequest(res)
      }
      if (data?.employee) request.user = data.employee
      if (data?.checkInAt) request.checkInAt = moment(data.checkInAt).utc().format()
      if (data?.checkOutAt) request.checkOutAt = moment(data.checkOutAt).utc().format()
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
        return BadRequest(res)
      }

      request.status = "approved"
      request.updatedBy = auth._id
      if (data.reason) request.statusReason = data.reason
      await request.save()
      await Attendance.updateOne({
        date: { $gte: moment(request.date).startOf("D").format() },
        user: request.user,
        company: user.company._id
      }, {
        $set: {
          checkInAt: request.checkInAt,
          checkOutAt: request.checkOutAt,
        }
      })
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
module.exports = new AttendanceRequestController
