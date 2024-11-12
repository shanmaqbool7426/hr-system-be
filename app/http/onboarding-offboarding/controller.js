const { Response, BadRequest, serverError } = require('../../util/helpers')
const OnboardingTask = require('../../models/onboarding_task')
const OffboardingTask = require('../../models/offboarding_task')

// const { USER_FIELDS } = require('../../util/config')

class OnboardingController {

  async settings(req, res) {
    try {
      const { user } = req.payload

      const onboarding_tasks = await OnboardingTask.find({ company: user.company._id })
      const offboarding_tasks = await OffboardingTask.find({ company: user.company._id })

      return Response(res, { onboarding_tasks, offboarding_tasks, onboarding_assets: [] })
    } catch (error) {
      return serverError(res, error)
    }
  }
  async createTask(req, res) {
    try {
      const { user } = req.payload
      const data = req.body
      const type = req.params.type
      const Model = type === 'onboarding' ? OnboardingTask : OffboardingTask
      let task = await Model.create({
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
      const { id, type } = req.params
      const data = req.body
      const Model = type === 'onboarding' ? OnboardingTask : OffboardingTask
      let task = await Model.findOne({ _id: id, company: user.company._id })
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

  async deleteTask(req, res) {
    try {
      const { user } = req.payload
      const { id, type } = req.params
      const Model = type === 'onboarding' ? OnboardingTask : OffboardingTask
      let task = await Model.findOne({ _id: id, company: user.company._id })
      if (!task) {
        return BadRequest(res, "Task not found")
      }
      await Model.deleteOne({ _id: id, company: user.company._id })
      return Response(res, { message: "Task deleted successfully" })
    } catch (error) {
      return serverError(res, error)
    }
  }

}

module.exports = new OnboardingController
