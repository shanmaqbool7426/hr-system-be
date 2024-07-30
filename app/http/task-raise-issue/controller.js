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
                project: data.project,
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
}

module.exports = new TaskRaiseIssueController();
