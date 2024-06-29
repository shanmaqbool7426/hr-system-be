const { Response, BadRequest, serverError } = require('../../util/helpers')
const CustomField = require("../../models/custom_field")
class CustomFieldController {

    async list(req, res) {
        try {

            const { user } = req.payload
            let list = await CustomField.find({ $or: [{ company: user.company._id }, { company: null }] })

            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { name, type, icon, prefix, fields } = req.body
            const { user } = req.payload
            let insert = { name, type, modifiedBy: user._id, company: user.company._id }
            if (icon) insert.icon = icon
            if (prefix) insert.prefix = prefix
            if (fields) insert.fields = fields
            const custom_field = await CustomField.create(insert)
            return Response(res, { custom_field })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { name, icon, prefix, fields } = req.body
            const { user } = req.payload

            let custom_field = await CustomField.findOne({
                _id: id, company: user.company._id
            })
            if (!custom_field) {
                return BadRequest(res, 'notFound')
            }
            custom_field.name = name
            if (icon) custom_field.icon = icon
            if (prefix) custom_field.prefix = prefix
            if (fields) insert.fields = fields
            await custom_field.save()
            return Response(res, { custom_field })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await CustomField.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'notFound')
            }
            await CustomField.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new CustomFieldController