const { Response, BadRequest, serverError } = require('../../util/helpers')
const OnboardingTask = require('../../models/onboarding_task')
const OnboardingAsset = require('../../models/onboarding_asset')
const OffboardingTask = require('../../models/offboarding_task')
const CustomField = require('../../models/custom_field')
const User = require('../../models/user')

class OnboardingController {

  async settings(req, res) {
    try {
      const { user } = req.payload

      const onboarding_tasks = await OnboardingTask.find({ company: user.company._id })
      const onboarding_assets = await OnboardingAsset.find({ company: user.company._id }).populate('assetType')
      const offboarding_tasks = await OffboardingTask.find({ company: user.company._id })

      return Response(res, { onboarding_tasks, offboarding_tasks, onboarding_assets })
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

  async createAsset(req, res) {
    try {
      const { user } = req.payload
      const data = req.body
      let asset = await OnboardingAsset.create({
        assetType: data.assetType,
        company: user.company._id,
        createdBy: user._id
      })
      asset = await asset.populate('assetType')
      return Response(res, { asset })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async updateAsset(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      const data = req.body
      let asset = await OnboardingAsset.findOne({ _id: id, company: user.company._id })
      if (!asset) {
        return BadRequest(res, "Asset not found")
      }
      if (data.assetType) asset.assetType = data.assetType
      if (Object.keys(data).includes('active')) asset.active = Boolean(data.active)
      await asset.save()
      asset = await asset.populate('assetType')
      return Response(res, { asset })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async deleteAsset(req, res) {
    try {
      const { user } = req.payload
      const { id } = req.params
      let asset = await OnboardingAsset.findOne({ _id: id, company: user.company._id })
      if (!asset) {
        return BadRequest(res, "Asset not found")
      }
      await OnboardingAsset.deleteOne({ _id: id, company: user.company._id })
      return Response(res, { message: "Asset deleted successfully" })
    } catch (error) {
      return serverError(res, error)
    }
  }

  async getOnboardingEmployees(req, res) {
    try {
      const { user } = req.payload
      const status = await CustomField.findOne({ name: "On Boarding" })
      const employees = await User.find({ company: user.company._id, status: status._id }, "_id firstName lastName email avatar employeeCode")
        .populate('department')
        .populate('designation')
        .populate('status')
      return Response(res, { employees })
    } catch (error) {
      return serverError(res, error)
    }
  }
}

module.exports = new OnboardingController
