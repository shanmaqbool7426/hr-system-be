const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const Project = require("../../models/project")
const TaskBoard = require("../../models/task_board");
const Task = require("../../models/task")
const moment = require("moment")
class TaskController {

    async list(req, res) {
        try {
            const { user } = req.payload
            const list = await Task.find({ company: user.company })
                .populate('board')
                // .populate('createdBy', "_id firstName lastName avatar email")
                // .populate('leads', "_id firstName lastName avatar email")
                // .populate('members', "_id firstName lastName avatar email")
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let task = await Task.create({
                company: user.company,
                createdBy: user._id,
                name: data.name,
                subTask:data.subTask,
                status: data.status,
                description: data.description,
                priority: data.priority,
                requiredTime: data.requiredTime,
                dueDate: moment(data.dueDate).utc().toISOString(),
                assignedTo: data.assignedTo,
                project: data.project,
                board: data.board,
            })
            await TaskBoard.updateOne(
                { _id: data.board, company: user.company },
                {
                    $addToSet: { tasks: task._id },
                }
            );
            task = await Task.findById(task._id)
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('assignedTo', "_id firstName lastName avatar email")
                .populate('project')
                .populate('board')


            return Response(res, { task })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const { id } = req.params
            let task = await Task.findOne({
                _id: id, company: user.company
            })
            if (!task) {
                return NotFound(res)
            }
            if (data?.name) task.name = data.name
            if (data?.description) task.description = data.description
            if (data?.priority) task.priority = data.priority
            if (data?.requiredTime) task.requiredTime = data.requiredTime
            if (data?.dueDate) task.dueDate = moment(data.dueDate).utc().toISOString()
            if (data?.assignedTo) task.assignedTo = data.assignedTo
            if (data?.status) task.status = data.status
            await task.save()

            task = await Task.findById(task._id)
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('assignedTo', "_id firstName lastName avatar email")
            return Response(res, { task })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { user } = req.payload
            const { id } = req.params
            let task = await Task.findOne({
                _id: id, company: user.company
            })
            if (!task) {
                return NotFound(res)
            }
            await Task.deleteOne({ _id: id })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }

}

module.exports = new TaskController