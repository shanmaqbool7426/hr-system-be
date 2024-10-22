const { Response, BadRequest, serverError } = require('../../util/helpers')
const HelpdeskTicket = require('../../models/helpdesk_ticket')
const { USER_FIELDS } = require('../../util/config')
class HelpdeskController {
  async #getTicket(id) {
    return await HelpdeskTicket.findById(id)
      .populate('asset')
      .populate('createdBy', USER_FIELDS)
      .populate('assignedTo', USER_FIELDS)
  }
  async dashboard(req, res) {
    try {
      const { user } = req.payload
      let stats = await HelpdeskTicket.aggregate([
        { $match: { company: user.company._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { _id: 0, status: "$_id", count: 1 } }
      ]);

      stats = stats.reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {});

      const allStatuses = ['open', 'in-progress', 'closed'];
      allStatuses.forEach(status => {
        if (!(status in stats)) {
          stats[status] = 0;
        }
      });
      if (stats.length) stats = stats[0]
      stats.inProgress = stats['in-progress']
      delete stats['in-progress']
      stats.total = stats.open + stats.inProgress + stats.closed

      // Get stats by priority
      let priorityStats = await HelpdeskTicket.aggregate([
        { $match: { company: user.company._id } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
        { $project: { _id: 0, priority: "$_id", count: 1 } }
      ]);

      priorityStats = priorityStats.reduce((acc, curr) => {
        acc[curr.priority] = curr.count;
        return acc;
      }, {});

      // Get top 3 users with most closed tickets
      let topTicketSolvers = await HelpdeskTicket.aggregate([
        { $match: { company: user.company._id, status: 'closed' } },
        { $group: { _id: "$assignedTo", closedCount: { $sum: 1 } } },
        { $sort: { closedCount: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            pipeline: [
              { $project: { firstName: 1, lastName: 1 } }
            ],
            as: 'userDetails'
          }
        },
        { $unwind: '$userDetails' },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            name: { $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] },
            closedCount: 1
          }
        }
      ]);

      // Get ticket counts for the last 12 months
      const lastTwelveMonths = await HelpdeskTicket.aggregate([
        { $match: { company: user.company._id } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month"
              }
            },
            count: 1
          }
        },
        { $sort: { date: 1 } }
      ]);

      // Fill in missing months with zero counts
      const monthlyTicketCounts = [];
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 11);

      for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
        const existingData = lastTwelveMonths.find(item =>
          item.date.getMonth() === d.getMonth() &&
          item.date.getFullYear() === d.getFullYear()
        );

        monthlyTicketCounts.push({
          date: new Date(d),
          count: existingData ? existingData.count : 0
        });
      }

      return Response(res, { stats, priorityStats, topTicketSolvers, monthlyTicketCounts })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const { user: userId, type, status, hardwareType } = req.query
      let filter = { company: user.company._id }
      if (userId) filter.$or = [{ createdBy: userId }, { assignedTo: userId }]
      if (type) filter.type = type
      if (status) {
        filter.status = { $in: status.split(',') }
      }
      if (hardwareType) filter.hardwareType = hardwareType
      const list = await HelpdeskTicket.find(filter)
        .populate('asset')
        .populate('createdBy', USER_FIELDS)
        .populate('assignedTo', USER_FIELDS)
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
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        company: user.company._id,
        createdBy: user._id
      }
      if (data?.attachment) insert.attachment = data.attachment
      if (data?.asset) insert.asset = data.asset
      if (data?.hardwareType) insert.hardwareType = data.hardwareType
      let ticket = await HelpdeskTicket.create(insert)
      ticket = await this.#getTicket(ticket._id)
      return Response(res, { ticket })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let ticket = await HelpdeskTicket.findOne({ _id: req.params.id, company: user.company._id })
      if (!ticket) return BadRequest(res)

      if (data?.title) ticket.title = data.title
      if (data?.description) ticket.description = data.description
      if (data?.type) ticket.type = data.type
      if (data?.priority) ticket.priority = data.priority
      if (data?.assignedTo) ticket.assignedTo = data.assignedTo
      if (data?.status) ticket.status = data.status
      ticket.modifiedBy = user._id
      await ticket.save()
      ticket = await this.#getTicket(ticket._id)
      return Response(res, { ticket })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async delete(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const ticket = await HelpdeskTicket.findOne({ _id: id, company: user.company._id })
      if (!ticket) return BadRequest(res)

      await ticket.deleteOne({ _id: id })

      return Response(res, { message: "Ticket deleted successfully" })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async assign(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const data = req.body
      let ticket = await HelpdeskTicket.findOne({ _id: id, company: user.company._id })
      if (!ticket) return BadRequest(res)
      ticket.status = "in-progress"
      ticket.assignedTo = data.assignTo
      ticket.modifiedBy = user._id
      await ticket.save()
      ticket = await this.#getTicket(ticket._id)
      return Response(res, { ticket })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async transfer(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const data = req.body
      let ticket = await HelpdeskTicket.findOne({ _id: id, company: user.company._id })
      if (!ticket) return BadRequest(res)

      ticket.assignedTo = data.assignTo
      ticket.modifiedBy = user._id
      await ticket.save()
      ticket = await this.#getTicket(ticket._id)
      return Response(res, { ticket })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async close(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const data = req.body
      let ticket = await HelpdeskTicket.findOne({ _id: id, company: user.company._id })
      if (!ticket) return BadRequest(res)

      if (ticket.hardwareType === 'faulty' && data?.repairCost) ticket.repairCost = data.repairCost
      ticket.status = "closed"
      ticket.remarks = data.remarks
      ticket.modifiedBy = user._id
      await ticket.save()

      ticket = await this.#getTicket(ticket._id)
      return Response(res, { ticket })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async feedback(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const data = req.body
      let ticket = await HelpdeskTicket.findOne({ _id: id, company: user.company._id })
      if (!ticket) return BadRequest(res)

      ticket.feedback = data.feedback
      ticket.rating = data.rating
      await ticket.save()
      ticket = await this.#getTicket(ticket._id)
      return Response(res, { ticket })
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new HelpdeskController
