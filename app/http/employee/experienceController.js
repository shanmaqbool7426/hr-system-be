const { Response, BadRequest, serverError } = require('../../util/helpers')
const User = require("../../models/user")
const UserJobExperience = require("../../models/user_job_experience")

class ExperienceController {

    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let insert = {
                organization: data.company,
                location: data.location,
                designation: data.designation,
                startDate: data.startDate,
                endDate: data.endDate,
                user: data.user,
                company: user.company._id
            }
            const experience = await UserJobExperience.create(insert)
            if (!!await User.exists({ _id: data.user, company: user.company._id, jobExperiences: { $exists: false } })) {
                await User.updateOne({ _id: data.user, company: user.company._id }, { $set: { jobExperiences: [] } })
            }
            await User.updateOne({ _id: data.user, company: user.company._id }, { $push: { jobExperiences: experience._id } }, { new: true })
            return Response(res, {
                experience
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload

            let experience = await UserJobExperience.findOne({
                _id: id, company: user.company._id
            })
            if (!experience) {
                return BadRequest(res, 'recordNotFound')
            }
            const data = req.body

            if (data?.organization) experience.organization = data.company
            if (data?.location) experience.location = data.location
            if (data?.designation) experience.designation = data.designation
            if (data?.startDate) experience.startDate = data.startDate
            if (data?.endDate) experience.endDate = data.endDate
            await experience.save()

            return Response(res, {
                experience
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await UserJobExperience.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'recordNotFound')
            }
            await UserJobExperience.deleteOne({
                _id: id, company: user.company._id
            })
            await User.updateOne({ _id: exists.user, company: user.company._id }, { $pull: { jobExperiences: exists._id } }, { new: true })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}


module.exports = new ExperienceController