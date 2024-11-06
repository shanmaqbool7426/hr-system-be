const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const ChangeShiftRequest = require('../../models/change_shift_request')
const User = require('../../models/user')
const { USER_FIELDS } = require('../../util/config')
const moment = require('moment')

class ChangeShiftRequestController {
    async #getRequest(id) {
        return await ChangeShiftRequest.findById(id)
            .populate('previousShift')
            .populate('requestedShift')
            .populate("employee", USER_FIELDS)
            .populate("updatedBy", USER_FIELDS)
    }
    async list(req, res) {
        try {
            const { user } = req.payload
            let list = await ChangeShiftRequest.find({ company: user.company._id })
                .populate('previousShift')
                .populate('requestedShift')
                .populate("employee", USER_FIELDS)
                .populate("updatedBy", USER_FIELDS)

            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const effectiveNow = moment(data.effectiveDate).isSame(moment(), 'day')
            let insert = {
                effectiveDate: data.effectiveDate,
                previousShift: user.shiftplan,
                requestedShift: data.requestedShift,
                reason: data.reason,
                status: effectiveNow ? 'approved' : 'pending',
                company: user.company._id,
                employee: data.employee,
                updatedBy: user._id
            }
            if (data.validTill) insert.validTill = data.validTill
            let request = await ChangeShiftRequest.create(insert)

            if (effectiveNow) {
                await User.updateOne({ _id: data.employee }, { $set: { shiftplan: data.requestedShift } })
            }
            request = await this.#getRequest(request._id)
            return Response(res, { request })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            const data = req.body
            let request = await ChangeShiftRequest.findOne({ _id: id, company: user.company._id })
            if (!request) {
                return NotFound(res)
            }

            if (data?.effectiveDate) request.effectiveDate = data.effectiveDate
            if (data?.validTill) request.validTill = data.validTill
            if (data?.previousShift) request.previousShift = data.previousShift
            if (data?.requestedShift) request.requestedShift = data.requestedShift
            if (data?.reason) request.reason = data.reason

            if (moment(data.effectiveDate).isSame(moment(), 'day')) {
                request.status = 'approved'
                await User.updateOne({ _id: request.employee }, { $set: { shiftplan: request.requestedShift } })
            }
            await request.save()
            request = await this.#getRequest(request._id)
            return Response(res, { request })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async revert(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let request = await ChangeShiftRequest.findOne({ _id: id, company: user.company._id })
            if (!request) {
                return NotFound(res)
            }
            await User.updateOne({ _id: request.employee }, { $set: { shiftplan: request.previousShift } })
            request.status = 'reverted'
            await request.save()
            request = await this.#getRequest(request._id)
            return Response(res, { request })
        } catch (error) {
            return serverError(res, error)
        }
    }
}

module.exports = new ChangeShiftRequestController