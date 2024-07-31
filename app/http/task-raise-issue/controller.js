const { Response, serverError } = require('../../util/helpers');
const RaiseIssue = require("../../models/task_raise_issue");
const Task = require("../../models/task");

class TaskRaiseIssueController {
    async create(req, res) {
        try {
            const { user } = req.payload;
            const data = req.body;

            let issue = await RaiseIssue.create({
                company: user.company,
                createdBy: user._id,
                name: data.name,
                description: data.description,
                task: data.task,
                issueResolve: data.resolve,
            });

            await Task.findByIdAndUpdate(data.task, { raiseIssue: issue._id });

            issue = await RaiseIssue.findById(issue._id)
                .populate('task')
                .populate('createdBy', "_id firstName lastName avatar email");

            return Response(res, { issue });
        } catch (error) {
            return serverError(res, error);
        }
    }
    async update(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const { id } = req.params
            let issue = await RaiseIssue.findOne({
                _id: id, company: user.company
            })
            if (!issue) {
                return NotFound(res)
            }
            if (data?.name) issue.name = data.name
            if (data?.description) issue.description = data.description
            if (data?.issueResolve) issue.issueResolve = data.issueResolve
            if (data?.task) issue.task = data.task

            await issue.save()

            if (data?.issueResolve) {
                const task = await Task.findById(issue.task);
                if (task) {
                    task.raiseIssue = null;
                    await task.save();
                }
            }
            
            issue = await Task.findById(issue._id)
            .populate('task')
            .populate('createdBy', "_id firstName lastName avatar email");


            return Response(res, { issue })
        } catch (error) {
            return serverError(res, error)
        }
    }
}

module.exports = new TaskRaiseIssueController();
