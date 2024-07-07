const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const Project = require("../../models/project")
class ProjectController {

    async list(req, res) {
        try {
            const { user } = req.payload
            const list = await Project.find({ company: user.company })
                .populate('boards')
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('leads', "_id firstName lastName avatar email")
                .populate('members', "_id firstName lastName avatar email")
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let insert = {
                company: user.company,
                createdBy: user._id,
                name: data.name,
                client: data.client,
                description: data.description,
                priority: data.priority,
                startDate: moment(data.startDate).utc().toISOString(),
                endDate: moment(data.endDate).utc().toISOString(),
                leads: data.leads,
                members: data.members,
            }
            if (data?.payment) insert.payment = data.payment
            if (data?.paymentCycle) insert.paymentCycle = data.paymentCycle
            if (data?.attachments) insert.attachments = data.attachments
            let project = await Project.create(insert)
            project = await Project.findById(project._id)
                .populate('boards')
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('leads', "_id firstName lastName avatar email")
                .populate('members', "_id firstName lastName avatar email")
            return Response(res, { project })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const { id } = req.prams
            let project = await Project.findOne({
                _id: id, company: user.company
            })
            if (!project) {
                return NotFound(res)
            }
            if (data?.name) project.name = data.name
            if (data?.client) project.client = data.client
            if (data?.description) project.description = data.description
            if (data?.priority) project.priority = data.priority
            if (data?.startDate) project.startDate = moment(data.startDate).utc().toISOString()
            if (data?.endDate) project.endDate = moment(data.endDate).utc().toISOString()
            if (data?.leads) project.leads = data.leads
            if (data?.members) project.members = data.members
            if (data?.payment) project.payment = data.payment
            if (data?.paymentCycle) project.paymentCycle = data.paymentCycle
            if (data?.attachments) project.attachments = data.attachments
            if (data?.status) project.status = data.status
            await project.save()

            project = await Project.findById(project._id)
                .populate('boards')
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('leads', "_id firstName lastName avatar email")
                .populate('members', "_id firstName lastName avatar email")
            return Response(res, { project })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { user } = req.payload
            const { id } = req.prams
            let project = await Project.findOne({
                _id: id, company: user.company
            })
            if (!project) {
                return NotFound(res)
            }
            await Project.deleteOne({ _id: id })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }

}

module.exports = new ProjectController