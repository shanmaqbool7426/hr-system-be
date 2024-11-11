const { Response, BadRequest, serverError } = require('../../util/helpers')
const OnboardingTask = require('../../models/onboarding_task')
const OffboardingTask = require('../../models/offboarding_task')

const { USER_FIELDS } = require('../../util/config')
class OnboardingController {

  async settings(req, res) {
    try {
      const { user } = req.payload

      const onboardingTasks = await OnboardingTask.find({ company: user.company._id })
        .populate('createdBy', USER_FIELDS)
      const offboardingTasks = await OffboardingTask.find({ company: user.company._id })
        .populate('createdBy', USER_FIELDS)

      return Response(res, { onboardingTasks, offboardingTasks })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async create(req, res) {
    try {
      const { user } = req.payload
      const data = req.body

      let task = await OnboardingTask.create({
        name: data.name,
        company: user.company._id,
        createdBy: user._id
      })

      return Response(res, { task })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async updateTask(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const data = req.body
      let task = await OnboardingTask.findOne({ _id: id, company: user.company._id })
      if (!task) {
        return BadRequest(res, "Task not found")
      }
      if (data.name) task.name = data.name
      if (Object.keys(data).includes('active')) task.active = Boolean(data.active)
      await task.save()
      return Response(res, { task })
    } catch (error) {
      return serverError(res, error)
    }
  }

}

module.exports = new OnboardingController
