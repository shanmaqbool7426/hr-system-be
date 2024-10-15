const { Response, serverError, NotFound } = require('../../util/helpers')
const Project = require("../../models/project")
const ProjectAttachment = require("../../models/project_attachment")
const TaskBoard = require("../../models/task_board");
const Task = require("../../models/task");
const moment = require("moment")
class ProjectController {
    async getProject(project_id, company_id) {
        return await Project.findOne({ _id: project_id, company: company_id })
            .populate('boards')
            .populate('attachments')
            .populate('createdBy', "_id firstName lastName avatar email ")
            .populate('leads', "_id firstName lastName avatar email ")
            .populate('members', "_id firstName lastName avatar email ")
            .populate({
                path: 'feedback',
                populate: {
                    path: 'createdBy',
                    select: "_id firstName lastName avatar email"
                }
            })
    }
    async list(req, res) {
        try {
            const { user } = req.payload
            const { status } = req.query
            let filters = { company: user.company }
            if (status) filters.status = status
            const list = await Project.find(filters)
                .populate('boards')
                .populate('createdBy', "_id firstName lastName avatar email ")
                .populate('leads', "_id firstName lastName avatar email ")
                .populate('members', "_id firstName lastName avatar email ")
                .populate({
                    path: 'feedback',
                    populate: {
                        path: 'createdBy',
                        select: "_id firstName lastName avatar email"
                    }
                })
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async details(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let project = await this.getProject(id, user.company._id)
            const total_tasks = await Task.countDocuments({ project: id })
            const completed_tasks = await Task.countDocuments({ project: id, status: "completed" })

            return Response(res, { project, total_tasks, completed_tasks })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body

            const prefix = "PJT";
            let projectId = `${prefix}-001`;
            const exists = await Project.findOne({ projectId: { $regex: `^${prefix}-`, $options: 'i' } })
                .sort({ projectId: -1 });

            if (exists) {
                const currentNumber = parseInt(exists.projectId.split('-')[1]) + 1;
                projectId = `${prefix}-${currentNumber.toString().padStart(3, '0')}`;
            }

            let insert = {
                company: user.company._id,
                createdBy: user._id,
                projectId: projectId,
                name: data.name,
                client: data.client,
                description: data.description,
                priority: data.priority,
                startDate: moment(data.startDate).format(),
                endDate: moment(data.endDate).format(),
                leads: data.leads,
                members: data.members,
            }
            if (data?.payment) insert.payment = data.payment
            if (data?.paymentCycle) insert.paymentCycle = data.paymentCycle
            let project = await Project.create(insert)

            project = await this.getProject(id, user.company._id)

            return Response(res, { project })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const { id } = req.params
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
            if (data?.startDate) project.startDate = moment(data.startDate).format()
            if (data?.endDate) project.endDate = moment(data.endDate).format()
            if (data?.leads) project.leads = data.leads
            if (data?.members) project.members = data.members
            if (data?.payment) project.payment = data.payment
            if (data?.paymentCycle) project.paymentCycle = data.paymentCycle
            if (data?.attachments) project.attachments = data.attachments
            if (data?.status) project.status = data.status
            await project.save()
            project = await this.getProject(id, user.company._id)
            return Response(res, { project })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { user } = req.payload
            const { id } = req.params
            let project = await Project.findOne({
                _id: id, company: user.company
            })
            if (!project) {
                return NotFound(res)
            }

            await TaskBoard.deleteMany({ project: id });
            await Project.deleteOne({ _id: id });
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
    async createAttachment(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let attachment = await ProjectAttachment.create({
                name: data.name,
                size: data.size,
                link: data.attachment,
                project: data.project_id,
                company: user.company
            })
            await Project.updateOne({ _id: data.project_id, company: user.company },
                { $addToSet: { attachments: attachment._id } })
            return Response(res, { attachment })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async deleteAttachment(req, res) {
        try {
            const { user } = req.payload
            const { id } = req.params
            let attachment = await ProjectAttachment.findOne({
                _id: id,
                company: user.company
            })
            if (!attachment) {
                return NotFound(res);
            }
            await ProjectAttachment.deleteOne({ _id: id });
            await Project.updateOne({ _id: attachment.project, company: user.company },
                { $pull: { attachments: attachment._id } })
            return Response(res, {})
        } catch (error) {
            return serverError(res, error)
        }
    }
}

module.exports = new ProjectController