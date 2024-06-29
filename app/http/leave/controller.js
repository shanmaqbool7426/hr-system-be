const { Response, BadRequest, serverError } = require('../../util/helpers')
const Leave = require("../../models/leave")
class LeaveController {

    async list(req, res) {
        try {
            const { user } = req.payload
            let list = await Leave.find({ company: user.company._id })
                .populate('entitledToStatus')
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const data = req.body
            const { user } = req.payload
            let leave = await Leave.create({
                name: data.name,
                entitled: data.entitled,
                encashable: data.encashable,
                carryForward: data.carryForward,
                entitledToStatus: data.entitledToStatus,
                modifiedBy: user._id,
                company: user.company._id
            })
            leave = await Leave.findById(leave._id).populate('entitledToStatus')
            return Response(res, { leave })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            const data = req.body

            let leave = await Leave.findOne({
                _id: id, company: user.company._id
            })
            if (!leave) {
                return BadRequest(res, 'notFound')
            }
            leave.name = data.name
            leave.entitled = data.entitled
            leave.encashable = data.encashable
            leave.carryForward = data.carryForward
            leave.entitledToStatus = data.entitledToStatus
            await leave.save()
            leave = await Leave.findById(leave._id).populate('entitledToStatus')
            return Response(res, { leave })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await Leave.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'notFound')
            }
            await Leave.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new LeaveController