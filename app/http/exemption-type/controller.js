const { Response, BadRequest, serverError } = require('../../util/helpers')
const RequestType = require("../../models/exemption_request_type")
const USER_FIELDS = '_id firstName lastName email avatar'
class ExemptionRequestTypeController {

    async list(req, res) {
        try {
            const { user } = req.payload
            let list = await RequestType.find({ $or: [{ company: user.company._id }, { company: null }] })
                .populate('modifiedBy', USER_FIELDS)
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { title, minHours } = req.body
            const { user } = req.payload
            let request_type = await RequestType.create({ title, minHours, modifiedBy: user._id, company: user.company._id })
            request_type = await RequestType.findById(request_type._id)
                .populate('modifiedBy', USER_FIELDS)
            return Response(res, { request_type })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { title, minHours } = req.body
            const { user } = req.payload

            let request_type = await RequestType.findOne({
                _id: id, company: user.company._id
            })
            if (!request_type) {
                return BadRequest(res, 'notFound')
            }
            request_type.title = title
            request_type.minHours = minHours
            await request_type.save()
            request_type = await RequestType.findById(request_type._id)
                .populate('modifiedBy', USER_FIELDS)
            return Response(res, { request_type })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await RequestType.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'notFound')
            }
            await RequestType.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new ExemptionRequestTypeController