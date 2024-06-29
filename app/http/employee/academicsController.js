const { Response, BadRequest, serverError } = require('../../util/helpers')
const User = require("../../models/user")
const UserAcadamic = require("../../models/user_acadamic")

class AcademicsController {

    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let insert = {
                institution: data.institution,
                degree: data.degree,
                startDate: data.startDate,
                user: data.user,
                company: user.company._id
            }
            if (data.endDate) insert.endDate = data.endDate
            const academic = await UserAcadamic.create(insert)
            if (!!await User.exists({ _id: data.user, company: user.company._id, academicsHistory: { $exists: false } })) {
                await User.updateOne({ _id: data.user, company: user.company._id }, { $set: { academicsHistory: [] } })
            }
            await User.updateOne({ _id: data.user, company: user.company._id }, { $push: { academicsHistory: academic._id } }, { new: true })
            return Response(res, {
                academic
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload

            let academic = await UserAcadamic.findOne({
                _id: id, company: user.company._id
            })
            if (!academic) {
                return BadRequest(res, 'recordNotFound')
            }
            const data = req.body

            if (data?.institution) academic.institution = data.institution
            if (data?.degree) academic.degree = data.degree
            if (data?.startDate) academic.startDate = data.startDate
            if (data.hasOwnProperty('endDate')) academic.endDate = data.endDate

            await academic.save()

            return Response(res, {
                academic
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await UserAcadamic.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'recordNotFound')
            }
            await UserAcadamic.deleteOne({
                _id: id, company: user.company._id
            })
            await User.updateOne({ _id: exists.user, company: user.company._id }, { $pull: { academicsHistory: exists._id } }, { new: true })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new AcademicsController