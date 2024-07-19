const {
  Response,
  BadRequest,
  serverError,
  NotFound,
} = require("../../util/helpers");
const TaskBoard = require("../../models/task_board");
const Project = require("../../models/project");
const moment = require ("moment")
class TaskBoardController {
  async list(req, res) {
    try {
      const { user } = req.payload;
      const list = await TaskBoard.find({ company: user.company })
        .populate("project")
        .populate("createdBy", "_id firstName lastName avatar email")
        .populate("leads", "_id firstName lastName avatar email")
        .populate("members", "_id firstName lastName avatar email");
      return Response(res, { list });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body;

      const project = await Project.findOne({ _id: data.project, company: user.company });

      if (!project) {
          return NotFound(res, "Project not found");
      }
      let board = await TaskBoard.create({
        company: user.company,
        createdBy: user._id,
        name: data.name,
        sprintNumber: data.sprintNumber,
        dueDate: moment(data.dueDate).utc().toISOString(),
        leads: data.leads,
        members: data.members,
        project:data.project,
      });
      await Project.updateOne(
        { _id: data.project, company: user.company },
        {
          $addToSet: { boards: board._id },
        }
      );

      board = await TaskBoard.findById(board._id)
        .populate("project")
        .populate("createdBy", "_id firstName lastName avatar email")
        .populate("leads", "_id firstName lastName avatar email")
        .populate("members", "_id firstName lastName avatar email");

      
      return Response(res, { board });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload;
      const data = req.body;
      const { id } = req.params;
      let board = await TaskBoard.findOne({
        _id: id,
        company: user.company,
      });
      if (!board) {
        return NotFound(res);
      }
      if (data?.name) board.name = data.name;
      if (data?.sprintNumber) board.sprintNumber = data.sprintNumber;
      if (data?.dueDate)
        board.dueDate = moment(data.dueDate).utc().toISOString();
      if (data?.leads) board.leads = data.leads;
      if (data?.members) board.members = data.members;
      if (data?.status) board.status = data.status;
      await board.save();

      board = await TaskBoard.findById(board._id)
        .populate("project")
        .populate("createdBy", "_id firstName lastName avatar email")
        .populate("leads", "_id firstName lastName avatar email")
        .populate("members", "_id firstName lastName avatar email");
      return Response(res, { board });
    } catch (error) {
      return serverError(res, error);
    }
  }
  async delete(req, res) {
    try {
      const { user } = req.payload;
      const { id } = req.params;
      let board = await TaskBoard.findOne({
        _id: id,
        company: user.company,
      });
      if (!board) {
        return NotFound(res);
      }
      await TaskBoard.deleteOne({ _id: id });
      const project = await Project.findOne({ _id: board.project, company: user.company });

      if (project) {
      await Project.updateOne(
        { _id: data.project, company: user.company },
        {
          $pull: { boards: board._id },
        }
      )}
      return Response(res);
    } catch (error) {
      return serverError(res, error);
    }
  }
}

module.exports = new TaskBoardController();
