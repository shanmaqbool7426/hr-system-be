const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const Project = require("../../models/project")
const TaskBoard = require("../../models/task_board");
const Task = require("../../models/task");
const moment = require("moment")
class ProjectController {

    async list(req, res) {
        try {
            const { user } = req.payload
            const list = await Project.find({ company: user.company })
                .populate('boards')
                .populate('createdBy', "_id firstName lastName avatar email ")
                .populate('leads', "_id firstName lastName avatar email ")
                .populate('members', "_id firstName lastName avatar email ")
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async details(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let project = await Project.findOne({ _id: id, deletedAt: null, $or: [{ company: user.company._id }, { company: null }] })
            .populate('boards')
            .populate('createdBy', "_id firstName lastName avatar email")
            .populate('leads', "_id firstName lastName avatar email")
            .populate('members', "_id firstName lastName avatar email")
            const total_tasks = await Task.countDocuments({project: id})
            const completed_tasks = await Task.countDocuments({project: id , status: "completed"})

            return Response(res, { project ,  total_tasks, completed_tasks })
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
                projectId:projectId,
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
                .populate('createdBy', "_id firstName lastName avatar email ")
                .populate('leads', "_id firstName lastName avatar email ")
                .populate('members', "_id firstName lastName avatar email ")
              
            return Response(res, { project  })
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
            if (data?.startDate) project.startDate = moment(data.startDate).utc().toISOString()
            if (data?.endDate) project.endDate = moment(data.endDate).utc().toISOString()
            if (data?.leads) project.leads = data.leads
            if (data?.members) project.members = data.members
            if (data?.payment) project.payment = data.payment
            if (data?.paymentCycle) project.paymentCycle = data.paymentCycle
            if (data?.attachments) project.attachments = data.attachments
            if (data?.status) project.status = data.status
            await project.save()

            if (data?.leads || data?.members) {
                await TaskBoard.updateMany(
                    { project: id },
                    {
                        $set: {
                            leads: data.leads || project.leads,
                            members: data.members || project.members,
                        }
                    }
                );
            }

            project = await Project.findById(project._id)
                .populate('boards')
                .populate('createdBy', "_id firstName lastName avatar email ")
                .populate('leads', "_id firstName lastName avatar email ")
                .populate('members', "_id firstName lastName avatar email ")
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

}

module.exports = new ProjectController