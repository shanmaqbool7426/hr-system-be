const { Response, BadRequest, serverError, NotFound } = require('../../util/helpers')
const User = require("../../models/user")
const UserChangeRequest = require("../../models/user_change_request")

class ChangeRequestController {

    async list(req, res) {
        try {
            const { user } = req.payload

            let list = await UserChangeRequest.find({ company: user.company._id })
                .populate('employee')
                .populate('designation')
                .populate('department')
                .populate('lineManager')
                .populate('grade')
                .populate('user')

            return Response(res, { list })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async designation(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let employee = await User.findOne({ _id: data.employee, company: user.company._id })
            if (!employee) {
                return NotFound(res)
            }
            let insert = {
                employee: data.employee,
                designation: data.designation,
                effectiveDate: data.effectiveDate,
                reason: data.reason,
                currentValue: data.currentValue,
                type: "designation",
                user: user._id,
                company: user.company._id
            }
            if (data.detail) insert.detail = data.detail
            if (data.attachment) insert.attachment = data.attachment

            const changeRequest = await UserChangeRequest.create(insert)
            if (new Date(data.effectiveDate) <= new Date) {
                employee.designation = data.designation
                await employee.save()
            }

            return Response(res, {
                changeRequest
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async department(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let employee = await User.findOne({ _id: data.employee, company: user.company._id })
            if (!employee) {
                return NotFound(res)
            }
            let insert = {
                employee: data.employee,
                department: data.department,
                effectiveDate: data.effectiveDate,
                reason: data.reason,
                currentValue: data.currentValue,
                type: "department",
                user: user._id,
                company: user.company._id
            }
            if (data.detail) insert.detail = data.detail
            if (data.attachment) insert.attachment = data.attachment

            const changeRequest = await UserChangeRequest.create(insert)
            if (new Date(data.effectiveDate) <= new Date) {
                employee.department = data.department
                await employee.save()
            }

            return Response(res, {
                changeRequest
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async employeeCode(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let employee = await User.findOne({ _id: data.employee, company: user.company._id })
            if (!employee) {
                return NotFound(res)
            }
            let insert = {
                employee: data.employee,
                employeeCode: data.employeeCode,
                effectiveDate: data.effectiveDate,
                reason: data.reason,
                currentValue: data.currentValue,
                type: "employeeCode",
                user: user._id,
                company: user.company._id
            }
            if (data.detail) insert.detail = data.detail
            if (data.attachment) insert.attachment = data.attachment

            const changeRequest = await UserChangeRequest.create(insert)
            if (new Date(data.effectiveDate) <= new Date) {
                employee.employeeCode = data.employeeCode
                await employee.save()
            }

            return Response(res, {
                changeRequest
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async salary(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let employee = await User.findOne({ _id: data.employee, company: user.company._id })
            if (!employee) {
                return NotFound(res)
            }
            let insert = {
                employee: data.employee,
                salary: data.salary,
                effectiveDate: data.effectiveDate,
                reason: data.reason,
                currentValue: data.currentValue,
                type: "salary",
                user: user._id,
                company: user.company._id
            }
            if (data.detail) insert.detail = data.detail
            if (data.attachment) insert.attachment = data.attachment

            const changeRequest = await UserChangeRequest.create(insert)
            if (new Date(data.effectiveDate) <= new Date) {
                employee.salary = data.salary
                await employee.save()
            }

            return Response(res, {
                changeRequest
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async grade(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let employee = await User.findOne({ _id: data.employee, company: user.company._id })
            if (!employee) {
                return NotFound(res)
            }
            let insert = {
                employee: data.employee,
                grade: data.grade,
                effectiveDate: data.effectiveDate,
                reason: data.reason,
                currentValue: data.currentValue,
                type: "grade",
                user: user._id,
                company: user.company._id
            }
            if (data.detail) insert.detail = data.detail
            if (data.attachment) insert.attachment = data.attachment

            const changeRequest = await UserChangeRequest.create(insert)
            if (new Date(data.effectiveDate) <= new Date) {
                employee.grade = data.grade
                await employee.save()
            }

            return Response(res, {
                changeRequest
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async lineManager(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let employee = await User.findOne({ _id: data.employee, company: user.company._id })
            if (!employee) {
                return NotFound(res)
            }
            let insert = {
                employee: data.employee,
                lineManager: data.lineManager,
                effectiveDate: data.effectiveDate,
                reason: data.reason,
                currentValue: data.currentValue,
                type: "lineManager",
                user: user._id,
                company: user.company._id
            }
            if (data.detail) insert.detail = data.detail
            if (data.attachment) insert.attachment = data.attachment

            const changeRequest = await UserChangeRequest.create(insert)
            if (new Date(data.effectiveDate) <= new Date) {
                employee.lineManager = data.lineManager
                await employee.save()
            }

            return Response(res, {
                changeRequest
            })
        } catch (error) {
            return serverError(res, error)
        }
    }


}


module.exports = new ChangeRequestController