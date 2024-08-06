const { Response, BadRequest, serverError } = require('../../util/helpers')
const User = require("../../models/user")
const UserWarning = require("../../models/user_warning")

class WarningController {

    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let insert = {
                name: data.name,
                description: data.description,
                user: data.user,
                createdBy: user._id,
                company: user.company._id
            }
            const warning = (await UserWarning.create(insert))
            
            return Response(res, {
                warning
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload

            let warning = await UserWarning.findOne({
                _id: id, company: user.company._id
            })
            if (!warning) {
                return BadRequest(res, 'recordNotFound')
            }
            const data = req.body

            if (data?.name) warning.name = data.name
            if (data?.description) warning.description = data.description

            await warning.save()

            return Response(res, {
                warning
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await UserWarning.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'recordNotFound')
            }
            await UserWarning.deleteOne({
                _id: id, company: user.company._id
            })
            await User.updateOne({ _id: exists.user, company: user.company._id }, { $pull: { warnings: exists._id } }, { new: true })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new WarningController