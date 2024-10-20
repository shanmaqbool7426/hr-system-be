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
  async list(req, res) {
    try {
      const { user } = req.payload
      const { user: userId } = req.query
      let filter = { company: user.company._id }
      if (userId) filter.$or = [{ createdBy: userId }, { assignedTo: userId }]
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
}

module.exports = new HelpdeskController
