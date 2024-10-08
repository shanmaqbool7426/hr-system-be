const { Response, BadRequest, serverError } = require('../../util/helpers')
const RemoteCategory = require('../../models/remote_category')
const { USER_FIELDS } = require('../../util/config')
class RemoteCategoryController {
  async #getCategory(id) {
    return await RemoteCategory.findById(id)
      .populate('modifiedBy', USER_FIELDS)
  }
  async list(req, res) {
    try {
      const { user } = req.payload
      const list = await RemoteCategory.find({ company: user.company._id })
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

      let category = await RemoteCategory.create({
        name: data.name,
        color: data.color,
        company: user.company._id,
        modifiedBy: user._id
      })
      category = await this.#getCategory(category._id)
      return Response(res, { category })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async update(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let category = await RemoteCategory.findOne({ _id: req.params.id, company: user.company._id })
      if (!category) return BadRequest(res)

      if (data?.name) category.name = data.name
      if (data?.color) category.color = data.color
      category.modifiedBy = user._id
      await category.save()
      category = await this.#getCategory(category._id)
      return Response(res, { category })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async delete(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const category = await RemoteCategory.findOne({ _id: id, company: user.company._id })
      if (!category) return BadRequest(res)

      await category.deleteOne({ _id: id })

      return Response(res, { message: "Category deleted successfully" })
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new RemoteCategoryController
