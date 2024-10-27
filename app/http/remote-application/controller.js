const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const Application = require('../../models/remote_application')
class RemoteApplicationController {

  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await Application.find({ company: user.company._id }).populate("category")

      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async update(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      await Application.updateMany({ _id: { $in: data.ids } }, {
        $set: {
          category: data.category,
          nature: data.nature
        }
      })
      const list = await Application.find({ company: user.company._id }).populate("category")
      return Response(res, { list })
    } catch (error) {
      return serverError(res, error)
    }
  }

}

module.exports = new RemoteApplicationController
