const { Response, BadRequest, serverError } = require('../../util/helpers')
const Process = require('../../models/remote_process')
class RemoteApplicationController {

  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await Process.find({ company: user.company._id })

      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload

      return Response(res, {})
    } catch (error) {
      return serverError(res, error)
    }
  }

}

module.exports = new RemoteApplicationController
