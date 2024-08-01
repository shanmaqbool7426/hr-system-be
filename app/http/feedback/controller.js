const { Response, serverError } = require('../../util/helpers');
const Feedback = require("../../models/feedback");
const Task = require("../../models/task");
const Project = require("../../models/project")

class FeedbackController {
    async create(req, res) {
        try {
            const { user } = req.payload;
            const data = req.body;

            let feedback = await Feedback.create({
                company: user.company,
                createdBy: user._id,
                name: data.name,
                member: data.member,
                rating: data.rating,
                comments: data.comments,
                feedbackReply:data.feedbackReply,
                task: data.task,
                project:data.project,
            });

            await Project.findByIdAndUpdate(data.project, { feedback: feedback._id });
           
            await Task.findByIdAndUpdate(data.task, { feedback: feedback._id });
            
            feedback = await Feedback.findById(feedback._id)
                .populate('task')
                .populate('project')
                .populate('createdBy', "_id firstName lastName avatar email");

            return Response(res, { feedback });
        } catch (error) {
            return serverError(res, error);
        }
    }
    async update(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            const { id } = req.params
            let feedback = await Feedback.findOne({
                _id: id, company: user.company
            })
            if (!feedback) {
                return NotFound(res)
            }
            if (data?.name) feedback.name = data.name
            if (data?.member) feedback.member = data.member
            if (data?.rating) feedback.rating = data.rating
            if (data?.feedbackReply) feedback.feedbackReply = data.feedbackReply
            if (data?.comments) feedback.comments = data.comments

            await feedback.save()
            
            feedback = await Feedback.findById(feedback._id)
            .populate('task')
            .populate('project')
            .populate('createdBy', "_id firstName lastName avatar email");


            return Response(res, { feedback })
        } catch (error) {
            return serverError(res, error)
        }
    }
}

module.exports = new FeedbackController();
