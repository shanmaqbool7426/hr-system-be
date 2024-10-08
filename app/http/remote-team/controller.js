const { Response, BadRequest, serverError } = require('../../util/helpers')
const RemoteTeam = require('../../models/remote_team')
const { USER_FIELDS } = require('../../util/config')
class RemoteTeamController {
  async #getTeam(id) {
    return await RemoteTeam.findById(id)
      .populate('modifiedBy', USER_FIELDS)
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await RemoteTeam.find({ company: user.company._id })
        .populate('modifiedBy', USER_FIELDS)
      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let team = await RemoteTeam.create({
        name: data.name,
        company: user.company._id,
        modifiedBy: user._id
      })
      team = await this.#getTeam(team._id)
      return Response(res, { team })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let team = await RemoteTeam.findOne({ _id: req.params.id, company: user.company._id })
      if (!team) return BadRequest(res)

      if (data?.name) team.name = data.name
      team.modifiedBy = user._id
      await team.save()
      team = await this.#getTeam(team._id)
      return Response(res, { team })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async delete(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const team = await RemoteTeam.findOne({ _id: id, company: user.company._id })
      if (!team) return BadRequest(res)

      await team.deleteOne({ _id: id })

      return Response(res, { message: "Team deleted successfully" })
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new RemoteTeamController
