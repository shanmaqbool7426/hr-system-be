const { Response, BadRequest, serverError } = require('../../util/helpers')
const User = require("../../models/user")
const Company = require("../../models/company")
const bcrypt = require("bcryptjs");
const Mailer = require('../../util/mailer')
const UserCredentialsEmail = require('../../emails/userCredentials')
class EmployeeController {
    async list(req, res) {
        try {
            let { filters } = req.query
            const { user } = req.payload
            let _filters = { company: user.company._id }
            if (filters) {
                filters = JSON.parse(filters)
                for (let key in filters) {
                    if (key !== 'search' && filters[key] && filters[key] !== 'all') {
                        _filters[key] = filters[key]
                    }
                }
                if (Object.keys(filters).indexOf('search') !== -1 && filters.search.length > 0) {
                    _filters.$or = [
                        { firstName: { $regex: filters.search, $options: 'i' } },
                        { lastName: { $regex: filters.search, $options: 'i' } },
                    ]
                }
            }

            let data = await User.find(_filters)
                .populate('designation')
                .populate('status')
                .populate('workMode')
                .populate('lineManager')

            return Response(res, { list: data })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async details(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let employee = await User.findOne({
                _id: id, company: user.company._id
            }).select("-password -devices")
                .populate('academicsHistory')
                .populate('jobExperiences')
                .populate('designation')
                .populate('status')
                .populate('workMode')
                .populate('grade')
                .populate('station')
                .populate('gender')
                .populate('maritalStatus')
                .populate('lineManager')

            return Response(res, {
                employee
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async create(req, res) {
        try {
            const { user } = req.payload
            const data = req.body
            let insert = {
                firstName: data.firstName,
                lastName: data.lastName,
                fatherName: data.fatherName,
                email: data.email,
                dateOfBirth: data.dateOfBirth,
                contact: data.contact,
                employeeCode: data.employeeCode,
                designation: data.designation,
                joiningDate: data.joiningDate,
                status: data.status,
                employeeCode: user.company.currentEmployeeCode,
                company: user.company._id
            }

            insert.mobileAttendance = !!data?.mobileAttendance
            insert.webAttendance = !!data?.webAttendance
            if (data?.password) insert.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10))
            if (data?.department) insert.department = data.department
            if (data?.lineManager && data?.lineManager !== 'none') insert.lineManager = data.lineManager
            if (data?.avatar) insert.avatar = data.avatar
            if (data?.role) insert.role = data.role
            if (data?.cnic) insert.cnic = data.cnic
            if (data?.fatherCnic) insert.fatherCnic = data.fatherCnic
            if (data?.canLogin) {
                insert.canLogin = data.canLogin
                Mailer.sendEmail(data?.email, 'Sign Credentials', UserCredentialsEmail(data?.firstName + " " + data?.lastName, data?.email, data?.password))
            }

            let employee = await User.create(insert)
            await Company.updateOne({ _id: user.company._id }, { $set: { currentEmployeeCode: (parseInt(user.company.currentEmployeeCode) + 1).toString() } })
            employee = await User.findById(employee._id)
                .populate('designation')
                .populate('status')
                .populate('workMode')
                .populate('lineManager')
            return Response(res, {
                employee
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload

            let employee = await User.findOne({
                _id: id, company: user.company._id
            }).select("-password -devices")
            if (!employee) {
                return BadRequest(res, 'employeeNotFound')
            }
            const data = req.body

            if (data?.firstName) employee.firstName = data.firstName
            if (data?.lastName) employee.lastName = data.lastName
            if (data?.fatherName) employee.fatherName = data.fatherName
            if (data?.dateOfBirth) employee.dateOfBirth = data.dateOfBirth
            if ((Object.keys(data)).includes('mobileAttendance')) employee.mobileAttendance = !!data.mobileAttendance
            if ((Object.keys(data)).includes('webAttendance')) employee.webAttendance = !!data.webAttendance
            if (data?.department) employee.department = data.department
            if (data?.lineManager && lineManager !== 'none') employee.lineManager = data.lineManager
            else if (data?.lineManager === 'none') employee.lineManager = null
            if (data?.avatar) employee.avatar = data.avatar
            if (data?.role) employee.role = data.role
            if (data?.cnic) employee.cnic = data.cnic
            if (data?.fatherCnic) employee.fatherCnic = data.fatherCnic
            if (data?.employeeCode) employee.employeeCode = data.employeeCode
            if (data?.joiningDate) employee.joiningDate = data.joiningDate
            if (data?.contact) employee.contact = data.contact
            if (data?.passportNumber) employee.passportNumber = data.passportNumber
            if (data?.gender) employee.gender = data.gender
            if (data?.maritalStatus) employee.maritalStatus = data.maritalStatus
            if (data?.nationality) employee.nationality = data.nationality
            if (data?.religion) employee.religion = data.religion
            if (data?.emergencyContact) employee.emergencyContact = data.emergencyContact
            if (data?.nextOfKin) employee.nextOfKin = data.nextOfKin
            if (data?.reference1) employee.reference1 = data.reference1
            if (data?.reference2) employee.reference2 = data.reference2
            if (data?.bankDetails) employee.bankDetails = data.bankDetails
            if (data?.cnicIssueDate) employee.cnicIssueDate = data.cnicIssueDate
            if (data?.cnicExpiryDate) employee.cnicExpiryDate = data.cnicExpiryDate
            if (data?.EOBI) employee.EOBI = data.EOBI
            if (data?.SSA) employee.SSA = data.SSA
            if (data?.grade) employee.grade = data.grade
            if (data?.station) employee.station = data.station
            if (data?.address) employee.address = data.address

            await employee.save()

            return Response(res, {
                employee
            })
        } catch (error) {
            return serverError(res, error)
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const { user } = req.payload
            let exists = await User.findOne({
                _id: id, company: user.company._id
            })
            if (!exists) {
                return BadRequest(res, 'employeeNotFound')
            }
            await User.deleteOne({
                _id: id, company: user.company._id
            })
            return Response(res)
        } catch (error) {
            return serverError(res, error)
        }
    }
}

module.exports = new EmployeeController