const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const Project = require("../../models/project")
const TaskBoard = require("../../models/task_board");
const Task = require("../../models/task")
const moment= require('moment')
class TaskController {

    async list(req, res) {
        try {
            const { user } = req.payload
            const {board_id} = req.params
            const query = { company: user.company , board : board_id};
           
            const list = await Task.find( query )
            .populate('board')
            .populate('project')
            .populate('createdBy', "_id firstName lastName avatar email")
            .populate('assignedTo', "_id firstName lastName avatar email")
            .populate('leader', "_id firstName lastName avatar email")

               
            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async details(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let task = await Task.findOne({ _id: id, deletedAt: null, $or: [{ company: user.company._id }, { company: null }] })
            .populate('board')
            .populate('project')
            .populate('createdBy', "_id firstName lastName avatar email")
            .populate('assignedTo', "_id firstName lastName avatar email")
            .populate('leader', "_id firstName lastName avatar email")

            return Response(res, { task })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const prefix = "TID";
            let taskId = prefix + "-" + ("1".padStart(3, '0'));
    
            const exists = await Task.findOne({ taskId: { $regex: prefix, $options: 'i' } }).sort({ taskId: -1 });
            if (exists) {
                const currentNumber = parseInt(exists.taskId.split('-')[1]) + 1;
                taskId = prefix + "-" + (currentNumber.toString().padStart(3, '0'));
            }
            const parent = data.parent === "" ? null : data.parent;

            let task = await Task.create({
                company: user.company,
                createdBy: user._id,
                taskId: taskId,
                name: data.name,
                status: data.status,
                parent: parent,
                description: data.description,
                priority: data.priority,
                status:data.status,
                requiredTime: data.requiredTime,
                dueDate: moment(data.dueDate).utc().toISOString(),
                assignedTo: data.assignedTo,
                leader : data.leader,
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
                .populate('board')
                .populate('project')
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('assignedTo', "_id firstName lastName avatar email")
                .populate('leader', "_id firstName lastName avatar email")

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
            if (data?.leader) task.leader = data.leader
            if (data?.status) task.status = data.status
            await task.save()

            task = await Task.findById(task._id)
                .populate('board')
                .populate('project')
                .populate('createdBy', "_id firstName lastName avatar email")
                .populate('assignedTo', "_id firstName lastName avatar email")
                .populate('leader', "_id firstName lastName avatar email")

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