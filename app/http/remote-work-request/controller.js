const { Response, BadRequest, serverError } = require('../../util/helpers')
const RemoteWorkRequest = require('../../models/remote_work_request')
const User = require('../../models/user')
const { USER_FIELDS } = require('../../util/config')
const moment = require('moment')
const { populateEmployee } = require('../employee/employeeController')
class RemoteWorkRequestController {
  async #getWorkRequest(id) {
    return await RemoteWorkRequest.findById(id)
      .populate('user', USER_FIELDS)
      .populate('modifiedBy', USER_FIELDS)
      .populate('team')
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await RemoteWorkRequest.find({ company: user.company._id })
        .populate('user', USER_FIELDS)
        .populate('modifiedBy', USER_FIELDS)
        .populate('team')
      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let request = await RemoteWorkRequest.create({
        user: data.employee,
        startDate: moment(data.startDate).toDate(),
        endDate: data?.endDate ? moment(data.endDate).toDate() : null,
        reason: data.reason,
        company: user.company._id,
        team: data?.team ? data.team : null,
        modifiedBy: user._id
      })
      request = await this.#getWorkRequest(request._id)
      return Response(res, { request })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let request = await RemoteWorkRequest.findOne({ _id: req.params.id, company: user.company._id })
      if (!request) return BadRequest(res)

      if (data?.startDate) request.startDate = moment(data.startDate).toDate()
      if (data?.endDate) request.endDate = moment(data.endDate).toDate()
      if (data?.team) request.team = data.team
      if (data?.reason) request.reason = data.reason
      request.modifiedBy = user._id
      await request.save()
      request = await this.#getWorkRequest(request._id)
      return Response(res, { request })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async delete(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const request = await RemoteWorkRequest.findOne({ _id: id, company: user.company._id })
      if (!request) return BadRequest(res)

      await request.deleteOne({ _id: id })

      return Response(res)
    } catch (error) {
      return serverError(res, error)
    }
  }
  async updateStatus(req, res) {
    try {
      const { user } = req.payload
      const data = req.body
      const { id } = req.params

      let request = await RemoteWorkRequest.findOne({ _id: id, company: user.company._id })
      if (!request) return BadRequest(res)

      if (data?.status) request.status = data.status
      if (data?.reason) request.statusReason = data.reason
      await request.save()
      request = await this.#getWorkRequest(request._id)
      if (data.status === "approved" && moment(request.startDate).isSameOrBefore(new Date()) && moment(request.endDate).isSameOrAfter(new Date())) {
        let updateData = { workMode: "remote" }
        if (request.team) updateData.team = request.team
        await User.updateOne({ _id: request.user }, { $set: updateData, remoteWork: { from: moment(request.startDate).toDate(), to: moment(request.endDate).toDate() } })
      }
      return Response(res, { request })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async revoke(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params

      let request = await RemoteWorkRequest.findOne({ _id: id, company: user.company._id })
      if (!request) return BadRequest(res)

      await User.updateOne({ _id: request.user }, { $set: { workMode: "onsite" } })
      request.isRevoked = true
      await request.save()
      let employee = await populateEmployee(request.user)
      return Response(res, { employee })
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new RemoteWorkRequestController
