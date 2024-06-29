const { Response, BadRequest, serverError } = require('../../util/helpers')
const LeaveRequest = require("../../models/leave_request")
class LeaveRequestController {

    async list(req, res) {
        try {
            const { user } = req.payload
            let list = await LeaveRequest.find({ user: user._id, company: user.company._id })
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const data = req.body
            const { user } = req.payload
            const leave_request = await LeaveRequest.create({
                duration: data.duration,
                formDate: data.formDate,
                toDate: data.toDate,
                status: data.status,
                reason: data.reason,
                attachment: data.attachment,
                leave: data.leave,
                user: user._id,
                company: user.company._id
            })
            return Response(res, { leave_request })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            const data = req.body

            let leave_request = await LeaveRequest.findOne({
                _id: id, company: user.company._id
            })
            if (!leave_request) {
                return BadRequest(res, 'notFound')
            }
            if (leave_request.duration) leave_request.duration = data.duration
            if (leave_request.formDate) leave_request.formDate = data.formDate
            if (leave_request.toDate) leave_request.toDate = data.toDate
            if (leave_request.status) leave_request.status = data.status
            if (leave_request.reason) leave_request.reason = data.reason
            if (leave_request.attachment) leave_request.attachment = data.attachment
            if (leave_request.leave) leave_request.leave = data.leave
            await leave_request.save()
            return Response(res, { leave_request })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await LeaveRequest.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'notFound')
            }
            await LeaveRequest.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new LeaveRequestController